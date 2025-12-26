from fastapi import FastAPI
from app.models import models
from app.db.session import engine
from app.core.config import settings
from app.core.limiter import limiter 
from app.api.v1.api import api_router
from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler
from slowapi.middleware import SlowAPIMiddleware
from fastapi.middleware.cors import CORSMiddleware  

models.SQLModel.metadata.create_all(bind=engine)

app = FastAPI(title=settings.APP_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,  
    allow_credentials=True,       
    allow_methods=["*"],          
    allow_headers=["*"],          
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {"message": "Welcome to Snipted API"}