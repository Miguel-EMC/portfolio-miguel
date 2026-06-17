# Angular Component Conventions — MiguelDev11

## Stack
- **Angular 18+** — standalone components only (no NgModules)
- **Signals** — prefer over BehaviorSubject for local state
- **inject()** — always, never constructor injection
- **RxJS** — for async streams (HTTP, cross-component events)
- **i18n** — `TranslateModule` for all user-facing strings

## Apps in This Monorepo

| App | Path | URL |
|-----|------|-----|
| Portfolio | `apps/portfolio/` | `migueldev11.com` |
| Community/Blog | `apps/community/` | `blog.migueldev11.com` |

Shared libs: `libs/shared/`, `libs/ui/`

## Project Structure Pattern

```
features/
└── feature-name/
    ├── feature-name.routes.ts       # Lazy-loaded routes
    ├── feature-list/
    │   ├── feature-list.component.ts
    │   ├── feature-list.component.html
    │   └── feature-list.component.scss
    ├── feature-detail/
    │   └── ...
    └── components/                  # Feature-local components
        └── feature-card/
            └── ...

shared/
├── components/
│   ├── layout/                      # nav, footer
│   └── ui/                          # buttons, toggles, reusable atoms
├── directives/
└── services/

core/
├── services/                        # Singletons: theme, seo, blog, auth
├── guards/
└── strategies/
```

## Component Template

```typescript
import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-feature-name',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './feature-name.component.html',
  styleUrls: ['./feature-name.component.scss']
})
export class FeatureNameComponent implements OnInit {
  private readonly featureService = inject(FeatureService);

  // Signals for local state
  items = signal<Item[]>([]);
  isLoading = signal(false);
  selectedId = signal<number | null>(null);

  // Computed
  filteredItems = computed(() =>
    this.items().filter(item => item.isActive)
  );

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.isLoading.set(true);
    this.featureService.getItems().subscribe({
      next: (data) => {
        this.items.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }
}
```

## Service Template

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FeatureService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.api.baseUrl;

  getItems(): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.apiUrl}/items`).pipe(
      catchError(err => {
        console.error('Failed to load items:', err);
        return of([]);
      })
    );
  }
}
```

## Routing (Lazy)

```typescript
// feature.routes.ts
import { Routes } from '@angular/router';

export const FEATURE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./feature-list/feature-list.component').then(m => m.FeatureListComponent)
  },
  {
    path: ':slug',
    loadComponent: () =>
      import('./feature-detail/feature-detail.component').then(m => m.FeatureDetailComponent)
  }
];

// app.routes.ts
{
  path: 'feature',
  loadChildren: () =>
    import('./features/feature/feature.routes').then(m => m.FEATURE_ROUTES),
  data: { preload: false }  // set true for high-priority routes
}
```

## HTML Template Rules

```html
<!-- Always use translate pipe for text -->
<h1>{{ 'FEATURE.TITLE' | translate }}</h1>

<!-- Signals: call as functions -->
@if (isLoading()) {
  <app-loading-spinner />
}

@for (item of filteredItems(); track item.id) {
  <app-item-card [item]="item" />
}

@if (filteredItems().length === 0 && !isLoading()) {
  <p>{{ 'COMMON.EMPTY_STATE' | translate }}</p>
}

<!-- routerLink not href for internal nav -->
<a [routerLink]="['/blog', post.slug]">{{ post.title }}</a>
```

Use `@if`, `@for`, `@switch` (Angular 17+ control flow). Never `*ngIf`, `*ngFor`.

## SCSS Rules

```scss
// Always use CSS custom properties from design system
:host {
  display: block;
}

.card {
  background: var(--surface-primary);
  border: 1px solid var(--border-muted);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  transition: all var(--transition-normal);

  &:hover {
    border-color: var(--border-primary);
    box-shadow: 0 0 0 1px rgba(57,255,20,0.15), 0 8px 24px rgba(0,0,0,0.4);
    transform: translateY(-2px);
  }
}
```

Never hardcode colors or spacing values. Use `var(--token)`. See `/ui-design` skill.

## i18n Keys

```json
// assets/i18n/en.json
{
  "FEATURE": {
    "TITLE": "...",
    "SUBTITLE": "...",
    "EMPTY_STATE": "No items found."
  }
}
```

Both `en.json` and `es.json` must be updated together. Never add a key to one without the other.

## SEO Pattern

```typescript
// Inject SEO service in page-level components
private seoService = inject(SeoService);

ngOnInit(): void {
  this.seoService.updateMeta({
    title: 'Page Title | MiguelDev11',
    description: '...',
    url: 'https://blog.migueldev11.com/feature'
  });
}
```

## Naming Conventions

| Thing | Convention | Example |
|-------|-----------|---------|
| Component selector | `app-kebab-case` | `app-blog-card` |
| Component class | `PascalCase + Component` | `BlogCardComponent` |
| Service class | `PascalCase + Service` | `BlogService` |
| Signal | `camelCase` | `isLoading`, `selectedPost` |
| Observable | `camelCase + $` | `posts$`, `manifest$` |
| i18n key | `SCREAMING_SNAKE` | `BLOG.POST_TITLE` |
| Files | `kebab-case.type.ts` | `blog-post.component.ts` |

## Performance Rules

- All routes lazy-loaded via `loadComponent` / `loadChildren`
- Images: always `loading="lazy"` + explicit width/height
- `OnPush` change detection optional but preferred for list items
- `trackBy` (or `track` in `@for`) always on lists
- Avoid subscriptions in template — use `async` pipe or signals
- Use `SelectivePreloadStrategy` (already configured) for important routes
