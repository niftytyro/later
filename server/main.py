from datetime import datetime, timedelta, timezone
from typing import Generator, List

import bcrypt
import jwt
import uvicorn
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, Request, Response, status
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, SQLModel, select

# load env variables
load_dotenv()

from . import constants, models
from .database import engine
from .utils.response import Response_Key, generate_response
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
        return generate_response(Response_Key.INTERNAL_SERVER_ERROR)

    token = request.cookies[constants.JWT_COOKIE_KEY]

    user_details = jwt.decode(token, constants.JWT_SECRET, algorithms=["HS256"])
    user_id = user_details["id"]
    if not isinstance(user_id, int):
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return generate_response(Response_Key.UNATUHENTICATED)

    user = db.get(models.Users, user_id)
    if user is None:
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return generate_response(Response_Key.UNATUHENTICATED)
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

    return generate_response(Response_Key.SUCCESS)


@app.get("/posts", response_model=List[models.Posts])
def get_posts(
    user: models.Users | models.ResponseModel,
) -> models.ResponseModel | List[models.Posts]:
    if isinstance(user, models.ResponseModel):
        return user

    return user.posts


@app.post("/posts/create", response_model=models.ResponseModel)
def create_post(
    post_data: models.PostCreate,
    user: models.Users | models.ResponseModel = Depends(get_user),
    db: Session = Depends(get_db),
) -> models.ResponseModel:
    if isinstance(user, models.ResponseModel):
        return user

    post = models.Posts(post_id=parse_tweet_id(post_data.url), type="twitter")
    user.posts.append(post)
    db.add(user)
    db.commit()

    print(user.name, user.posts)

    return generate_response(Response_Key.SUCCESS)


@app.post("/auth/login", response_model=models.ResponseModel)
def login(
    user: models.UserLogin, response: Response, db: Session = Depends(get_db)
) -> models.ResponseModel:
    if not validate_email(user.email):
        response.status_code = status.HTTP_400_BAD_REQUEST
        return generate_response(Response_Key.EMAIL)
    if constants.JWT_SECRET is None:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return generate_response(Response_Key.INTERNAL_SERVER_ERROR)

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
            return generate_response(Response_Key.SUCCESS)
        else:
            response.status_code = status.HTTP_401_UNAUTHORIZED
            return generate_response(Response_Key.CREDENTIALS)
    except Exception as e:
        response.status_code = status.HTTP_404_NOT_FOUND
        return generate_response(Response_Key.USER_NOT_FOUND)


@app.post("/auth/signup", status_code=201, response_model=models.ResponseModel)
def signup(
    user: models.Users, response: Response, db: Session = Depends(get_db)
) -> models.ResponseModel:
    try:
        if not validate_email(user.email):
            response.status_code = status.HTTP_400_BAD_REQUEST
            return generate_response(Response_Key.EMAIL)
        if not validate_password(user.password):
            response.status_code = status.HTTP_400_BAD_REQUEST
            return generate_response(Response_Key.PASSWORD)
        if not validate_name(user.name):
            response.status_code = status.HTTP_400_BAD_REQUEST
            return generate_response(Response_Key.NAME)
        if constants.JWT_SECRET is None:
            response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
            return generate_response(Response_Key.INTERNAL_SERVER_ERROR)
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
        return generate_response(Response_Key.SUCCESS)
    except Exception:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return generate_response(Response_Key.USER_ALREADY_EXISTS)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
