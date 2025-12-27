from app.api import deps
from sqlalchemy import or_
from sqlalchemy.orm import Session
from app.core.limiter import limiter
from typing import Any, List, Optional
from datetime import datetime, timezone
from app.models.models import User, Snippet, Tag, SnippetLike
from fastapi import APIRouter, Depends, HTTPException, Query, Request
from app.schemas.schemas import SnippetCreate, SnippetResponse, SnippetUpdate

router = APIRouter()


def utc_now():
    return datetime.now(timezone.utc)


def normalize_tag(tag: str) -> str:
    return tag.strip().lower()


# ==========================
# CREATE SNIPPET
# ==========================
@router.post("/", response_model=SnippetResponse, status_code=201)
@limiter.limit("5/minute")
def create_snippet(
    request: Request,
    *,
    db: Session = Depends(deps.get_db),
    snippet_in: SnippetCreate,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    tag_objects: List[Tag] = []

    for tag_name in snippet_in.tags:
        normalized = normalize_tag(tag_name)
        tag = db.query(Tag).filter(Tag.name == normalized).first()
        if not tag:
            tag = Tag(name=normalized)
            db.add(tag)
            db.flush()
        tag_objects.append(tag)

    snippet = Snippet(
        title=snippet_in.title,
        code_content=snippet_in.code_content,
        language=snippet_in.language,
        user_id=current_user.id,
        created_at=utc_now(),
        updated_at=utc_now(),
    )

    snippet.tags = tag_objects

    db.add(snippet)
    db.commit()
    db.refresh(snippet)
    return snippet


# ==========================
# READ SNIPPETS (LIST)
# ==========================
@router.get("/", response_model=List[SnippetResponse])
def read_snippets(
    skip: int = 0,
    limit: int = Query(default=10, le=100),
    tag: Optional[str] = None,
    q: Optional[str] = None,
    db: Session = Depends(deps.get_db),
) -> Any:
    query = db.query(Snippet)

    if tag:
        normalized_tag = normalize_tag(tag)
        query = query.join(Snippet.tags).filter(Tag.name == normalized_tag)

    if q:
        query = query.filter(
            or_(
                Snippet.title.ilike(f"%{q}%"),
                Snippet.code_content.ilike(f"%{q}%"),
            )
        )

    return (
        query.order_by(Snippet.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


# ==========================
# SEARCH (EXPLICIT ENDPOINT)
# ==========================
@router.get("/search", response_model=List[SnippetResponse])
def search_snippets(
    q: str = Query(..., min_length=1),
    db: Session = Depends(deps.get_db),
) -> Any:
    return (
        db.query(Snippet)
        .filter(
            or_(
                Snippet.title.ilike(f"%{q}%"),
                Snippet.code_content.ilike(f"%{q}%"),
            )
        )
        .order_by(Snippet.created_at.desc())
        .all()
    )


# ==========================
# READ SINGLE SNIPPET
# ==========================
@router.get("/{snippet_id}", response_model=SnippetResponse)
def read_snippet(snippet_id: int, db: Session = Depends(deps.get_db)):
    snippet = db.query(Snippet).filter(Snippet.id == snippet_id).first()
    if not snippet:
        raise HTTPException(status_code=404, detail="Snippet not found")
    return snippet


# ==========================
# UPDATE SNIPPET
# ==========================
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

    update_data = snippet_in.model_dump(exclude_unset=True)

    if "tags" in update_data:
        tag_objects: List[Tag] = []
        for tag_name in update_data["tags"]:
            normalized = normalize_tag(tag_name)
            tag = db.query(Tag).filter(Tag.name == normalized).first()
            if not tag:
                tag = Tag(name=normalized)
                db.add(tag)
                db.flush()
            tag_objects.append(tag)

        snippet.tags = tag_objects
        del update_data["tags"]

    for field, value in update_data.items():
        setattr(snippet, field, value)

    snippet.updated_at = utc_now()
    db.commit()
    db.refresh(snippet)
    return snippet


# ==========================
# DELETE SNIPPET
# ==========================
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


# ==========================
# LIKE / UNLIKE SNIPPET
# ==========================
@router.post("/{snippet_id}/like")
def like_snippet(
    snippet_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
):
    snippet = db.query(Snippet).filter(Snippet.id == snippet_id).first()
    if not snippet:
        raise HTTPException(status_code=404, detail="Snippet not found")

    owner = db.query(User).filter(User.id == snippet.user_id).first()
    existing_like = (
        db.query(SnippetLike)
        .filter(
            SnippetLike.user_id == current_user.id,
            SnippetLike.snippet_id == snippet_id,
        )
        .first()
    )

    if existing_like:
        db.delete(existing_like)
        if owner and owner.reputation_stars > 0:
            owner.reputation_stars -= 1
        db.commit()
        return {"is_liked": False}

    db.add(
        SnippetLike(
            user_id=current_user.id,
            snippet_id=snippet_id,
            liked_at=utc_now(),
        )
    )
    if owner:
        owner.reputation_stars += 1
    db.commit()
    return {"is_liked": True}
