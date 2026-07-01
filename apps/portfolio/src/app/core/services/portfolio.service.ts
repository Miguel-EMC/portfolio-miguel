import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError, map, tap, forkJoin } from 'rxjs';
import { marked } from 'marked';
import hljs from 'highlight.js';

import {
  PortfolioProject,
  PortfolioProjectMeta,
  PortfolioManifest,
} from '../../interfaces/project.interface';
import { LanguageService } from '../../shared/services/language.service';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private http = inject(HttpClient);
  private languageService = inject(LanguageService);

  private readonly basePath = '/assets/portfolio';
  private projectsCache = new Map<string, PortfolioProject>();

  constructor() {
    this.configureMarked();
  }

  private configureMarked(): void {
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

  private stripFrontmatter(content: string): string {
    return content.replace(/^---[\s\S]*?---\s*\n/, '');
  }

  getAllProjects(): Observable<PortfolioProjectMeta[]> {
    const lang = this.lang;
    return this.http
      .get<PortfolioManifest>(`${this.basePath}/manifest.${lang}.json`)
      .pipe(
        map(manifest => manifest.projects),
        catchError(err => {
          console.error('Failed to load portfolio manifest:', err);
          return of([]);
        })
      );
  }

  getProjectBySlug(slug: string): Observable<PortfolioProject | null> {
    const lang = this.lang;
    const cacheKey = `${lang}:${slug}`;

    if (this.projectsCache.has(cacheKey)) {
      return of(this.projectsCache.get(cacheKey)!);
    }

    return forkJoin({
      manifest: this.http.get<PortfolioManifest>(`${this.basePath}/manifest.${lang}.json`),
      rawContent: this.http.get(`${this.basePath}/posts/${slug}.${lang}.md`, { responseType: 'text' })
    }).pipe(
      map(({ manifest, rawContent }) => {
        const meta = manifest.projects.find(p => p.slug === slug);
        if (!meta) return null;

        const markdownBody = this.stripFrontmatter(rawContent);
        const project: PortfolioProject = {
          ...meta,
          content: marked.parse(markdownBody) as string,
        };
        return project;
      }),
      tap(project => {
        if (project) this.projectsCache.set(cacheKey, project);
      }),
      catchError(err => {
        console.error(`Failed to load project ${slug}:`, err);
        return of(null);
      })
    );
  }

  getFeaturedProjects(): Observable<PortfolioProjectMeta[]> {
    return this.getAllProjects().pipe(
      map(projects => projects.filter(p => p.featured))
    );
  }

  getRelatedProjects(currentSlug: string, limit = 3): Observable<PortfolioProjectMeta[]> {
    return this.getAllProjects().pipe(
      map(projects => {
        const current = projects.find(p => p.slug === currentSlug);
        if (!current) return [];

        return projects
          .filter(p => p.slug !== currentSlug)
          .map(p => {
            let score = 0;
            if (p.type === current.type) score += 2;
            score += p.frameworks.filter(f => current.frameworks.includes(f)).length;
            return { p, score };
          })
          .filter(item => item.score > 0)
          .sort((a, b) => b.score - a.score)
          .slice(0, limit)
          .map(item => item.p);
      })
    );
  }

  clearCache(): void {
    this.projectsCache.clear();
  }
}
