from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="MiguelDev Blog API",
    description="Backend API for the Blog Community Platform",
    version="0.1.0"
)

from app.api.v1.endpoints import blog

# Configure CORS
origins = [
    "http://localhost:4200",
    "http://localhost:44953",
    "https://migueldev11.com",
    "https://blog.migueldev11.com",
    "https://demo.migueldev11.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.core.config import settings

# Include routers
app.include_router(blog.router, prefix=f"{settings.API_V1_STR}/blog", tags=["blog"])

@app.get("/")
async def root():
    return {
        "message": f"Welcome to {settings.PROJECT_NAME}",
        "status": "active",
        "version": "0.1.0"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
