from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr, ConfigDict, Field, field_validator

# =======================
# SHARED BASES
# =======================
class UserBase(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)

class SnippetBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200, description="Max 200 chars")
    code_content: str = Field(..., min_length=1, max_length=50000, description="Max 50k chars")
    language: str = Field("text", max_length=50)

# =======================
# USER SCHEMAS
# =======================
class UserCreate(UserBase):
    password: str = Field(..., min_length=8, description="Min 8 chars")

class UserResponse(UserBase):
    id: int
    is_active: bool
    reputation_stars: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

# =======================
# TOKEN SCHEMAS
# =======================
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# =======================
# TAG SCHEMAS
# =======================
class TagBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=30)

class TagCreate(TagBase):
    pass

class TagResponse(TagBase):
    id: int
    
    model_config = ConfigDict(from_attributes=True)

# =======================
# SNIPPET SCHEMAS
# =======================
class SnippetCreate(SnippetBase):
    tags: List[str] = Field(default=[], max_length=10)

    @field_validator('tags')
    def check_tag_length(cls, v):
        for tag in v:
            if len(tag) > 30:
                raise ValueError(f"Tag '{tag}' is too long (max 30 chars)")
        return v

class SnippetUpdate(SnippetBase):
    tags: List[str] = Field(default=[], max_length=10)

    @field_validator('tags')
    def check_tag_length(cls, v):
        for tag in v:
            if len(tag) > 30:
                raise ValueError(f"Tag '{tag}' is too long (max 30 chars)")
        return v

class SnippetResponse(SnippetBase):
    id: int
    created_at: datetime
    updated_at: datetime
    user_id: int
    tags: List[TagResponse] = []
    like_count: int = 0

    model_config = ConfigDict(from_attributes=True)