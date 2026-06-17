import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, catchError, map, tap, switchMap } from 'rxjs';
import { marked } from 'marked';
import hljs from 'highlight.js';
import { 
  BlogPost, 
  BlogPostMeta, 
  BlogCategory, 
  BlogManifest,
  BLOG_CATEGORIES,
  BlogCategoryInfo
} from '../../interfaces/blog.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.api.baseUrl;
  private readonly contentPath = environment.blog.contentPath;
  
  private postsCache = new Map<string, BlogPost>();
  private localManifestCache: BlogManifest | null = null;
  private manifestSubject = new BehaviorSubject<BlogManifest | null>(null);
  
  manifest$ = this.manifestSubject.asObservable();

  constructor() {
    this.configureMarked();
  }

  private configureMarked(): void {
    marked.setOptions({
      gfm: true,
      breaks: true
    });

    const renderer = new marked.Renderer();
    
    renderer.code = ({ text, lang }: { text: string; lang?: string }) => {
      const language = lang && hljs.getLanguage(lang) ? lang : 'plaintext';
      const highlighted = hljs.highlight(text, { language }).value;
      return `<pre><code class="hljs language-${language}">${highlighted}</code></pre>`;
    };

    renderer.image = ({ href, title, text }: { href: string; title?: string | null; text: string }) => {
      const titleAttr = title ? ` title="${title}"` : '';
      return `<figure class="blog-image">
        <img src="${href}" alt="${text}" loading="lazy"${titleAttr}>
        ${text ? `<figcaption>${text}</figcaption>` : ''}
      </figure>`;
    };

    marked.use({ renderer });
  }

  loadManifest(): Observable<BlogManifest> {
    return this.http.get<BlogManifest>(`${this.apiUrl}/blog/manifest`).pipe(
      tap(manifest => {
        manifest.posts = manifest.posts.map(post => this.normalizePostMeta(post));
        this.manifestSubject.next(manifest);
      }),
      catchError(error => {
        console.error('Failed to load blog manifest from API:', error);
        return this.loadLocalManifest();
      })
    );
  }

  getAllPosts(): Observable<BlogPostMeta[]> {
    return this.http.get<BlogPostMeta[]>(`${this.apiUrl}/blog/posts`).pipe(
      map(posts => posts.map(post => this.normalizePostMeta(post))),
      catchError(error => {
        console.error('Failed to load posts from API:', error);
        return this.loadLocalManifest().pipe(map(manifest => manifest.posts));
      })
    );
  }

  getPostBySlug(slug: string): Observable<BlogPost | null> {
    if (this.postsCache.has(slug)) {
      return of(this.postsCache.get(slug)!);
    }

    return this.http.get<BlogPost>(`${this.apiUrl}/blog/posts/${slug}`).pipe(
      map(post => ({
        ...post,
        publishedAt: new Date(post.publishedAt),
        updatedAt: post.updatedAt ? new Date(post.updatedAt) : undefined,
        content: marked.parse(post.content) as string
      })),
      tap(post => {
        if (post) {
          this.postsCache.set(slug, post);
        }
      }),
      catchError(error => {
        console.error(`Failed to load post ${slug} from API:`, error);
        return this.loadLocalPost(slug);
      })
    );
  }

  getPostsByCategory(category: BlogCategory): Observable<BlogPostMeta[]> {
    return this.getAllPosts().pipe(
      map(posts => posts.filter(post => post.category === category))
    );
  }

  getPostsByTag(tag: string): Observable<BlogPostMeta[]> {
    return this.getAllPosts().pipe(
      map(posts => posts.filter(post => 
        post.tags.some(t => t.toLowerCase() === tag.toLowerCase())
      ))
    );
  }

  getFeaturedPosts(): Observable<BlogPostMeta[]> {
    return this.getAllPosts().pipe(
      map(posts => posts.filter(post => post.featured))
    );
  }

  getRecentPosts(limit: number = 5): Observable<BlogPostMeta[]> {
    return this.getAllPosts().pipe(
      map(posts => posts.slice(0, limit))
    );
  }

  getRelatedPosts(currentSlug: string, limit: number = 3): Observable<BlogPostMeta[]> {
    return this.getAllPosts().pipe(
      map(posts => {
        const currentPost = posts.find(p => p.slug === currentSlug);
        if (!currentPost) return [];

        return posts
          .filter(post => post.slug !== currentSlug)
          .map(post => {
            let score = 0;
            if (post.category === currentPost.category) score += 2;
            const matchingTags = post.tags.filter(tag => 
              currentPost.tags.includes(tag)
            ).length;
            score += matchingTags;
            return { post, score };
          })
          .filter(item => item.score > 0)
          .sort((a, b) => b.score - a.score)
          .slice(0, limit)
          .map(item => item.post);
      })
    );
  }

  searchPosts(query: string): Observable<BlogPostMeta[]> {
    const searchTerms = query.toLowerCase().split(' ').filter(Boolean);
    
    return this.getAllPosts().pipe(
      map(posts => posts.filter(post => {
        const searchableText = `${post.title} ${post.excerpt} ${post.tags.join(' ')}`.toLowerCase();
        return searchTerms.every(term => searchableText.includes(term));
      }))
    );
  }

  getAllCategories(): BlogCategoryInfo[] {
    return BLOG_CATEGORIES;
  }

  getCategoryInfo(categoryId: BlogCategory): BlogCategoryInfo | undefined {
    return BLOG_CATEGORIES.find(c => c.id === categoryId);
  }

  getAllTags(): Observable<string[]> {
    return this.getAllPosts().pipe(
      map(posts => {
        const tagSet = new Set<string>();
        posts.forEach(post => post.tags.forEach(tag => tagSet.add(tag)));
        return Array.from(tagSet).sort();
      })
    );
  }

  clearCache(): void {
    this.postsCache.clear();
    this.localManifestCache = null;
    this.manifestSubject.next(null);
  }

  private loadLocalManifest(): Observable<BlogManifest> {
    if (this.localManifestCache) {
      this.manifestSubject.next(this.localManifestCache);
      return of(this.localManifestCache);
    }

    return this.http.get<BlogManifest>(`${this.contentPath}manifest.json`).pipe(
      map(manifest => ({
        ...manifest,
        posts: manifest.posts.map(post => this.normalizePostMeta(post))
      })),
      tap(manifest => {
        this.localManifestCache = manifest;
        this.manifestSubject.next(manifest);
      }),
      catchError(error => {
        console.error('Failed to load local blog manifest:', error);
        const emptyManifest: BlogManifest = {
          posts: [],
          categories: [],
          lastUpdated: new Date().toISOString()
        };
        this.manifestSubject.next(emptyManifest);
        return of(emptyManifest);
      })
    );
  }

  private loadLocalPost(slug: string): Observable<BlogPost | null> {
    return this.loadLocalManifest().pipe(
      map(manifest => manifest.posts.find(post => post.slug === slug) || null),
      map(meta => {
        if (!meta) return null;

        return {
          ...meta,
          content: ''
        };
      }),
      switchMap(fallbackPost => fallbackPost ? this.http.get(`${this.contentPath}posts/${slug}.md`, { responseType: 'text' }).pipe(
        map(markdown => {
          const meta = this.localManifestCache?.posts.find(post => post.slug === slug);
          if (!meta) return null;

          const post: BlogPost = {
            ...meta,
            content: marked.parse(this.stripFrontMatter(markdown)) as string
          };
          this.postsCache.set(slug, post);
          return post;
        }),
        catchError(error => {
          console.error(`Failed to load local markdown for ${slug}:`, error);
          this.postsCache.set(slug, fallbackPost);
          return of(fallbackPost);
        })
      ) : of(null))
    );
  }

  private normalizePostMeta(post: BlogPostMeta): BlogPostMeta {
    return {
      ...post,
      publishedAt: new Date(post.publishedAt),
      updatedAt: post.updatedAt ? new Date(post.updatedAt) : undefined
    };
  }

  private stripFrontMatter(markdown: string): string {
    return markdown.replace(/^---[\s\S]*?---\s*/, '').trim();
  }
}
