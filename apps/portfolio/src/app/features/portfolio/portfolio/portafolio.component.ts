import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, inject } from '@angular/core';
import { NgForOf, NgIf } from "@angular/common";
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';

import { PortfolioService } from '../../../core/services/portfolio.service';
import { PortfolioProject } from '../../../interfaces/project.interface';

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
  private translate = inject(TranslateService);
  private cdr = inject(ChangeDetectorRef);
  private destroy$ = new Subject<void>();

  activeFilter: 'all' | 'personal' | 'professional' = 'all';
  selectedProject: PortfolioProject | null = null;
  currentImageIndex = 0;
  allProjects: PortfolioProject[] = [];
  filteredProjects: PortfolioProject[] = [];
  currentLang: 'es' | 'en' = 'es';

  ngOnInit(): void {
    // Track language changes
    this.currentLang = (this.translate.currentLang || this.translate.defaultLang || 'es') as 'es' | 'en';
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(event => {
      this.currentLang = (event.lang || 'es') as 'es' | 'en';
      this.cdr.markForCheck();
    });

    // Load projects from generated JSON
    this.portfolioService.loadProjects().pipe(takeUntil(this.destroy$)).subscribe(projects => {
      this.allProjects = projects;
      this.applyFilter();
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get personalProjects(): PortfolioProject[] {
    return this.allProjects.filter(p => p.type === 'personal');
  }

  get professionalProjects(): PortfolioProject[] {
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

  /** Get localized text from a project's bilingual field, fallback to empty string. */
  t(field: { es: string; en: string } | undefined): string {
    if (!field) return '';
    return field[this.currentLang] || field['es'] || field['en'] || '';
  }

  /** Get localized list from a project's bilingual list field, fallback to empty array. */
  tList(field: { es: string[]; en: string[] } | undefined): string[] {
    if (!field) return [];
    return field[this.currentLang] || field['es'] || [];
  }

  showDetails(project: PortfolioProject): void {
    this.selectedProject = project;
    this.currentImageIndex = 0;
    document.body.style.overflow = 'hidden';
    this.cdr.detectChanges();
  }

  closeDetails(): void {
    this.selectedProject = null;
    document.body.style.overflow = '';
  }

  nextImage(): void {
    if (this.selectedProject && this.selectedProject.images.length > 1) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.selectedProject.images.length;
    }
  }

  prevImage(): void {
    if (this.selectedProject && this.selectedProject.images.length > 1) {
      this.currentImageIndex =
        (this.currentImageIndex - 1 + this.selectedProject.images.length) % this.selectedProject.images.length;
    }
  }

  getTechIcon(tech: string): string {
    const icons: { [key: string]: string } = {
      // Frontend
      'Angular': 'bi-triangle',
      'React': 'bi-atom',
      'Vue.js': 'bi-lightning',
      'TypeScript': 'bi-braces',
      'JavaScript': 'bi-braces',
      'HTML5': 'bi-filetype-html',
      'CSS3': 'bi-filetype-css',
      'Next.js': 'bi-arrow-repeat',
      // Backend
      'Node.js': 'bi-server',
      'Python': 'bi-filetype-py',
      'Django': 'bi-diagram-3',
      'Laravel': 'bi-boxes',
      'NestJS': 'bi-hexagon',
      'FastAPI': 'bi-lightning',
      // Databases
      'PostgreSQL': 'bi-database',
      'MySQL': 'bi-database-fill',
      'MongoDB': 'bi-database-down',
      'Firebase': 'bi-fire',
      'Redis': 'bi-database-gear',
      // Mobile
      'Flutter': 'bi-phone',
      'React Native': 'bi-phone-landscape',
      'Dart': 'bi-lightning-charge',
      // Styling
      'Bootstrap': 'bi-bootstrap',
      'Tailwind CSS': 'bi-wind',
      'Material Design': 'bi-palette',
      // Tools & Services
      'Docker': 'bi-box-seam',
      'Kubernetes': 'bi-diagram-3',
      'AWS': 'bi-cloud',
      'Stripe': 'bi-credit-card',
      'Chart.js': 'bi-bar-chart',
      'D3.js': 'bi-graph-up',
      'TensorFlow Lite': 'bi-cpu',
      // State Management
      'Provider': 'bi-arrow-repeat',
      'Redux': 'bi-arrow-clockwise',
      // Others
      'Celery': 'bi-gear',
    };
    return icons[tech] || 'bi-code-slash';
  }
}
