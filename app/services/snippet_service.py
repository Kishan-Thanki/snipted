from sqlmodel import Session
from app.crud import crud_tag
from app.models.models import Snippet, User
from app.schemas.schemas import SnippetCreate

def create_snippet_with_tags(
    session: Session, 
    snippet_in: SnippetCreate, 
    current_user: User
) -> Snippet:
    """
    Logic:
    1. Parse tag strings.
    2. Find existing tags or create new ones.
    3. Save Snippet and link everything.
    """
    
    db_tags = []
    for tag_name in set(snippet_in.tags):
        clean_name = tag_name.strip().lower()
        if not clean_name: 
            continue 
            
        existing_tag = crud_tag.get_tag_by_name(session, clean_name)
        if existing_tag:
            db_tags.append(existing_tag)
        else:
            new_tag = crud_tag.create_tag(session, clean_name)
            db_tags.append(new_tag)

    snippet_data = snippet_in.model_dump(exclude={"tags"})
    
    db_snippet = Snippet(**snippet_data)
    db_snippet.user = current_user
    db_snippet.tags = db_tags  

    session.add(db_snippet)
    session.commit()
    session.refresh(db_snippet)
    
    return db_snippet