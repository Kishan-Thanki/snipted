import secrets
from fastapi import Request, Header, HTTPException, status

def generate_csrf_token() -> str:
    return secrets.token_urlsafe(32)

def validate_csrf(request: Request, x_csrf_token: str = Header(None)):
    cookie_token = request.cookies.get("csrf_token")
    if not cookie_token or not x_csrf_token or x_csrf_token != cookie_token:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="CSRF token invalid" 
        )