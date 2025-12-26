from typing import List, Optional
from sqlmodel import Session, select
from app.schemas.schemas import SnippetUpdate
from app.models.models import Snippet, Tag, utc_now

def get_snippet(session: Session, snippet_id: int) -> Optional[Snippet]:
    """Get a single snippet by ID."""
    return session.get(Snippet, snippet_id)

def get_multi_snippets(
    session: Session, 
    skip: int = 0, 
    limit: int = 100,
    tag_filter: Optional[str] = None
) -> List[Snippet]:
    """
    Get a list of snippets, optionally filtering by a Tag name.
    """
    statement = select(Snippet)
    
    if tag_filter:
        # Join with Tags table to filter efficiently
        statement = statement.join(Snippet.tags).where(Tag.name == tag_filter)
        
    statement = statement.offset(skip).limit(limit).order_by(Snippet.created_at.desc())
    return session.exec(statement).all()

def update_snippet(
    session: Session, 
    db_snippet: Snippet, 
    snippet_in: SnippetUpdate
) -> Snippet:
    """
    Update a snippet.
    Does NOT handle tag updates (that belongs in Service logic).
    """
    update_data = snippet_in.model_dump(exclude_unset=True)
    
    for key, value in update_data.items():
        if key != 'tags':
            setattr(db_snippet, key, value)
            
    db_snippet.updated_at = utc_now()
    
    session.add(db_snippet)
    session.commit()
    session.refresh(db_snippet)
    return db_snippet

def delete_snippet(session: Session, db_snippet: Snippet) -> Snippet:
    """Delete a snippet."""
    session.delete(db_snippet)
    session.commit()
    return db_snippet