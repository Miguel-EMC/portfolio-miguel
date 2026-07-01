import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, inject } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';

import { PortfolioService } from '../../../core/services/portfolio.service';
import { PortfolioProjectMeta } from '../../../interfaces/project.interface';

@Component({
  selector: 'app-portafolio',
  standalone: true,
  imports: [NgForOf, NgIf, TranslateModule],
  templateUrl: './portafolio.component.html',
  styleUrls: ['./portafolio.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PortafolioComponent implements OnInit, OnDestroy {
  private portfolioService = inject(PortfolioService);
  private cdr = inject(ChangeDetectorRef);
  private destroy$ = new Subject<void>();

  activeFilter: 'all' | 'personal' | 'professional' = 'all';
  selectedProject: PortfolioProjectMeta | null = null;
  currentImageIndex = 0;
  allProjects: PortfolioProjectMeta[] = [];
  filteredProjects: PortfolioProjectMeta[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.portfolioService.getAllProjects().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: projects => {
        this.allProjects = projects;
        this.applyFilter();
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get personalProjects(): PortfolioProjectMeta[] {
    return this.allProjects.filter(p => p.type === 'personal');
  }

  get professionalProjects(): PortfolioProjectMeta[] {
    return this.allProjects.filter(p => p.type === 'professional');
  }

  setFilter(filter: 'all' | 'personal' | 'professional'): void {
    this.activeFilter = filter;
    this.applyFilter();
    this.cdr.detectChanges();
  }

  private applyFilter(): void {
    switch (this.activeFilter) {
      case 'personal':
        this.filteredProjects = this.personalProjects;
        break;
      case 'professional':
        this.filteredProjects = this.professionalProjects;
        break;
      default:
        this.filteredProjects = this.allProjects;
    }
  }

  showDetails(project: PortfolioProjectMeta): void {
    this.selectedProject = project;
    this.currentImageIndex = 0;
    document.body.style.overflow = 'hidden';
    this.cdr.detectChanges();
  }

  closeDetails(): void {
    this.selectedProject = null;
    document.body.style.overflow = '';
    this.cdr.detectChanges();
  }

  nextImage(): void {
    if (this.selectedProject && this.selectedProject.images.length > 1) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.selectedProject.images.length;
      this.cdr.detectChanges();
    }
  }

  prevImage(): void {
    if (this.selectedProject && this.selectedProject.images.length > 1) {
      this.currentImageIndex =
        (this.currentImageIndex - 1 + this.selectedProject.images.length) % this.selectedProject.images.length;
      this.cdr.detectChanges();
    }
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
      'TensorFlow Lite': 'bi-cpu',
      Provider: 'bi-arrow-repeat',
      Redux: 'bi-arrow-clockwise',
      Celery: 'bi-gear',
    };
    return icons[tech] || 'bi-code-slash';
  }
}
