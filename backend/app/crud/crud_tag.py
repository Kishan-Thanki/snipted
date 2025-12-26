from typing import Optional
from app.models.models import Tag
from sqlmodel import Session, select

def get_tag_by_name(session: Session, name: str) -> Optional[Tag]:
    """Find a tag strictly by name (exact match)."""
    statement = select(Tag).where(Tag.name == name)
    return session.exec(statement).first()

def create_tag(session: Session, name: str) -> Tag:
    """Create a new tag."""
    tag = Tag(name=name)
    session.add(tag)
    session.commit()
    session.refresh(tag)
    return tag