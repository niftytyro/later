import re


def validate_email(email: str) -> bool:
    email_regex = r"^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$"
    if re.fullmatch(email_regex, email):
        return True
    return False


def validate_password(password: str) -> bool:
    password_regex = r"^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[@#$])[\w\d!@#$%^&*\(\)\[\]\{\},./;:'\"]{8,24}$"
    if re.match(password_regex, password):
        return True
    return False


def validate_name(name: str) -> bool:
    name_regex = r"^[A-Za-z][A-Za-z ]+[A-Za-z]$"
    if re.match(name_regex, name):
        return True
    return False
