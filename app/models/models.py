from typing import List, Optional
from datetime import datetime, timezone
from sqlmodel import Field, SQLModel, Relationship

def utc_now():
    return datetime.now(timezone.utc)

# ==========================================
# JOIN TABLES (Updated Foreign Keys)
# ==========================================
class SnippetTagLink(SQLModel, table=True):
    __tablename__ = "snippet_tag_links"
    snippet_id: Optional[int] = Field(
        default=None, 
        foreign_key="snippets.id",  
        primary_key=True
    )
    tag_id: Optional[int] = Field(
        default=None, 
        foreign_key="tags.id",      
        primary_key=True
    )

class SnippetLike(SQLModel, table=True):
    __tablename__ = "snippet_likes"
    user_id: Optional[int] = Field(
        default=None, 
        foreign_key="users.id",     
        primary_key=True
    )
    snippet_id: Optional[int] = Field(
        default=None, 
        foreign_key="snippets.id",  
        primary_key=True
    )
    liked_at: datetime = Field(default_factory=utc_now)

# ==========================================
# USER MODEL
# ==========================================
class UserBase(SQLModel):
    username: str = Field(index=True, unique=True)
    email: str = Field(unique=True, index=True)
    reputation_stars: int = Field(default=0, description="Manual stars given to the user profile")

class User(UserBase, table=True):
    __tablename__ = "users"  

    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: str  
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=utc_now)

    snippets: List["Snippet"] = Relationship(back_populates="user")
    liked_snippets: List["Snippet"] = Relationship(back_populates="liked_by_users", link_model=SnippetLike)

# ==========================================
# TAG MODEL
# ==========================================
class TagBase(SQLModel):
    name: str = Field(index=True, unique=True)

class Tag(TagBase, table=True):
    __tablename__ = "tags" 
    
    id: Optional[int] = Field(default=None, primary_key=True)
    snippets: List["Snippet"] = Relationship(back_populates="tags", link_model=SnippetTagLink)

# ==========================================
# SNIPPET MODEL
# ==========================================
class SnippetBase(SQLModel):
    title: str = Field(index=True)
    code_content: str
    language: str = Field(default="text")

class Snippet(SnippetBase, table=True):
    __tablename__ = "snippets" 
    
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=utc_now)
    updated_at: datetime = Field(default_factory=utc_now)
    
    user_id: Optional[int] = Field(default=None, foreign_key="users.id") 
    user: Optional[User] = Relationship(back_populates="snippets")

    tags: List[Tag] = Relationship(back_populates="snippets", link_model=SnippetTagLink)
    liked_by_users: List[User] = Relationship(back_populates="liked_snippets", link_model=SnippetLike)

    @property
    def like_count(self) -> int:
        return len(self.liked_by_users)