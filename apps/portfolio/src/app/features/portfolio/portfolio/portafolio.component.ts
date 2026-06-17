import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NgForOf, NgIf } from "@angular/common";
import { TranslateModule } from '@ngx-translate/core';

// Data imports
import { portfolioProjects, type PortfolioProject } from '../../../core/data/portfolio-projects.data';

@Component({
  selector: 'app-portafolio',
  standalone: true,
  imports: [NgForOf, NgIf, TranslateModule],
  templateUrl: './portafolio.component.html',
  styleUrls: ['./portafolio.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PortafolioComponent implements OnInit {
  activeFilter: 'all' | 'personal' | 'professional' = 'all';
  selectedProject: any = null;
  currentImageIndex: number = 0;
  allProjects: any[] = [];
  filteredProjects: any[] = [];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.allProjects = portfolioProjects;
    this.filteredProjects = this.allProjects;
  }

  get personalProjects(): any[] {
    return this.allProjects.filter(project => project.type === 'personal');
  }

  get professionalProjects(): any[] {
    return this.allProjects.filter(project => project.type === 'professional');
  }

  setFilter(filter: 'all' | 'personal' | 'professional') {
    this.activeFilter = filter;
    
    switch (filter) {
      case 'personal':
        this.filteredProjects = this.personalProjects;
        break;
      case 'professional':
        this.filteredProjects = this.professionalProjects;
        break;
      default:
        this.filteredProjects = this.allProjects;
    }
    this.cdr.detectChanges();
  }

  showDetails(project: any): void {
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
      'Celery': 'bi-gear'
    };

    return icons[tech] || 'bi-code-slash';
  }
}