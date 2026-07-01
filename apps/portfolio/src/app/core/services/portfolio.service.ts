import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, shareReplay, map, catchError } from 'rxjs';
import { PortfolioProject } from '../../interfaces/project.interface';
import { environment } from '../../../environments/environment';

interface ProjectsManifest {
  projects: PortfolioProject[];
  lastUpdated: string;
}

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private http = inject(HttpClient);
  private readonly contentPath = environment.portfolio.contentPath;

  private projects$: Observable<PortfolioProject[]> | null = null;

  /** Load all projects from generated projects.json (cached, shareReplay). */
  loadProjects(): Observable<PortfolioProject[]> {
    if (!this.projects$) {
      this.projects$ = this.http
        .get<ProjectsManifest>(`${this.contentPath}projects.json`)
        .pipe(
          map(manifest => manifest.projects),
          catchError(error => {
            console.error('Failed to load portfolio projects:', error);
            return of([]);
          }),
          shareReplay(1)
        );
    }
    return this.projects$;
  }

  /** Get featured projects (for home section). */
  getFeatured(): Observable<PortfolioProject[]> {
    return this.loadProjects().pipe(
      map(projects => projects.filter(p => p.featured))
    );
  }

  /** Get project by slug. */
  getBySlug(slug: string): Observable<PortfolioProject | null> {
    return this.loadProjects().pipe(
      map(projects => projects.find(p => p.slug === slug) ?? null)
    );
  }

  /** Get related projects (same type or shared frameworks), excluding current slug. */
  getRelated(currentSlug: string, limit = 3): Observable<PortfolioProject[]> {
    return this.loadProjects().pipe(
      map(projects => {
        const current = projects.find(p => p.slug === currentSlug);
        if (!current) return [];
        return projects
          .filter(p => p.slug !== currentSlug)
          .filter(p =>
            p.type === current.type ||
            p.frameworks.some(f => current.frameworks.includes(f))
          )
          .slice(0, limit);
      })
    );
  }

  /** Clear cached observable (useful after content hot-reload in dev). */
  clearCache(): void {
    this.projects$ = null;
  }
}
