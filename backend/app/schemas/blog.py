from pydantic import BaseModel, field_validator
from datetime import datetime
from typing import List, Optional, Any

class BlogPostMeta(BaseModel):
    slug: str
    title: str
    excerpt: Optional[str] = None
    author: str
    published_at: datetime
    updated_at: Optional[datetime] = None
    category: str
    tags: List[str] = []
    cover_image: Optional[str] = None
    reading_time: int = 5
    featured: bool = False

    @field_validator('author', mode='before')
    @classmethod
    def extract_author_name(cls, v: Any) -> str:
        if hasattr(v, 'name'):
            return v.name
        return str(v)

    class Config:
        from_attributes = True

class BlogPost(BlogPostMeta):
    content: str

class BlogManifest(BaseModel):
    posts: List[BlogPostMeta]
    categories: List[str]
    last_updated: str
