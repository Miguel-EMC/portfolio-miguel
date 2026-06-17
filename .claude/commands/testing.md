# Testing Conventions — MiguelDev11

## Stack

| Layer | Tool | Command |
|-------|------|---------|
| Angular unit | Jest (via Angular CLI) | `pnpm test` |
| FastAPI unit | pytest + httpx | `uv run pytest` |
| FastAPI DB | pytest + real test DB | `uv run pytest` |
| E2E (future) | Playwright | `pnpm e2e` |

## FastAPI Testing

### Setup

```python
# tests/conftest.py
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.db.session import get_db, Base

TEST_DB_URL = "sqlite:///./test.db"    # SQLite for tests, no Docker needed

engine = create_engine(TEST_DB_URL, connect_args={"check_same_thread": False})
TestingSession = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def db():
    session = TestingSession()
    try:
        yield session
    finally:
        session.close()

@pytest.fixture
def client(db):
    def override_get_db():
        yield db
    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
    app.dependency_overrides.clear()
```

### Endpoint Tests

```python
# tests/test_blog.py
def test_get_posts_empty(client):
    response = client.get("/api/v1/blog/posts")
    assert response.status_code == 200
    assert response.json() == []

def test_get_post_not_found(client):
    response = client.get("/api/v1/blog/posts/non-existent")
    assert response.status_code == 404

def test_get_post_by_slug(client, db):
    # Arrange — seed real DB row
    post = Post(
        slug="test-post",
        title="Test Post",
        content="Content",
        author_id=1,
        is_published=True
    )
    db.add(post)
    db.commit()

    # Act
    response = client.get("/api/v1/blog/posts/test-post")

    # Assert
    assert response.status_code == 200
    assert response.json()["slug"] == "test-post"
```

Rules:
- Real SQLite DB, not mocks — mocks hide real query bugs
- Arrange / Act / Assert structure always
- One assertion per test where possible
- Test 200s AND error cases (404, 409, 403)
- Seed data inline, not in shared fixtures unless 3+ tests need it

### Service / Logic Tests

```python
# tests/test_schemas.py
def test_blog_post_meta_schema():
    data = {
        "slug": "test", "title": "Test", "author": "Miguel",
        "published_at": "2024-01-01T00:00:00", "category": "tech", "reading_time": 5
    }
    schema = BlogPostMeta(**data)
    assert schema.slug == "test"
    assert schema.tags == []
```

## Angular Testing

### Component Test

```typescript
// feature.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { FeatureComponent } from './feature.component';
import { FeatureService } from '../services/feature.service';

describe('FeatureComponent', () => {
  let fixture: ComponentFixture<FeatureComponent>;
  let component: FeatureComponent;
  let featureService: jest.Mocked<FeatureService>;

  beforeEach(async () => {
    featureService = {
      getItems: jest.fn().mockReturnValue(of([]))
    } as any;

    await TestBed.configureTestingModule({
      imports: [FeatureComponent],
      providers: [{ provide: FeatureService, useValue: featureService }]
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('loads items on init', () => {
    expect(featureService.getItems).toHaveBeenCalled();
  });

  it('shows empty state when no items', () => {
    const el = fixture.nativeElement.querySelector('[data-testid="empty-state"]');
    expect(el).toBeTruthy();
  });
});
```

### Service Test

```typescript
// blog.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BlogService } from './blog.service';

describe('BlogService', () => {
  let service: BlogService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BlogService]
    });
    service = TestBed.inject(BlogService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('gets all posts', () => {
    const mockPosts = [{ slug: 'test', title: 'Test' }];

    service.getAllPosts().subscribe(posts => {
      expect(posts.length).toBe(1);
      expect(posts[0].slug).toBe('test');
    });

    const req = httpMock.expectOne(req => req.url.includes('/blog/posts'));
    expect(req.request.method).toBe('GET');
    req.flush(mockPosts);
  });
});
```

### Test IDs

Use `data-testid` attributes in templates for E2E / integration selectors. Never target by CSS class.

```html
<div data-testid="blog-card">...</div>
<button data-testid="load-more-btn">Load more</button>
<p data-testid="empty-state">No posts found.</p>
```

## What to Test

| Type | Test | Skip |
|------|------|------|
| API endpoints | All status codes, response shape | Implementation internals |
| Services | Core logic, error paths | Constructor, DI setup |
| Components | DOM output, service calls, loading/error states | Angular internals, styles |
| Schemas | Validators, field_validators | Pydantic internals |
| Utils | All branches | Simple pass-throughs |

## File Location

```
backend/
└── tests/
    ├── conftest.py
    ├── test_blog.py
    └── test_schemas.py

apps/community/src/app/
└── features/blog/
    ├── blog-list/blog-list.component.spec.ts
    └── blog-post/blog-post.component.spec.ts

apps/community/src/app/core/services/
└── blog.service.spec.ts
```

## Commands

```bash
# Python
uv run pytest                        # all tests
uv run pytest tests/test_blog.py     # single file
uv run pytest -v                     # verbose
uv run pytest --cov=app              # with coverage

# Angular
pnpm test                            # watch mode
pnpm test --watch=false              # CI / one-shot
pnpm test --coverage                 # coverage report
```
