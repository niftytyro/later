from dotenv import load_dotenv
from typing import Generator
from fastapi import Cookie, Depends, FastAPI, Response, status
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, Session
import jwt
import bcrypt
import os
import uvicorn

# load env variables
load_dotenv()

from . import models, constants
from .database import engine
from .validations import validate_email, validate_password, validate_name


def get_db() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session


# def get_user() -> None:
#     return {}

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


@app.get("/", response_model=models.ResponseModel)
def index(
    response: Response, cookie: str | None = Cookie(None)
) -> models.ResponseModel:
    response.status_code = status.HTTP_401_UNAUTHORIZED
    return models.ResponseModel(key="Not Authenticated")


@app.post("/auth/login", response_model=models.ResponseModel)
def login(
    user: models.UserLogin, response: Response, db: Session = Depends(get_db)
) -> models.ResponseModel:
    if not validate_email(user.email):
        response.status_code = status.HTTP_400_BAD_REQUEST
        return models.ResponseModel(
            key="Invalid Email", message="Please enter a valid email address."
        )
    if not validate_password(user.password):
        response.status_code = status.HTTP_400_BAD_REQUEST
        return models.ResponseModel(
            key="Invalid Password",
            message="A password must be of length greater than 8 and must contain at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character.",
        )
    db_user = db.get(models.Users, user.email)
    if db_user is not None:
        if bcrypt.checkpw(
            bytes(db_user.password, encoding="utf-8"),
            bytes(user.password, encoding="utf-8"),
        ):
            jwt_secret = os.environ.get("JWT_SECRET")
            if jwt_secret is not None:
                token = jwt.encode({"id": db_user.id}, jwt_secret, "HS256")
                response.set_cookie(
                    constants.JWT_COOKIE_KEY,
                    token,
                )
                return models.ResponseModel(key="Success")
            else:
                response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
                return models.ResponseModel(key="Oops! Something went wrong.")
        else:
            response.status_code = status.HTTP_401_UNAUTHORIZED
            return models.ResponseModel(
                key="Invalid Credentials.",
                message="You entered a wrong email/password.",
            )
    else:
        response.status_code = status.HTTP_404_NOT_FOUND
        return models.ResponseModel(
            key="User Not Found",
            message="The user does not exist. Sign up instead.",
        )


@app.post("/auth/signup", status_code=201, response_model=models.ResponseModel)
def signup(
    user: models.Users, response: Response, db: Session = Depends(get_db)
) -> models.ResponseModel:
    try:
        if not validate_email(user.email):
            response.status_code = status.HTTP_400_BAD_REQUEST
            return models.ResponseModel(
                key="Invalid Email", message="Please enter a valid email address."
            )
        if not validate_password(user.password) or not validate_name(user.name):
            response.status_code = status.HTTP_400_BAD_REQUEST
            return models.ResponseModel(
                key="Invalid Password",
                message="A password must be of length greater than 8 and must contain at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character.",
            )
        if not validate_name(user.name):
            response.status_code = status.HTTP_400_BAD_REQUEST
            return models.ResponseModel(
                key="Invalid Email", message="Please enter your real name."
            )
        password = bcrypt.hashpw(
            bytes(user.password, encoding="utf-8"), bcrypt.gensalt()
        )
        db_user = models.Users(email=user.email, name=user.name, password=password)
        db.add(db_user)
        db.commit()
        jwt_secret = os.environ.get("JWT_SECRET")
        if jwt_secret is not None:
            token = jwt.encode({"id": db_user.id}, jwt_secret, "HS256")
            response.set_cookie(
                constants.JWT_COOKIE_KEY,
                token,
            )
            return models.ResponseModel(key="Success")
        else:
            response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
            return models.ResponseModel(key="Oops! Something went wrong.")
    except Exception:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return models.ResponseModel(
            key="User Already Exists",
            message="Looks like the user already exists. Login instead.",
        )


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
