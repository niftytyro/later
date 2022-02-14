from typing import List, Optional
from sqlmodel import Relationship, SQLModel, Field, UniqueConstraint


class UserPostLink(SQLModel, table=True):
    user_id: Optional[int] = Field(
        default=None, foreign_key="users.id", primary_key=True
    )
    post_id: Optional[int] = Field(
        default=None, foreign_key="posts.id", primary_key=True
    )


class Users(SQLModel, table=True):
    __table_args__ = (UniqueConstraint("email"),)

    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(index=True)
    name: str
    password: str

    posts: List["Posts"] = Relationship(back_populates="users", link_model=UserPostLink)


class UserLogin(SQLModel):
    email: str
    password: str


class ResponseModel(SQLModel):
    key: str
    message: Optional[str]


class Posts(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    type: str
    post_id: str

    users: List["Users"] = Relationship(back_populates="posts", link_model=UserPostLink)


class PostCreate(SQLModel):
    url: str
