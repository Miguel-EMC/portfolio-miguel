from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.db.session import Base
from app.models.models import User, Post
from datetime import datetime

# URL de la base de datos (Interna para Docker)
DATABASE_URL = "postgresql://postgres:postgres@db:5432/migueldev_blog"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def seed():
    db = SessionLocal()
    
    # Crear tablas
    Base.metadata.create_all(bind=engine)

    # 1. Crear Usuario Admin
    admin = db.query(User).filter(User.email == "admin@migueldev11.com").first()
    if not admin:
        admin = User(
            email="admin@migueldev11.com",
            name="Miguel Admin",
            provider="local",
            is_superuser=True
        )
        db.add(admin)
        db.commit()
        db.refresh(admin)

    # 2. Crear Posts de prueba
    if db.query(Post).count() == 0:
        posts = [
            Post(
                title="Bienvenido a la nueva comunidad de MiguelDev",
                slug="bienvenida-comunidad",
                content="# Hola Mundo\nEste es el primer post desde la API!",
                excerpt="Explora nuestra nueva plataforma interactiva.",
                author_id=admin.id,
                category="general",
                tags=["news", "welcome"]
            ),
            Post(
                title="Mastering FastAPI con Python",
                slug="mastering-fastapi",
                content="## ¿Por qué FastAPI?\nEs rápido, moderno y tipado.",
                excerpt="Aprende a construir APIs de alto rendimiento.",
                author_id=admin.id,
                category="programming",
                tags=["python", "fastapi", "backend"]
            )
        ]
        db.add_all(posts)
        db.commit()
        print("✅ Base de datos poblada con éxito!")
    else:
        print("⚠️ La base de datos ya contiene información.")

    db.close()

if __name__ == "__main__":
    seed()
