import enum
from .models import ResponseModel


class Response_Key(enum.Enum):
    CREDENTIALS = "credentials"
    EMAIL = "email"
    NAME = "name"
    PASSWORD = "password"
    INTERNAL_SERVER_ERROR = "internal_server_error"
    SUCCESS = "success"
    UNATUHENTICATED = "unauthenticated"
    USER_ALREADY_EXISTS = "user_already_exists"
    USER_NOT_FOUND = "user_not_found"


response_messages = {
    Response_Key.CREDENTIALS: "You entered a wrong email/password.",
    Response_Key.EMAIL: "Please enter a valid email address.",
    Response_Key.INTERNAL_SERVER_ERROR: "Oops! Something went wrong.",
    Response_Key.NAME: "Please enter your real name.",
    Response_Key.PASSWORD: "A password must be of length greater than 8 and must contain at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character.",
    Response_Key.SUCCESS: "Let's gooo!",
    Response_Key.UNATUHENTICATED: "You are not authenticated.",
    Response_Key.USER_ALREADY_EXISTS: "Looks like the user already exists. Login instead.",
    Response_Key.USER_NOT_FOUND: "Such a user does not exist. Signup instead.",
}


def generate_response(key: Response_Key) -> ResponseModel:
    return ResponseModel(key=key.value, message=response_messages[key])
