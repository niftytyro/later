from enum import unique
from typing import Any, Dict, List, Optional
from sqlalchemy import table
from sqlmodel import Relationship, SQLModel, Field, UniqueConstraint


class ResponseModel(SQLModel):
    key: str
    message: Optional[str]
    data: Optional[Dict[str, Any]]


class PostTagLink(SQLModel, table=True):
    post_id: Optional[int] = Field(
        default=None, foreign_key="posts.id", primary_key=True
    )
    tag_id: Optional[int] = Field(default=None, foreign_key="tags.id", primary_key=True)


class Users(SQLModel, table=True):
    __table_args__ = (UniqueConstraint("email"),)

    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(index=True)
    name: str
    password: str

    posts: List["Posts"] = Relationship(back_populates="user")


class UserLogin(SQLModel):
    email: str
    password: str


class Posts(SQLModel, table=True):
    __table_args__ = (UniqueConstraint("type", "post_id"),)
    id: Optional[int] = Field(default=None, primary_key=True)
    type: str
    post_id: str

    user_id: Optional[int] = Field(default=None, foreign_key="users.id")
    user: Optional[Users] = Relationship(back_populates="posts")
    tags: List["Tags"] = Relationship(back_populates="posts", link_model=PostTagLink)


class PostCreate(SQLModel):
    url: str
    tags: Optional[List[str]]


class PostUpdate(SQLModel):
    id: int
    tags: List[str]


class Tags(SQLModel, table=True):
    __table_args__ = (UniqueConstraint("name"),)
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field()

    posts: List["Posts"] = Relationship(back_populates="tags", link_model=PostTagLink)
