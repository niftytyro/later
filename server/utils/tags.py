from typing import List
from sqlmodel import Session, select

from server import models


def map_tags(db: Session, tags: List[str]) -> List[models.Tags]:
    db_tags: List[models.Tags] = []
    for tag_name in tags:
        statement = select(models.Tags).where(models.Tags.name == tag_name)
        tag = db.exec(statement).first()
        if tag == None:
            tag = models.Tags(name=tag_name)
        db_tags.append(tag)
    return db_tags
