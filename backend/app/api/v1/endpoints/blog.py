from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.models.models import Post
from app.schemas.blog import BlogPost, BlogPostMeta, BlogManifest

router = APIRouter()

@router.get("/posts", response_model=List[BlogPostMeta])
def get_posts(db: Session = Depends(get_db)):
    posts = db.query(Post).filter(Post.is_published == True).order_by(Post.published_at.desc()).all()
    return posts

@router.get("/posts/{slug}", response_model=BlogPost)
def get_post(slug: str, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.slug == slug, Post.is_published == True).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

@router.get("/manifest", response_model=BlogManifest)
def get_manifest(db: Session = Depends(get_db)):
    posts = db.query(Post).filter(Post.is_published == True).all()
    return {
        "posts": posts,
        "categories": list(set([p.category for p in posts])),
        "last_updated": "2024-01-01T00:00:00" # Simplified
    }
