from typing import List, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    APP_NAME: str = "Snipted API"
    
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    DATABASE_URL: str

    BACKEND_CORS_ORIGINS: List[str] = []

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, list):
            return v
        
        if isinstance(v, str) and v.startswith("["):
            return v
            
        if isinstance(v, str):
            return [i.strip() for i in v.split(",")]
            
        return []

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()