from typing import Any
from app.api import deps
from datetime import timedelta
from jose import jwt, JWTError
from app.models.models import User
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.limiter import limiter
from app.core.auth_csrf import generate_csrf_token
from fastapi.security import OAuth2PasswordRequestForm
from app.schemas.schemas import UserCreate, UserResponse
from fastapi import APIRouter, Depends, HTTPException, Response, Request
from app.core.security import create_access_token, create_refresh_token, get_password_hash, verify_password, ALGORITHM

router = APIRouter()


def set_auth_cookies(response: Response, access_token: str, refresh_token: str, csrf_token: str):
    # Access token
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        max_age=1800,
        expires=1800,
        samesite=settings.COOKIE_SAMESITE,
        secure=settings.COOKIE_SECURE,
    )
    # Refresh token
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 3600,
        expires=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 3600,
        samesite=settings.COOKIE_SAMESITE,
        secure=settings.COOKIE_SECURE,
    )
    # CSRF token
    response.set_cookie(
        key="csrf_token",
        value=csrf_token,
        httponly=False,
        samesite=settings.COOKIE_SAMESITE,
        secure=settings.COOKIE_SECURE,
    )


@router.post("/login", response_model=UserResponse)
@limiter.limit("5/minute")
def login_access_token(
    request: Request,
    *,
    response: Response,
    db: Session = Depends(deps.get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")

    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    refresh_token = create_refresh_token(data={"sub": user.email})
    csrf_token = generate_csrf_token()

    set_auth_cookies(response, access_token, refresh_token, csrf_token)
    return user


@router.post(
    "/register",
    status_code=201,
    response_model=UserResponse,
    dependencies=[Depends(deps.validate_csrf)]
)
@limiter.limit("3/minute")
def register_user(
    request: Request,
    *,
    user_in: UserCreate,
    response: Response,
    db: Session = Depends(deps.get_db),
) -> Any:
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(status_code=400, detail="User already exists")
    
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

    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    refresh_token = create_refresh_token(data={"sub": user.email})
    csrf_token = generate_csrf_token()

    set_auth_cookies(response, access_token, refresh_token, csrf_token)
    return user


@router.post(
    "/logout",
    dependencies=[Depends(deps.validate_csrf)]
)
@limiter.limit("10/minute")
def logout(request: Request, *, response: Response):
    response.delete_cookie("access_token", secure=settings.COOKIE_SECURE, samesite=settings.COOKIE_SAMESITE, httponly=True)
    response.delete_cookie("refresh_token", secure=settings.COOKIE_SECURE, samesite=settings.COOKIE_SAMESITE, httponly=True)
    response.delete_cookie("csrf_token", secure=settings.COOKIE_SECURE, samesite=settings.COOKIE_SAMESITE, httponly=True)
    return {"message": "Logged out successfully"}


@router.post("/refresh", response_model=UserResponse, dependencies=[Depends(deps.validate_csrf)])
@limiter.limit("10/minute")
def refresh_token_endpoint(
    *,
    response: Response,
    db: Session = Depends(deps.get_db),
    request: Request
):
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(status_code=401, detail="No refresh token found")

    try:
        payload = jwt.decode(refresh_token, settings.SECRET_KEY, algorithms=[ALGORITHM])
        email: str | None = payload.get("sub")
        if not email:
            raise HTTPException(status_code=403, detail="Invalid refresh token")
    except JWTError:
        raise HTTPException(status_code=403, detail="Invalid refresh token")

    user = db.query(User).filter(User.email == email).first()
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="User not found or inactive")

    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    new_refresh_token = create_refresh_token(data={"sub": user.email})
    csrf_token = generate_csrf_token()

    set_auth_cookies(response, access_token, new_refresh_token, csrf_token)
    return user
