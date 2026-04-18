import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { SeoService } from '../../../core/services/seo.service';
import { 
  portfolioProjects, 
  findProjectBySlug, 
  getRelatedProjects,
  PortfolioProject 
} from '../../../core/data/portfolio-projects.data';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss']
})
export class ProjectDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private seoService = inject(SeoService);
  private translateService = inject(TranslateService);
  private destroy$ = new Subject<void>();

  project = signal<PortfolioProject | null>(null);
  relatedProjects = signal<PortfolioProject[]>([]);
  currentImageIndex = signal(0);
  isLoading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        this.loadProject(slug);
      } else {
        this.error.set('Project not found');
        this.isLoading.set(false);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadProject(slug: string): void {
    this.isLoading.set(true);
    this.error.set(null);

    const project = findProjectBySlug(slug);
    
    if (project) {
      this.project.set(project);
      this.relatedProjects.set(getRelatedProjects(slug, 3));
      this.currentImageIndex.set(0);
      this.updateSeo(project);
    } else {
      this.error.set('Project not found');
    }
    
    this.isLoading.set(false);
  }

  private updateSeo(project: PortfolioProject): void {
    const title = this.translateService.instant(`projects.${project.id}.title`);
    const description = this.translateService.instant(`projects.${project.id}.description`);
    
    this.seoService.updateForProject({
      title,
      description,
      image: project.images[0] || '',
      slug: project.slug
    });
  }

  nextImage(): void {
    const project = this.project();
    if (project && project.images.length > 1) {
      this.currentImageIndex.set(
        (this.currentImageIndex() + 1) % project.images.length
      );
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
    const icons: { [key: string]: string } = {
      'Angular': 'bi-triangle',
      'React': 'bi-atom',
      'Vue.js': 'bi-lightning',
      'TypeScript': 'bi-braces',
      'JavaScript': 'bi-braces',
      'HTML5': 'bi-filetype-html',
      'CSS3': 'bi-filetype-css',
      'Next.js': 'bi-arrow-repeat',
      'Node.js': 'bi-server',
      'Python': 'bi-filetype-py',
      'Django': 'bi-diagram-3',
      'Laravel': 'bi-boxes',
      'NestJS': 'bi-hexagon',
      'FastAPI': 'bi-lightning',
      'PostgreSQL': 'bi-database',
      'MySQL': 'bi-database-fill',
      'MongoDB': 'bi-database-down',
      'Firebase': 'bi-fire',
      'Redis': 'bi-database-gear',
      'Flutter': 'bi-phone',
      'React Native': 'bi-phone-landscape',
      'Dart': 'bi-lightning-charge',
      'Bootstrap': 'bi-bootstrap',
      'Tailwind CSS': 'bi-wind',
      'Material Design': 'bi-palette',
      'Docker': 'bi-box-seam',
      'Kubernetes': 'bi-diagram-3',
      'AWS': 'bi-cloud',
      'Stripe': 'bi-credit-card',
      'Chart.js': 'bi-bar-chart',
      'D3.js': 'bi-graph-up'
    };

    return icons[tech] || 'bi-code-slash';
  }

  goBack(): void {
    this.router.navigate(['/portfolio']);
  }
}
