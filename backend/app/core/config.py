import json
from typing import List, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    APP_NAME: str = "Snipted API"
    
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    DATABASE_URL: str

    ENVIRONMENT: str = "development" 
    
    @property
    def COOKIE_SECURE(self) -> bool:
        return self.ENVIRONMENT.lower() == "production"

    BACKEND_CORS_ORIGINS: Union[List[str], str] = []

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, list): return v
        if isinstance(v, str) and v.startswith("["):
            try: return json.loads(v)
            except: return []
        if isinstance(v, str) and v.strip():
            return [i.strip() for i in v.split(",")]
        return []
    
    @property
    def COOKIE_SECURE(self) -> bool:
        return self.ENVIRONMENT.lower() == "production"

    @property
    def COOKIE_SAMESITE(self) -> str:
        return "none" if self.COOKIE_SECURE else "lax"

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True, extra="ignore")

settings = Settings()