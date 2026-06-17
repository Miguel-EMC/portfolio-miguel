# Architecture - Portfolio Personal

## Project Structure

```
src/app/
├── core/                     # Core services and singleton functionality
│   ├── services/
│   │   ├── theme.service.ts       # Theme management
│   │   ├── scroll.service.ts      # Scroll utilities
│   │   ├── blog.service.ts        # Blog markdown parsing and management
│   │   ├── admin-auth.service.ts  # Admin authentication
│   │   └── seo.service.ts         # SEO and meta tag management
│   ├── guards/
│   │   └── admin-auth.guard.ts    # Route guards for admin
│   ├── strategies/
│   │   └── selective-preload.strategy.ts  # Smart route preloading
│   ├── utils/
│   │   └── performance.util.ts    # Performance monitoring utilities
│   ├── data/
│   │   ├── portfolio-projects.data.ts
│   │   └── projects.data.ts
│   └── index.ts                   # Barrel exports
├── shared/                  # Reusable components and utilities
│   ├── components/
│   │   ├── ui/
│   │   │   ├── section-header/
│   │   │   ├── language-toggle/
│   │   │   └── theme-toggle/
│   │   └── layout/
│   │       ├── nav/
│   │       └── footer/
│   ├── directives/
│   │   └── lazy-load-image.directive.ts  # Lazy loading images
│   └── shared.module.ts
├── features/                # Feature modules with lazy loading
│   ├── home/
│   │   └── home.component.ts
│   ├── portfolio/
│   │   ├── portfolio.module.ts
│   │   ├── portfolio-routing.module.ts
│   │   ├── portfolio/portafolio.component.ts
│   │   └── project-detail/project-detail.component.ts
│   ├── resume/
│   │   ├── resume.module.ts
│   │   ├── resume-routing.module.ts
│   │   └── components/
│   │       ├── education/
│   │       ├── curriculum/
│   │       └── skills/
│   ├── contact/
│   │   ├── about-me/
│   │   └── contacts/
│   ├── blog/                # NEW: Blog feature module
│   │   ├── blog.routes.ts
│   │   ├── blog-list/
│   │   │   ├── blog-list.component.ts
│   │   │   ├── blog-list.component.html
│   │   │   └── blog-list.component.scss
│   │   └── blog-post/
│   │       ├── blog-post.component.ts
│   │       ├── blog-post.component.html
│   │       └── blog-post.component.scss
│   └── admin/               # NEW: Admin feature module
│       ├── admin.routes.ts
│       ├── admin-login/
│       ├── admin-dashboard/
│       ├── admin-posts/
│       └── admin-editor/
├── interfaces/
│   ├── project.interface.ts
│   └── blog.interface.ts
└── environments/
    ├── environment.ts       # Development config
    └── environment.prod.ts  # Production config
```

## Architectural Principles

### 1. Separation of Concerns
- **Core**: Singleton services loaded once at app startup
- **Shared**: Reusable components, directives, and utilities
- **Features**: Domain-specific modules with lazy loading

### 2. Lazy Loading Strategy
- Core portfolio routes preloaded immediately
- Blog routes preloaded after 2-second delay
- Admin routes loaded on demand only
- Uses custom `SelectivePreloadStrategy` for intelligent preloading

### 3. Standalone Components
- Modern Angular 18 standalone components
- Better tree-shaking and smaller bundle sizes
- Reduced module dependencies

### 4. Feature Flags
Environment-based feature configuration:
```typescript
features: {
  enableBlog: true,
  enableProjectDetails: true,
  enableDarkMode: true,
  enableAnimations: true,
  enablePreloading: true
}
```

## Routes and Navigation

### Main Routes
| Route | Module | Preloading |
|-------|--------|------------|
| `/home` | Home | Immediate |
| `/portfolio` | Portfolio | Immediate |
| `/portfolio/project/:slug` | Portfolio | Immediate |
| `/resume` | Resume | Immediate |
| `/about` | Contact | On-demand |
| `/contact` | Contact | On-demand |
| `/blog` | Blog | 2s delay |
| `/blog/post/:slug` | Blog | 2s delay |
| `/blog/category/:category` | Blog | 2s delay |
| `/admin` | Admin | On-demand |

### Backward Compatibility
Automatic redirects for legacy routes maintain SEO and user bookmarks.

## Blog System

### Architecture
- **Storage**: Markdown files in `assets/blog/posts/`
- **Metadata**: JSON manifest at `assets/blog/manifest.json`
- **Parsing**: `marked` library with `highlight.js` for syntax highlighting
- **Categories**: 8 predefined categories with icons and colors

### Creating Blog Posts
1. Create a markdown file in `src/assets/blog/posts/`
2. Add frontmatter with metadata
3. Update `manifest.json` with post metadata
4. Post is automatically available at `/blog/post/{slug}`

### Frontmatter Format
```markdown
---
title: "Post Title"
slug: "post-slug"
excerpt: "Brief description"
author: "Author Name"
publishedAt: "2024-12-15T10:00:00.000Z"
category: "technology"
tags: ["tag1", "tag2"]
coverImage: "/assets/img/blog/image.jpg"
featured: true
published: true
---

# Content here...
```

## Admin System

### Authentication
- Simple password-based authentication
- 24-hour session duration stored in localStorage
- Route guards protect admin routes
- Default password: `admin123` (change in production!)

### Features
- Dashboard with post statistics
- Post management (list, create, edit)
- Markdown editor with live preview
- Category and tag management
- Download posts as markdown files

### Access
Navigate to `/admin` to access the admin panel.

## Performance Optimizations

### Lazy Loading
- Feature modules loaded on demand
- Selective preloading for critical routes
- Network-aware preloading option available

### Image Optimization
- `LazyLoadImageDirective` for intersection observer-based loading
- Blur-up effect during image loading
- Placeholder support

### SEO
- Dynamic meta tags via `SeoService`
- Open Graph and Twitter Card support
- JSON-LD structured data for rich search results
- Canonical URL management

### Caching
- Blog posts cached in memory after first load
- Manifest cached and updated on demand

## Development

### Commands
```bash
# Development server
npm start

# Production build
npm run build

# Build for Spanish locale
npm run build:es

# Run tests
npm test

# Serve SSR build
npm run serve:ssr:portfolio-personal
```

### Environment Configuration
Environment files support:
- EmailJS configuration
- Blog settings (posts per page, search, comments)
- Admin settings (session duration, password hash)
- Feature flags
- SEO configuration
- API endpoints

## Internationalization

The project supports English and Spanish:
- Translation files in `src/assets/i18n/`
- `@ngx-translate/core` for runtime translation
- All UI text is translatable
- Blog content is single-language (expandable)

## Future Enhancements

1. **Database Integration**: Replace file-based blog with database storage
2. **Rich Text Editor**: WYSIWYG editor for admin
3. **Image Upload**: Direct image upload for blog posts
4. **Comments System**: Enable blog comments
5. **Analytics**: Integration with Google Analytics or similar
6. **PWA**: Progressive Web App support
7. **RSS Feed**: Auto-generated RSS for blog
