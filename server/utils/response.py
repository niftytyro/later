import enum
from typing import Any, Dict, Optional
from ..models import ResponseModel


class ResponseKey(enum.Enum):
    CREDENTIALS = "credentials"
    DUPLICATE_POST = "duplicate_post"
    EMAIL = "email"
    INTERNAL_SERVER_ERROR = "internal_server_error"
    INVALID_POST = "invalid_post"
    INVALID_URL = "invalid_url"
    NAME = "name"
    PASSWORD = "password"
    POST_NOT_FOUND = "post_not_found"
    SUCCESS = "success"
    UNATUHENTICATED = "unauthenticated"
    USER_ALREADY_EXISTS = "user_already_exists"
    USER_NOT_FOUND = "user_not_found"


response_messages = {
    ResponseKey.CREDENTIALS: "You entered a wrong email/password.",
    ResponseKey.DUPLICATE_POST: "You have already latered this post.",
    ResponseKey.EMAIL: "Please enter a valid email address.",
    ResponseKey.INTERNAL_SERVER_ERROR: "Oops! Something went wrong.",
    ResponseKey.INVALID_POST: "This post doesn't exist.",
    ResponseKey.INVALID_URL: "Invalid url. Please provide a valid url.",
    ResponseKey.NAME: "Please enter your real name.",
    ResponseKey.PASSWORD: "A password must be of length greater than 8 and must contain at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character.",
    ResponseKey.POST_NOT_FOUND: "This post does not exist.",
    ResponseKey.SUCCESS: "Let's gooo!",
    ResponseKey.UNATUHENTICATED: "You are not authenticated.",
    ResponseKey.USER_ALREADY_EXISTS: "Looks like the user already exists. Login instead.",
    ResponseKey.USER_NOT_FOUND: "Such a user does not exist. Signup instead.",
}


def generate_response(
    key: ResponseKey, data: Optional[Dict[str, Any]] = {}
) -> ResponseModel:
    return ResponseModel(key=key.value, message=response_messages[key], data=data)
