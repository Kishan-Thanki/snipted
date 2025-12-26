from typing import Generator
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from app.models.models import User
from pydantic import ValidationError
from app.core.config import settings
from app.db.session import SessionLocal
from app.core.security import ALGORITHM
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException, status, Request

reusable_oauth2 = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login", auto_error=False)

def get_db() -> Generator:
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()

def get_current_user(
    request: Request,
    db: Session = Depends(get_db),
    token_header: str = Depends(reusable_oauth2) 
) -> User:
    """
    Prioritizes HTTP-Only Cookie. Falls back to Header (for testing tools).
    """
    token = request.cookies.get("access_token")
    
    if not token and token_header:
        token = token_header

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated (Missing Cookie or Token)",
        )

    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGORITHM])
        token_data = payload.get("sub")
        if token_data is None:
            raise HTTPException(status_code=403, detail="Could not validate credentials")
    except (JWTError, ValidationError):
        raise HTTPException(status_code=403, detail="Could not validate credentials")

    user = db.query(User).filter(User.email == token_data).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user