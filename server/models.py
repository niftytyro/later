from typing import Optional
from sqlmodel import SQLModel, Field, UniqueConstraint


class Users(SQLModel, table=True):
    __table_args__ = (UniqueConstraint("email"),)

    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(index=True)
    name: str
    password: str


class UserLogin(SQLModel):
    email: str
    password: str


class ResponseModel(SQLModel):
    key: str
    message: Optional[str]