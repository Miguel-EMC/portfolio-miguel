import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, catchError, map, tap, forkJoin } from 'rxjs';
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
import { LanguageService } from '../../shared/services/language.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private http = inject(HttpClient);
  private languageService = inject(LanguageService);
  private readonly contentPath = environment.blog.contentPath;

  private postsCache = new Map<string, BlogPost>();
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

  private get lang(): string {
    const l = this.languageService.getCurrentLanguage();
    return l.startsWith('es') ? 'es' : 'en';
  }

  private get manifestUrl(): string {
    return `${this.contentPath}manifest.${this.lang}.json`;
  }

  private postUrl(slug: string): string {
    return `${this.contentPath}posts/${slug}.${this.lang}.md`;
  }

  private cacheKey(slug: string): string {
    return `${this.lang}:${slug}`;
  }

  private stripFrontmatter(content: string): string {
    return content.replace(/^---[\s\S]*?---\s*\n/, '');
  }

  private normalizePost(post: BlogPostMeta): BlogPostMeta {
    return {
      ...post,
      publishedAt: new Date(post.publishedAt),
      updatedAt: post.updatedAt ? new Date(post.updatedAt) : undefined
    };
  }

  loadManifest(): Observable<BlogManifest> {
    return this.http.get<BlogManifest>(this.manifestUrl).pipe(
      tap(manifest => {
        manifest.posts = manifest.posts.map(p => this.normalizePost(p));
        this.manifestSubject.next(manifest);
      }),
      catchError(error => {
        console.error('Failed to load blog manifest:', error);
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

  getAllPosts(): Observable<BlogPostMeta[]> {
    return this.http.get<BlogManifest>(this.manifestUrl).pipe(
      map(manifest => manifest.posts.map(p => this.normalizePost(p))),
      catchError(error => {
        console.error('Failed to load posts:', error);
        return of([]);
      })
    );
  }

  getPostBySlug(slug: string): Observable<BlogPost | null> {
    const key = this.cacheKey(slug);
    if (this.postsCache.has(key)) {
      return of(this.postsCache.get(key)!);
    }

    return forkJoin({
      manifest: this.http.get<BlogManifest>(this.manifestUrl),
      rawContent: this.http.get(this.postUrl(slug), { responseType: 'text' })
    }).pipe(
      map(({ manifest, rawContent }) => {
        const meta = manifest.posts.find(p => p.slug === slug);
        if (!meta) return null;

        const markdownContent = this.stripFrontmatter(rawContent);
        const post: BlogPost = {
          ...this.normalizePost(meta),
          content: marked.parse(markdownContent) as string
        };
        return post;
      }),
      tap(post => {
        if (post) this.postsCache.set(key, post);
      }),
      catchError(error => {
        console.error(`Failed to load post ${slug}:`, error);
        return of(null);
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
    this.manifestSubject.next(null);
  }
}
