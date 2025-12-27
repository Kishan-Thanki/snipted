from app.api import deps
from typing import Any, List
from sqlalchemy.orm import Session
from app.models.models import User
from app.core.limiter import limiter
from fastapi import APIRouter, Depends, HTTPException, Request
from app.schemas.schemas import UserCreate, UserResponse

router = APIRouter()


@router.get("/", response_model=List[UserResponse])
@limiter.limit("10/minute")
def read_users(
    request: Request,
    *,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100
) -> Any:
    return db.query(User).offset(skip).limit(limit).all()


@router.post(
    "/",
    response_model=UserResponse,
    status_code=201,
    dependencies=[Depends(deps.validate_csrf)]
)
@limiter.limit("5/minute")
def create_user(
    request: Request,
    *,
    db: Session = Depends(deps.get_db),
    user_in: UserCreate
) -> Any:
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(status_code=400, detail="The user with this email already exists in the system")

    from app.core.security import get_password_hash
    user = User(
        email=user_in.email,
        username=user_in.username,
        hashed_password=get_password_hash(user_in.password),
        is_active=True,
        reputation_stars=0
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.get("/me", response_model=UserResponse)
@limiter.limit("20/minute")
def read_user_me(
    request: Request,
    *,
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    return current_user


@router.get("/{user_id}", response_model=UserResponse)
@limiter.limit("15/minute")
def read_user_by_id(
    request: Request,
    *,
    user_id: int,
    db: Session = Depends(deps.get_db)
) -> Any:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
