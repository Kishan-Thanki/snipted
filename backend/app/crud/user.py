from typing import Optional
from app.models.models import User
from sqlmodel import Session, select
from app.schemas.schemas import UserCreate
from app.core.security import get_password_hash

def get_user_by_email(session: Session, email: str) -> Optional[User]:
    statement = select(User).where(User.email == email)
    return session.exec(statement).first()

def get_user_by_id(session: Session, user_id: int) -> Optional[User]:
    return session.get(User, user_id)

def create_user(session: Session, user_create: UserCreate) -> User:
    user_data = user_create.model_dump(exclude={"password"})
    
    db_user = User(
        **user_data, 
        hashed_password=get_password_hash(user_create.password)
    )
    
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    
    return db_user