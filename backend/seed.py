from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.db.session import Base
from app.models.models import User, Post
from datetime import datetime, timedelta
import random

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
            name="Miguel Muzo",
            provider="local",
            is_superuser=True,
            avatar_url="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
        )
        db.add(admin)
        db.commit()
        db.refresh(admin)
        print("✅ Admin user created.")

    # 2. Crear Posts de prueba ricos
    if db.query(Post).count() <= 2: # Permitir re-seeding si solo están los básicos
        # Limpiar posts previos si se desea un seed completo
        # db.query(Post).delete()
        
        mock_posts = [
            {
                "title": "Arquitecturas Clean con FastAPI y SQLAlchemy",
                "slug": "fastapi-clean-architecture",
                "excerpt": "Aprende a estructurar tus proyectos de backend para que sean escalables y fáciles de mantener utilizando patrones de diseño modernos.",
                "content": """# Arquitecturas Clean con FastAPI

La arquitectura limpia no es solo para grandes aplicaciones empresariales. Incluso en proyectos pequeños de FastAPI, separar las preocupaciones ayuda enormemente a largo plazo.

## Capas sugeridas:
1. **Modelos**: Tus entidades de base de datos.
2. **Schemas**: Validaciones Pydantic.
3. **Servicios**: Lógica de negocio pura.
4. **API**: Tus endpoints que orquestan las llamadas.

### Ejemplo de código:
```python
@router.post("/")
def create_item(item: ItemCreate, db: Session = Depends(get_db)):
    return items_service.create(db, item)
```
""",
                "category": "programming",
                "tags": ["python", "fastapi", "backend", "architecture"],
                "cover_image": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
                "featured": True
            },
            {
                "title": "Construyendo Agentes de IA con LangGraph",
                "slug": "ai-agents-langgraph",
                "excerpt": "Descubre cómo orquestar múltiples LLMs para resolver tareas complejas mediante grafos de estado y agentes autónomos.",
                "content": """# El futuro son los Agentes

LangGraph nos permite crear flujos cíclicos que son perfectos para agentes que necesitan razonar y corregirse a sí mismos.

## ¿Por qué LangGraph?
A diferencia de las cadenas lineales, los grafos permiten:
- **Ciclos**: Re-intentar una tarea si falla.
- **Estado compartido**: Mantener la memoria del agente de forma robusta.
- **Control**: Definir exactamente cuándo el agente debe detenerse.
""",
                "category": "technology",
                "tags": ["AI", "python", "LLM", "langgraph"],
                "cover_image": "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80",
                "featured": True
            },
            {
                "title": "Dominando Angular 18: Signals y Zoneless",
                "slug": "mastering-angular-18",
                "excerpt": "Angular ha cambiado radicalmente en las últimas versiones. Veamos cómo aprovechar el nuevo sistema de reactividad.",
                "content": """# Angular 18 y el futuro sin Zone.js

El cambio a Signals es el movimiento más importante en la historia de Angular desde su creación.

## Beneficios:
- Rendimiento superior.
- Menos boilerplate.
- Mejor integración con SSR.
""",
                "category": "web-development",
                "tags": ["angular", "typescript", "frontend", "signals"],
                "cover_image": "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?auto=format&fit=crop&w=800&q=80",
                "featured": False
            },
            {
                "title": "Desplegando en AWS con Terraform",
                "slug": "aws-terraform-deployment",
                "excerpt": "Guía paso a paso para automatizar tu infraestructura en la nube de forma segura y profesional.",
                "content": """# Infraestructura como Código (IaC)

No más clics manuales en la consola de AWS. Usa Terraform para definir tu stack.

```hcl
resource "aws_lambda_function" "api" {
  function_name = "my-blog-api"
  runtime       = "python3.11"
}
```
""",
                "category": "devops",
                "tags": ["aws", "terraform", "cloud", "devops"],
                "cover_image": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
                "featured": False
            },
            {
                "title": "Guía de Carreras: De Junior a Senior",
                "slug": "career-path-junior-senior",
                "excerpt": "Consejos prácticos para acelerar tu crecimiento profesional en el mundo del desarrollo de software.",
                "content": """# El camino del desarrollador

No se trata solo de escribir código, sino de resolver problemas de negocio y mentorizar a otros.
""",
                "category": "career",
                "tags": ["career", "soft-skills", "professional-growth"],
                "cover_image": "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=800&q=80",
                "featured": False
            },
            {
                "title": "PostgreSQL: Optimización de Consultas",
                "slug": "postgresql-query-optimization",
                "excerpt": "Aprende a usar EXPLAIN ANALYZE e índices complejos para que tu base de datos vuele.",
                "content": """# SQL a alta velocidad

Los índices son tus mejores amigos, pero usarlos mal puede ralentizar las inserciones.
""",
                "category": "programming",
                "tags": ["database", "sql", "postgresql", "performance"],
                "cover_image": "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80",
                "featured": False
            }
        ]

        for p_data in mock_posts:
            post = Post(
                title=p_data["title"],
                slug=p_data["slug"],
                content=p_data["content"],
                excerpt=p_data["excerpt"],
                author_id=admin.id,
                category=p_data["category"],
                tags=p_data["tags"],
                cover_image=p_data["cover_image"],
                is_published=True,
                published_at=datetime.utcnow() - timedelta(days=random.randint(0, 30)),
                featured=p_data["featured"]
            )
            db.add(post)
        
        db.commit()
        print(f"✅ Seeding complete! Added {len(mock_posts)} rich posts.")
    else:
        print("⚠️ Database already has enough posts. Skipping seed.")

    db.close()

if __name__ == "__main__":
    seed()
