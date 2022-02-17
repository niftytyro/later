from datetime import datetime, timedelta, timezone
from typing import Dict, Generator, List
from urllib import response
import httpx

import bcrypt
import jwt
import uvicorn
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, Request, Response, status
from fastapi.logger import logger
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, SQLModel, select

# load env variables
load_dotenv()

from . import constants, models
from .database import engine
from .utils.response import ResponseKey, generate_response
from .utils.twitter import parse_tweet_id
from .validations import validate_email, validate_name, validate_password


def get_db() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session


def get_user(
    request: Request, response: Response, db: Session = Depends(get_db)
) -> models.ResponseModel | models.Users:
    if constants.JWT_SECRET is None:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return generate_response(ResponseKey.INTERNAL_SERVER_ERROR)

    token = request.cookies[constants.JWT_COOKIE_KEY]

    user_details = jwt.decode(token, constants.JWT_SECRET, algorithms=["HS256"])
    user_id = user_details["id"]
    if not isinstance(user_id, int):
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return generate_response(ResponseKey.UNATUHENTICATED)

    user = db.get(models.Users, user_id)
    if user is None:
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return generate_response(ResponseKey.UNATUHENTICATED)
    return user


app = FastAPI()

origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    # create all models
    SQLModel.metadata.create_all(engine)


@app.get("/", response_model=models.ResponseModel, status_code=200)
def index(
    user: models.Users | models.ResponseModel = Depends(get_user),
) -> models.ResponseModel:

    if isinstance(user, models.ResponseModel):
        return user

    return generate_response(ResponseKey.SUCCESS)


@app.get("/post", response_model=models.ResponseModel)
def get_post(
    id: int,
    type: str,
    response: Response,
    user: models.Users | models.ResponseModel = Depends(get_user),
    db: Session = Depends(get_db),
) -> models.ResponseModel:
    if isinstance(user, models.ResponseModel):
        return user

    post = db.get(models.Posts, id)
    print(post)
    if post is not None:
        # if type=="twitter":
        ids = f"ids={post.post_id}"
        tweet_fields = "tweet.fields=author_id,public_metrics,created_at"
        user_fields = "user.fields=profile_image_url"

        tweet_response = httpx.get(
            f"{constants.TWITTER_TWEET_ENDPOINT}?{ids}&{tweet_fields}",
            headers={"authorization": f"Bearer {constants.TWITTER_AUTH_TOKEN}"},
        )
        tweet = tweet_response.json()["data"][0]

        author_response = httpx.get(
            f"{constants.TWITTER_USERS_ENDPOINT}/{tweet['author_id']}?{user_fields}",
            headers={"authorization": f"Bearer {constants.TWITTER_AUTH_TOKEN}"},
        )
        author = author_response.json()["data"]

        return generate_response(
            ResponseKey.SUCCESS,
            data={
                "id": id,
                "author": author,
                "text": tweet["text"],
                "created_at": tweet["created_at"],
                "public_metrics": tweet["public_metrics"],
            },
        )

    response.status_code = status.HTTP_400_BAD_REQUEST
    return generate_response(ResponseKey.INVALID_POST)


@app.get("/posts", response_model=List[models.Posts])
def get_posts(
    user: models.Users | models.ResponseModel = Depends(get_user),
) -> models.ResponseModel | List[models.Posts]:
    if isinstance(user, models.ResponseModel):
        return user

    return user.posts


@app.post("/posts/create", response_model=models.ResponseModel)
def create_post(
    post_data: models.PostCreate,
    response: Response,
    user: models.Users | models.ResponseModel = Depends(get_user),
    db: Session = Depends(get_db),
) -> models.ResponseModel:
    if isinstance(user, models.ResponseModel):
        return user

    post_id = parse_tweet_id(post_data.url)

    if post_id is None:
        response.status_code = 400
        return generate_response(ResponseKey.INVALID_URL)

    try:
        statement = select(models.Posts).where(
            models.Posts.post_id == post_id, models.Posts.type == "twitter"
        )
        post = db.exec(statement).first()

        if post is None:
            post = models.Posts(post_id=post_id, type="twitter")
            user.posts.append(post)
            db.add(user)
            db.commit()
            return generate_response(
                ResponseKey.SUCCESS,
                data={"id": post.id, "post_id": post.post_id, "type": "twitter"},
            )

        if user in post.users:
            response.status_code = status.HTTP_400_BAD_REQUEST
            return generate_response(ResponseKey.DUPLICATE_POST)

        user.posts.append(post)
        db.add(user)
        db.commit()
        return generate_response(
            ResponseKey.SUCCESS,
            data={"id": post.id, "post_id": post.post_id, "type": "twitter"},
        )

    except Exception as e:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return generate_response(ResponseKey.INTERNAL_SERVER_ERROR)


@app.post("/auth/login", response_model=models.ResponseModel)
def login(
    user: models.UserLogin, response: Response, db: Session = Depends(get_db)
) -> models.ResponseModel:
    if not validate_email(user.email):
        response.status_code = status.HTTP_400_BAD_REQUEST
        return generate_response(ResponseKey.EMAIL)
    if constants.JWT_SECRET is None:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return generate_response(ResponseKey.INTERNAL_SERVER_ERROR)

    try:
        statement = select(models.Users).where(models.Users.email == user.email)
        db_user = db.exec(statement).first()

        if db_user is None:
            raise

        if bcrypt.checkpw(
            user.password.encode("utf-8"),
            db_user.password.encode("utf-8"),
        ):
            token = jwt.encode(
                {
                    "id": db_user.id,
                    "exp": datetime.now(tz=timezone.utc) + timedelta(days=365 * 10),
                },
                constants.JWT_SECRET,
                "HS256",
            )
            response.set_cookie(
                constants.JWT_COOKIE_KEY,
                token,
            )
            return generate_response(ResponseKey.SUCCESS)
        else:
            response.status_code = status.HTTP_401_UNAUTHORIZED
            return generate_response(ResponseKey.CREDENTIALS)
    except Exception as e:
        response.status_code = status.HTTP_404_NOT_FOUND
        return generate_response(ResponseKey.USER_NOT_FOUND)


@app.post("/auth/signup", status_code=201, response_model=models.ResponseModel)
def signup(
    user: models.Users, response: Response, db: Session = Depends(get_db)
) -> models.ResponseModel:
    try:
        if not validate_email(user.email):
            response.status_code = status.HTTP_400_BAD_REQUEST
            return generate_response(ResponseKey.EMAIL)
        if not validate_password(user.password):
            response.status_code = status.HTTP_400_BAD_REQUEST
            return generate_response(ResponseKey.PASSWORD)
        if not validate_name(user.name):
            response.status_code = status.HTTP_400_BAD_REQUEST
            return generate_response(ResponseKey.NAME)
        if constants.JWT_SECRET is None:
            response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
            return generate_response(ResponseKey.INTERNAL_SERVER_ERROR)
        password = bcrypt.hashpw(user.password.encode("utf-8"), bcrypt.gensalt())
        db_user = models.Users(
            email=user.email, name=user.name, password=password.decode("utf-8")
        )
        db.add(db_user)
        db.commit()
        token = jwt.encode(
            {
                "id": db_user.id,
                "exp": datetime.now(tz=timezone.utc) + timedelta(days=365 * 10),
            },
            constants.JWT_SECRET,
            "HS256",
        )
        response.set_cookie(
            constants.JWT_COOKIE_KEY,
            token,
        )
        return generate_response(ResponseKey.SUCCESS)
    except Exception:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return generate_response(ResponseKey.USER_ALREADY_EXISTS)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
