from typing import Any
from app.api import deps
from datetime import timedelta
from sqlalchemy.orm import Session
from app.models.models import User
from app.core.config import settings
from fastapi.security import OAuth2PasswordRequestForm
from app.schemas.schemas import UserCreate, UserResponse
from fastapi import APIRouter, Depends, HTTPException, Response
from app.core.security import create_access_token, get_password_hash, verify_password

router = APIRouter()

def set_auth_cookie(response: Response, token: str):
    """Helper to set the secure cookie consistently"""
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,   
        max_age=1800,    
        expires=1800,
        samesite="lax",  
        secure=False     
    )

@router.post("/login", response_model=UserResponse)
def login_access_token(
    response: Response,
    db: Session = Depends(deps.get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )

    set_auth_cookie(response, access_token)
    
    return user

@router.post("/register", status_code=201, response_model=UserResponse)
def register_user(
    *,
    response: Response,
    db: Session = Depends(deps.get_db),
    user_in: UserCreate,
) -> Any:
    """
    Create new user and AUTO-LOGIN by setting the cookie immediately.
    """
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system",
        )
    
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

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )

    set_auth_cookie(response, access_token)

    return user

@router.post("/logout")
def logout(response: Response):
    """
    Logout by destroying the cookie.
    """
    response.delete_cookie("access_token")
    return {"message": "Logged out successfully"}