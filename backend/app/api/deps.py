from jose import jwt, JWTError
from sqlalchemy.orm import Session
from app.models.models import User
from app.core.config import settings
from typing import Generator, Optional
from app.db.session import SessionLocal
from app.core.security import ALGORITHM
from fastapi import Depends, HTTPException, status, Request, Header

def get_db() -> Generator:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(
    request: Request,
    db: Session = Depends(get_db),
    authorization: Optional[str] = Header(None),
) -> User:
    token: Optional[str] = None
    if authorization and authorization.startswith("Bearer "):
        token = authorization.replace("Bearer ", "")
    if not token:
        token = request.cookies.get("access_token")
    
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Not authenticated"
        )

    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGORITHM])
        email: str | None = payload.get("sub")
        if not email:
            raise HTTPException(status_code=403, detail="Not enough permissions")
    except JWTError:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    user = db.query(User).filter(User.email == email).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    
    return user

def validate_csrf(request: Request, x_csrf_token: str = Header(None)):
    current_env = str(settings.ENVIRONMENT).lower().strip()
    
    if current_env == "testing":
        return True
        
    csrf_cookie = request.cookies.get("csrf_token")
    
    if not csrf_cookie or csrf_cookie != x_csrf_token:
        raise HTTPException(
            status_code=403, 
            detail="CSRF token invalid"
        )
    return True