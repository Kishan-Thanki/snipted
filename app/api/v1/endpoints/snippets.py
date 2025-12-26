from app.api import deps
from sqlalchemy import or_  
from sqlalchemy.orm import Session
from app.core.limiter import limiter
from typing import Any, List, Optional
from datetime import datetime, timezone
from app.models.models import User, Snippet, Tag, SnippetLike
from fastapi import APIRouter, Depends, HTTPException, Query, Path, Request
from app.schemas.schemas import SnippetCreate, SnippetResponse, SnippetUpdate

router = APIRouter()

def utc_now():
    return datetime.now(timezone.utc)

@router.post("/", response_model=SnippetResponse, status_code=201)
@limiter.limit("5/minute")
def create_snippet(
    request: Request,
    *,
    db: Session = Depends(deps.get_db),
    snippet_in: SnippetCreate,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Create a new snippet with tags.
    (Rate Limit: 5 per minute)
    """
    tag_objects = []
    for tag_name in snippet_in.tags:
        tag = db.query(Tag).filter(Tag.name == tag_name).first()
        if not tag:
            tag = Tag(name=tag_name)
            db.add(tag)
            db.commit()
            db.refresh(tag)
        tag_objects.append(tag)

    snippet = Snippet(
        title=snippet_in.title,
        code_content=snippet_in.code_content,
        language=snippet_in.language,
        user_id=current_user.id,
        created_at=utc_now(),
        updated_at=utc_now()
    )

    snippet.tags = tag_objects
    
    db.add(snippet)
    db.commit()
    db.refresh(snippet)
    return snippet

@router.get("/", response_model=List[SnippetResponse])
def read_snippets(
    skip: int = 0,
    limit: int = Query(default=10, le=100, description="Max 100 items per page"),
    tag: Optional[str] = Query(None, description="Filter by tag name"),
    q: Optional[str] = Query(None, description="Search title or code content"), 
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get all snippets. 
    Supports filtering by TAG and searching by QUERY (q).
    """
    query = db.query(Snippet)

    if tag:
        query = query.join(Snippet.tags).filter(Tag.name == tag)
    
    if q:
        search_filter = f"%{q}%"
        query = query.filter(
            or_(
                Snippet.title.ilike(search_filter),
                Snippet.code_content.ilike(search_filter)
            )
        )

    snippets = query.order_by(Snippet.created_at.desc()).offset(skip).limit(limit).all()
        
    return snippets

@router.get("/{snippet_id}", response_model=SnippetResponse)
def read_snippet(
    snippet_id: int,
    db: Session = Depends(deps.get_db),
) -> Any:
    snippet = db.query(Snippet).filter(Snippet.id == snippet_id).first()
    if not snippet:
        raise HTTPException(status_code=404, detail="Snippet not found")
    return snippet

@router.put("/{snippet_id}", response_model=SnippetResponse)
def update_snippet(
    snippet_id: int,
    snippet_in: SnippetUpdate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    snippet = db.query(Snippet).filter(Snippet.id == snippet_id).first()
    if not snippet:
        raise HTTPException(status_code=404, detail="Snippet not found")
    
    if snippet.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    snippet.title = snippet_in.title
    snippet.code_content = snippet_in.code_content
    snippet.language = snippet_in.language
    snippet.updated_at = utc_now()

    if snippet_in.tags is not None:
        tag_objects = []
        for tag_name in snippet_in.tags:
            tag = db.query(Tag).filter(Tag.name == tag_name).first()
            if not tag:
                tag = Tag(name=tag_name)
                db.add(tag)
                db.commit()
                db.refresh(tag)
            tag_objects.append(tag)
        snippet.tags = tag_objects

    db.add(snippet)
    db.commit()
    db.refresh(snippet)
    return snippet

@router.delete("/{snippet_id}", status_code=204)
def delete_snippet(
    snippet_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
):
    snippet = db.query(Snippet).filter(Snippet.id == snippet_id).first()
    if not snippet:
        raise HTTPException(status_code=404, detail="Snippet not found")
        
    if snippet.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
        
    db.delete(snippet)
    db.commit()
    return None

@router.post("/{snippet_id}/like", status_code=200)
def like_snippet(
    snippet_id: int = Path(..., title="The ID of the snippet to like"),
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
):
    snippet = db.query(Snippet).filter(Snippet.id == snippet_id).first()
    if not snippet:
        raise HTTPException(status_code=404, detail="Snippet not found")

    existing_like = db.query(SnippetLike).filter(
        SnippetLike.user_id == current_user.id,
        SnippetLike.snippet_id == snippet_id
    ).first()

    if existing_like:
        db.delete(existing_like)
        db.commit()
        return {"msg": "Unliked", "is_liked": False}
    else:
        new_like = SnippetLike(
            user_id=current_user.id, 
            snippet_id=snippet_id,
            liked_at=utc_now()
        )
        db.add(new_like)
        db.commit()
        return {"msg": "Liked", "is_liked": True}