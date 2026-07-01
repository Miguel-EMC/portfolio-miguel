import { Component, OnInit, OnDestroy, inject, signal, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil, switchMap } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

import { SeoService } from '../../../core/services/seo.service';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { PortfolioProject, PortfolioProjectMeta } from '../../../interfaces/project.interface';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProjectDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private seoService = inject(SeoService);
  private portfolioService = inject(PortfolioService);
  private destroy$ = new Subject<void>();

  project = signal<PortfolioProject | null>(null);
  relatedProjects = signal<PortfolioProjectMeta[]>([]);
  currentImageIndex = signal(0);
  isLoading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.route.paramMap.pipe(
      takeUntil(this.destroy$),
      switchMap(params => {
        const slug = params.get('slug') ?? '';
        this.isLoading.set(true);
        this.error.set(null);
        return this.portfolioService.getProjectBySlug(slug);
      })
    ).subscribe(project => {
      if (project) {
        this.project.set(project);
        this.currentImageIndex.set(0);
        this.updateSeo(project);
        this.portfolioService.getRelatedProjects(project.slug).pipe(takeUntil(this.destroy$))
          .subscribe(related => this.relatedProjects.set(related));
      } else {
        this.error.set('Project not found');
      }
      this.isLoading.set(false);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateSeo(project: PortfolioProject): void {
    this.seoService.updateForProject({
      title: project.title,
      description: project.description,
      image: project.images[0] || '',
      slug: project.slug
    });
  }

  nextImage(): void {
    const project = this.project();
    if (project && project.images.length > 1) {
      this.currentImageIndex.set((this.currentImageIndex() + 1) % project.images.length);
    }
  }

  prevImage(): void {
    const project = this.project();
    if (project && project.images.length > 1) {
      this.currentImageIndex.set(
        (this.currentImageIndex() - 1 + project.images.length) % project.images.length
      );
    }
  }

  goToImage(index: number): void {
    this.currentImageIndex.set(index);
  }

  getTechIcon(tech: string): string {
    const icons: Record<string, string> = {
      Angular: 'bi-triangle',
      React: 'bi-atom',
      'Vue.js': 'bi-lightning',
      TypeScript: 'bi-braces',
      JavaScript: 'bi-braces',
      HTML5: 'bi-filetype-html',
      CSS3: 'bi-filetype-css',
      'Next.js': 'bi-arrow-repeat',
      'Node.js': 'bi-server',
      Python: 'bi-filetype-py',
      Django: 'bi-diagram-3',
      Laravel: 'bi-boxes',
      NestJS: 'bi-hexagon',
      FastAPI: 'bi-lightning',
      PostgreSQL: 'bi-database',
      MySQL: 'bi-database-fill',
      MongoDB: 'bi-database-down',
      Firebase: 'bi-fire',
      Redis: 'bi-database-gear',
      Flutter: 'bi-phone',
      'React Native': 'bi-phone-landscape',
      Dart: 'bi-lightning-charge',
      Bootstrap: 'bi-bootstrap',
      'Tailwind CSS': 'bi-wind',
      'Material Design': 'bi-palette',
      Docker: 'bi-box-seam',
      Kubernetes: 'bi-diagram-3',
      AWS: 'bi-cloud',
      Stripe: 'bi-credit-card',
      'Chart.js': 'bi-bar-chart',
      'D3.js': 'bi-graph-up',
    };
    return icons[tech] || 'bi-code-slash';
  }

  goBack(): void {
    this.router.navigate(['/portfolio']);
  }
}
