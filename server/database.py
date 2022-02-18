from sqlmodel import create_engine
import os


def get_url() -> str:
    username = os.environ.get("DB_USERNAME")
    password = os.environ.get("DB_PASSWORD")
    server = os.environ.get("DB_SERVER")
    name = os.environ.get("DB_NAME")
    return f"postgresql://{username}:{password}@{server}:5432/{name}"


DATABSE_URL = get_url()

engine = create_engine(DATABSE_URL)
