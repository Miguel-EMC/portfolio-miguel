import os
import frontmatter
from datetime import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.db.session import Base
from app.models.models import User, Post
import json

# Configuration
POSTS_DIR = "../apps/portfolio/src/assets/blog/posts"
# Default to local docker port for local testing, 
# in CI/CD this would be set via environment variable
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5433/migueldev_blog")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def migrate():
    db = SessionLocal()
    
    print(f"🚀 Starting migration from {POSTS_DIR}...")
    
    # 1. Ensure Admin User exists
    admin = db.query(User).filter(User.email == "admin@migueldev11.com").first()
    if not admin:
        admin = User(
            email="admin@migueldev11.com",
            name="Miguel",
            provider="local",
            is_superuser=True
        )
        db.add(admin)
        db.commit()
        db.refresh(admin)
        print("✅ Created admin user.")

    # 2. Iterate and parse markdown files
    if not os.path.exists(POSTS_DIR):
        print(f"❌ Directory not found: {POSTS_DIR}")
        return

    files = [f for f in os.listdir(POSTS_DIR) if f.endswith(".md")]
    
    count = 0
    for filename in files:
        file_path = os.path.join(POSTS_DIR, filename)
        
        with open(file_path, "r", encoding="utf-8") as f:
            post_data = frontmatter.load(f)
            
            metadata = post_data.metadata
            content = post_data.content
            
            slug = metadata.get("slug", filename.replace(".md", ""))
            
            # Check if post already exists
            existing_post = db.query(Post).filter(Post.slug == slug).first()
            
            published_at_str = metadata.get("publishedAt")
            if published_at_str:
                try:
                    # Parse ISO format (e.g. 2024-09-10T10:00:00.000Z)
                    published_at = datetime.fromisoformat(published_at_str.replace("Z", "+00:00"))
                except ValueError:
                    published_at = datetime.utcnow()
            else:
                published_at = datetime.utcnow()

            post_dict = {
                "title": metadata.get("title", "Untitled"),
                "slug": slug,
                "content": content,
                "excerpt": metadata.get("excerpt", ""),
                "author_id": admin.id,
                "published_at": published_at,
                "category": metadata.get("category", "general"),
                "tags": metadata.get("tags", []),
                "cover_image": metadata.get("coverImage", ""),
                "is_published": metadata.get("published", True),
                "post_type": "article"
            }
            
            if existing_post:
                # Update existing post
                for key, value in post_dict.items():
                    setattr(existing_post, key, value)
                print(f"🔄 Updated: {slug}")
            else:
                # Create new post
                new_post = Post(**post_dict)
                db.add(new_post)
                print(f"🆕 Created: {slug}")
            
            count += 1

    db.commit()
    db.close()
    print(f"🏁 Finished! Migrated {count} posts.")

if __name__ == "__main__":
    migrate()
