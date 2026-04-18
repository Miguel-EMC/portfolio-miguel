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

    // Custom renderer for syntax highlighting
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
    return this.http.get<BlogManifest>(`${this.contentPath}manifest.json`).pipe(
      tap(manifest => {
        // Convert date strings to Date objects
        manifest.posts = manifest.posts.map(post => ({
          ...post,
          publishedAt: new Date(post.publishedAt),
          updatedAt: post.updatedAt ? new Date(post.updatedAt) : undefined
        }));
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
    return this.manifest$.pipe(
      switchMap(manifest => {
        if (!manifest) {
          return this.loadManifest().pipe(map(m => m.posts));
        }
        return of(manifest.posts);
      }),
      map(posts => posts.filter(post => post.published)),
      map(posts => posts.sort((a, b) => 
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      ))
    );
  }

  getPostBySlug(slug: string): Observable<BlogPost | null> {
    if (this.postsCache.has(slug)) {
      return of(this.postsCache.get(slug)!);
    }

    return this.http.get(`${this.contentPath}posts/${slug}.md`, { responseType: 'text' }).pipe(
      map(content => this.parseMarkdownPost(slug, content)),
      tap(post => {
        if (post) {
          this.postsCache.set(slug, post);
        }
      }),
      catchError(error => {
        console.error(`Failed to load post: ${slug}`, error);
        return of(null);
      })
    );
  }

  private parseMarkdownPost(slug: string, rawContent: string): BlogPost | null {
    try {
      // Parse frontmatter manually (gray-matter alternative for browser)
      const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
      const match = rawContent.match(frontmatterRegex);
      
      if (!match) {
        console.error('Invalid markdown format: missing frontmatter');
        return null;
      }

      const [, frontmatterStr, markdownContent] = match;
      const frontmatter = this.parseFrontmatter(frontmatterStr);
      const htmlContent = marked.parse(markdownContent) as string;

      return {
        slug,
        title: frontmatter.title || 'Untitled',
        excerpt: frontmatter.excerpt || '',
        content: htmlContent,
        author: frontmatter.author || 'Anonymous',
        publishedAt: new Date(frontmatter.publishedAt || Date.now()),
        updatedAt: frontmatter.updatedAt ? new Date(frontmatter.updatedAt) : undefined,
        category: frontmatter.category || 'general',
        tags: frontmatter.tags || [],
        coverImage: frontmatter.coverImage || '/assets/img/blog-default.jpg',
        readingTime: this.calculateReadingTime(markdownContent),
        featured: frontmatter.featured || false,
        published: frontmatter.published !== false
      };
    } catch (error) {
      console.error('Error parsing markdown post:', error);
      return null;
    }
  }

  private parseFrontmatter(frontmatterStr: string): Record<string, any> {
    const result: Record<string, any> = {};
    const lines = frontmatterStr.split('\n');
    
    for (const line of lines) {
      const colonIndex = line.indexOf(':');
      if (colonIndex === -1) continue;
      
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      
      // Handle arrays (tags: [tag1, tag2])
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1);
        result[key] = value.split(',').map(v => v.trim().replace(/['"]/g, ''));
      }
      // Handle booleans
      else if (value === 'true' || value === 'false') {
        result[key] = value === 'true';
      }
      // Handle quoted strings
      else if ((value.startsWith('"') && value.endsWith('"')) || 
               (value.startsWith("'") && value.endsWith("'"))) {
        result[key] = value.slice(1, -1);
      }
      // Default: string
      else {
        result[key] = value;
      }
    }
    
    return result;
  }

  private calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
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
      switchMap(posts => {
        const currentPost = posts.find(p => p.slug === currentSlug);
        if (!currentPost) return of([]);

        // Find posts with matching category or tags
        const related = posts
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

        return of(related);
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
