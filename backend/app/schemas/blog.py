from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

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

    class Config:
        from_attributes = True

class BlogPost(BlogPostMeta):
    content: str

class BlogManifest(BaseModel):
    posts: List[BlogPostMeta]
    categories: List[str]
    last_updated: str
