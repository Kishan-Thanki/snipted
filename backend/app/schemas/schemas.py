from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr, ConfigDict, Field

# =======================
# SHARED BASES
# =======================
class UserBase(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)

class SnippetBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    code_content: str = Field(..., min_length=1, max_length=50000)
    language: str = Field("text", max_length=50)

# =======================
# USER SCHEMAS
# =======================
class UserCreate(UserBase):
    password: str = Field(..., min_length=8)

class UserResponse(UserBase):
    id: int
    is_active: bool
    reputation_stars: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

# =======================
# TAG SCHEMAS
# =======================
class TagResponse(BaseModel):
    id: int
    name: str
    
    model_config = ConfigDict(from_attributes=True)

# =======================
# SNIPPET SCHEMAS
# =======================
class SnippetCreate(SnippetBase):
    tags: List[str] = Field(default=[], max_length=10)

class SnippetUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    code_content: Optional[str] = Field(None, min_length=1, max_length=50000)
    language: Optional[str] = Field(None, max_length=50)
    tags: Optional[List[str]] = Field(None, max_length=10)

class SnippetResponse(SnippetBase):
    id: int
    created_at: datetime
    updated_at: datetime
    user_id: int
    tags: List[TagResponse] = []
    
    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str