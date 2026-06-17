# API Conventions — MiguelDev11 Backend

## Stack
- **FastAPI** + **SQLAlchemy 2.0** (mapped_column style) + **Pydantic v2**
- **PostgreSQL** via Cloud SQL (prod) / local Docker (dev)
- **Python 3.11+** — use modern syntax always

## Project Structure

```
backend/app/
├── api/v1/endpoints/   # Route handlers — thin, delegate to services
├── core/               # config.py, security.py
├── db/                 # session.py, base
├── models/             # SQLAlchemy ORM models
├── schemas/            # Pydantic request/response schemas
└── services/           # Business logic (create if complex logic needed)
```

## Router Pattern

```python
# api/v1/endpoints/resource.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.models.models import Resource
from app.schemas.resource import ResourceSchema, ResourceCreate

router = APIRouter()

@router.get("/", response_model=List[ResourceSchema])
async def list_resources(db: Session = Depends(get_db)):
    return db.query(Resource).filter(Resource.is_active == True).all()

@router.get("/{id}", response_model=ResourceSchema)
async def get_resource(id: int, db: Session = Depends(get_db)):
    resource = db.query(Resource).filter(Resource.id == id).first()
    if not resource:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resource not found")
    return resource

@router.post("/", response_model=ResourceSchema, status_code=status.HTTP_201_CREATED)
async def create_resource(data: ResourceCreate, db: Session = Depends(get_db)):
    resource = Resource(**data.model_dump())
    db.add(resource)
    db.commit()
    db.refresh(resource)
    return resource
```

## Model Pattern (SQLAlchemy 2.0)

```python
# models/models.py
from sqlalchemy import String, Text, DateTime, Boolean, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from app.db.session import Base

class MyModel(Base):
    __tablename__ = "my_models"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    slug: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    content: Mapped[str | None] = mapped_column(Text)          # Optional field
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    tags: Mapped[list[str]] = mapped_column(JSON, default=[])
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relations
    author_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    author: Mapped["User"] = relationship(back_populates="items")
```

Rules:
- Always use `Mapped[type]` + `mapped_column()` — no old Column() style
- Optional fields: `Mapped[str | None]` not `Optional[str]`
- Index frequently queried fields: `slug`, `is_published`, foreign keys
- Use `datetime.utcnow` for `created_at` / `updated_at` defaults

## Schema Pattern (Pydantic v2)

```python
# schemas/resource.py
from pydantic import BaseModel, field_validator
from datetime import datetime
from typing import List, Optional, Any

class ResourceBase(BaseModel):
    title: str
    slug: str
    tags: List[str] = []

class ResourceCreate(ResourceBase):
    content: str

class ResourceSchema(ResourceBase):
    id: int
    created_at: datetime
    author: str

    @field_validator('author', mode='before')
    @classmethod
    def extract_author_name(cls, v: Any) -> str:
        if hasattr(v, 'name'):
            return v.name
        return str(v)

    class Config:
        from_attributes = True     # Required for ORM → Pydantic
```

Rules:
- Always split: `Base` → `Create` → `Response` schema
- Use `field_validator` not deprecated `validator`
- `from_attributes = True` on all response schemas
- Never expose `password_hash`, internal IDs of other entities, or audit fields in response schemas

## URL Structure

```
GET    /api/v1/{resource}           # list
GET    /api/v1/{resource}/{id}      # get one
POST   /api/v1/{resource}           # create
PUT    /api/v1/{resource}/{id}      # replace
PATCH  /api/v1/{resource}/{id}      # partial update
DELETE /api/v1/{resource}/{id}      # delete
```

Existing: `/api/v1/blog/posts`, `/api/v1/blog/manifest`

## Error Handling

```python
# Always use HTTPException with explicit status codes
raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Slug already exists")
raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
```

Never return raw 500s. Catch DB errors at router level or add global exception handler.

## CORS

Allowed origins in `main.py`:
- `http://localhost:4200`
- `http://localhost:44953`
- `https://migueldev11.com`
- `https://blog.migueldev11.com`
- `https://demo.migueldev11.com`

Add new origins there when deploying new subdomains.

## Router Registration

```python
# main.py
app.include_router(router, prefix=f"{settings.API_V1_STR}/resource", tags=["resource"])
```

## Config Access

```python
from app.core.config import settings
# settings.API_V1_STR, settings.PROJECT_NAME, settings.DATABASE_URL, etc.
```

## Async Rules

- Use `async def` for all route handlers
- DB calls via SQLAlchemy sync Session are fine (no async session needed unless high concurrency required)
- External HTTP calls (email, storage): use `httpx.AsyncClient`

## Naming

| Thing | Convention | Example |
|-------|-----------|---------|
| Files | `snake_case.py` | `blog_post.py` |
| Models | `PascalCase` | `BlogPost` |
| Schemas | `PascalCase` + suffix | `BlogPostCreate`, `BlogPostSchema` |
| Routes | `snake_case` | `get_posts`, `create_comment` |
| DB columns | `snake_case` | `published_at`, `is_published` |
| Endpoints | `kebab-case` | `/blog-posts` |
