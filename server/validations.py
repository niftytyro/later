import re


def validate_email(email: str) -> bool:
    email_regex = r"^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$"
    return re.fullmatch(email_regex, email) is not None


def validate_password(password: str) -> bool:
    password_regex = r"^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[@#$])[\w\d!@#$%^&*\(\)\[\]\{\},./;:'\"]{8,24}$"
    return re.fullmatch(password_regex, password) is not None


def validate_name(name: str) -> bool:
    name_regex = r"^[A-Za-z][A-Za-z ]+[A-Za-z]$"
    return re.fullmatch(name_regex, name) is not None
