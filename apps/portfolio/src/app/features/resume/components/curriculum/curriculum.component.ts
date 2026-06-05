import { Component, OnInit, HostListener, PLATFORM_ID, Inject } from '@angular/core';
import { NgClass, NgForOf, NgIf } from "@angular/common";
import { isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

// Data imports
import { experiences, type Experience } from '../../../../core/data/experience.data';


interface TechSkill {
  name: string;
  icon: string;
  level: number;
}

interface Technology {
  name: string;
  level: number;
}

interface TechCategory {
  name: string;
  icon: string;
  technologies: Technology[];
}

@Component({
  selector: 'app-curriculum',
  standalone: true,
  imports: [NgClass, NgForOf, NgIf, TranslateModule],
  templateUrl: './curriculum.component.html',
  styleUrls: ['./curriculum.component.scss']
})
export class CurriculumComponent implements OnInit {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }
  experiences: Experience[] = experiences;

  techStack: TechCategory[] = [
    {
      name: 'Backend & AI Engineering',
      icon: 'bi bi-server',
      technologies: [
        { name: 'Python', level: 90 },
        { name: 'FastAPI', level: 85 },
        { name: 'Django', level: 80 },
        { name: 'NestJS', level: 80 },
        { name: 'Laravel/Lumen', level: 75 },
        { name: 'Prisma', level: 75 }
      ]
    },
    {
      name: 'Artificial Intelligence',
      icon: 'bi bi-robot',
      technologies: [
        { name: 'LangGraph', level: 85 },
        { name: 'LangChain', level: 80 },
        { name: 'AWS Bedrock', level: 75 },
        { name: 'RAG', level: 75 },
        { name: 'SQL Agents', level: 80 }
      ]
    },
    {
      name: 'Infrastructure & Cloud',
      icon: 'bi bi-cloud',
      technologies: [
        { name: 'AWS Lambdas', level: 80 },
        { name: 'Terraform', level: 75 },
        { name: 'Docker', level: 80 },
        { name: 'CI/CD', level: 80 },
        { name: 'CloudWatch', level: 70 },
        { name: 'Google Cloud', level: 65 }
      ]
    },
    {
      name: 'Frontend Development',
      icon: 'bi bi-palette',
      technologies: [
        { name: 'Angular', level: 85 },
        { name: 'React', level: 75 },
        { name: 'TypeScript', level: 90 },
        { name: 'JavaScript', level: 90 }
      ]
    },
    {
      name: 'Mobile Development',
      icon: 'bi bi-phone',
      technologies: [
        { name: 'Flutter', level: 85 },
        { name: 'React Native', level: 70 },
        { name: 'Firebase', level: 75 }
      ]
    },
    {
      name: 'Bases de Datos',
      icon: 'bi bi-database',
      technologies: [
        { name: 'PostgreSQL', level: 85 },
        { name: 'SQL Server', level: 75 },
        { name: 'MySQL', level: 80 }
      ]
    }
  ];

  // Simplified tech skills for the compact section
  techSkills: TechSkill[] = [
    { name: 'Python', icon: 'bi bi-filetype-py', level: 90 },
    { name: 'FastAPI', icon: 'bi bi-lightning', level: 85 },
    { name: 'LangGraph', icon: 'bi bi-diagram-3', level: 85 },
    { name: 'AWS Bedrock', icon: 'bi bi-robot', level: 75 },
    { name: 'TypeScript', icon: 'bi bi-braces', level: 90 },
    { name: 'Angular', icon: 'bi bi-triangle', level: 85 },
    { name: 'Flutter', icon: 'bi bi-phone', level: 85 },
    { name: 'NestJS', icon: 'bi bi-server', level: 80 },
    { name: 'PostgreSQL', icon: 'bi bi-database', level: 85 },
    { name: 'Docker', icon: 'bi bi-box-seam', level: 80 },
    { name: 'Terraform', icon: 'bi bi-cloud', level: 75 },
    { name: 'AWS', icon: 'bi bi-cloud', level: 80 }
  ];

  visibleItems: boolean[] = [];
  expandedIndex: number = 0; // First item expanded by default
  showAllExperiences: boolean = false;

  ngOnInit() {
    this.visibleItems = new Array(this.experiences.length).fill(true);
  }

  toggleExperience(index: number) {
    if (this.expandedIndex === index) {
      this.expandedIndex = -1; // Collapse if already open
    } else {
      this.expandedIndex = index; // Expand clicked item
    }
  }

  toggleShowAll() {
    this.showAllExperiences = !this.showAllExperiences;
  }

  getVisibleExperiences(): Experience[] {
    return this.showAllExperiences ? this.experiences : this.experiences.slice(0, 3);
  }

  isVisible(index: number): boolean {
    return this.visibleItems[index];
  }

  scrollToSection(sectionId: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const section = document.getElementById(sectionId);
    if (section) {
      const offset = 80;
      const elementPosition = section.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }

  getPositionLevel(title: string): string {
    if (title.includes('Full Stack Developer') && !title.includes('Jr')) {
      return 'Senior Level';
    } else if (title.includes('Jr')) {
      return 'Junior Level';
    } else if (title.includes('Desarrollador')) {
      return 'Mid Level';
    }
    return 'Professional';
  }

  calculateDuration(dateRange: string): string {
    if (dateRange.includes('Actualidad')) {
      const startDate = new Date('2024-06-01');
      const currentDate = new Date();
      const diffTime = Math.abs(currentDate.getTime() - startDate.getTime());
      const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
      return `${diffMonths} meses`;
    } else if (dateRange.includes('Nov 2023 - Oct 2024')) {
      return '11 meses';
    } else if (dateRange.includes('Ene 2023 - Sep 2023')) {
      return '9 meses';
    }
    return '1 año';
  }

  getTechIcons(title: string): string[] {
    if (title.includes('Full Stack Developer')) {
      return ['bi bi-triangle', 'bi bi-server', 'bi bi-database'];
    } else if (title.includes('Desarrollador')) {
      return ['bi bi-code-slash', 'bi bi-palette', 'bi bi-gear'];
    }
    return ['bi bi-code-slash', 'bi bi-laptop', 'bi bi-tools'];
  }

  getImpactMetric(task: string): string | null {
    if (task.includes('40%')) return '+40% UX';
    if (task.includes('35%')) return '+35% Performance';
    if (task.includes('15+')) return '15+ Instituciones';
    if (task.includes('100%')) return '100% On Time';
    return null;
  }

  getTechIcon(techName: string): string {
    const icons: { [key: string]: string } = {
      'Angular': 'bi bi-triangle',
      'React': 'bi bi-atom',
      'Vue.js': 'bi bi-lightning',
      'TypeScript': 'bi bi-braces',
      'JavaScript': 'bi bi-braces',
      'HTML5/CSS3': 'bi bi-filetype-html',
      'Node.js': 'bi bi-server',
      'Python': 'bi bi-filetype-py',
      'Django': 'bi bi-diagram-3',
      'Laravel': 'bi bi-boxes',
      'PHP': 'bi bi-filetype-php',
      'Express.js': 'bi bi-server',
      'PostgreSQL': 'bi bi-database',
      'MySQL': 'bi bi-database-fill',
      'MongoDB': 'bi bi-database-down',
      'Firebase': 'bi bi-fire',
      'SQL Server': 'bi bi-database-check',
      'Redis': 'bi bi-database-gear',
      'Docker': 'bi bi-box-seam',
      'AWS': 'bi bi-cloud',
      'Git': 'bi bi-git',
      'Linux': 'bi bi-terminal',
      'Nginx': 'bi bi-server',
      'Jenkins': 'bi bi-gear',
      'Flutter': 'bi bi-phone',
      'Dart': 'bi bi-lightning-charge',
      'React Native': 'bi bi-phone-landscape',
      'PWA': 'bi bi-app',
      'Scrum/Agile': 'bi bi-kanban',
      'Figma': 'bi bi-pencil-square',
      'Jira': 'bi bi-kanban',
      'Postman': 'bi bi-send',
      'VS Code': 'bi bi-code-square',
      'Clean Code': 'bi bi-code-slash'
    };
    return icons[techName] || 'bi bi-code-slash';
  }

  getLevelText(level: number): string {
    if (level >= 90) return 'Experto';
    if (level >= 80) return 'Avanzado';
    if (level >= 70) return 'Intermedio';
    return 'Básico';
  }

  getTotalExperience(): number {
    return 2;
  }

  getTotalProjects(): number {
    return 25;
  }

  getTotalTechnologies(): number {
    return this.techStack.reduce((total, category) => total + category.technologies.length, 0);
  }

  getTechForExperience(index: number): string[] {
    const techByExperience = [
      ['Angular', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker'],
      ['Laravel', 'Vue.js', 'Python', 'Django', 'MySQL'],
      ['HTML5', 'CSS3', 'JavaScript', 'SQL Server', 'Git']
    ];
    return techByExperience[index] || [];
  }

  getFrontendTechs(): TechSkill[] {
    return [
      { name: 'Angular', icon: 'bi bi-triangle', level: 85 },
      { name: 'React', icon: 'bi bi-atom', level: 75 },
      { name: 'TypeScript', icon: 'bi bi-braces', level: 90 },
      { name: 'JavaScript', icon: 'bi bi-braces', level: 90 }
    ];
  }

  getBackendTechs(): TechSkill[] {
    return [
      { name: 'Python', icon: 'bi bi-filetype-py', level: 90 },
      { name: 'FastAPI', icon: 'bi bi-lightning', level: 85 },
      { name: 'NestJS', icon: 'bi bi-server', level: 80 },
      { name: 'Django', icon: 'bi bi-diagram-3', level: 80 }
    ];
  }

  getDatabaseTechs(): TechSkill[] {
    return [
      { name: 'PostgreSQL', icon: 'bi bi-database', level: 85 },
      { name: 'SQL Server', icon: 'bi bi-database-fill', level: 75 },
      { name: 'MySQL', icon: 'bi bi-database-down', level: 80 },
      { name: 'Firebase', icon: 'bi bi-fire', level: 75 }
    ];
  }

  getDevOpsTechs(): TechSkill[] {
    return [
      { name: 'AWS Lambdas', icon: 'bi bi-cloud', level: 80 },
      { name: 'Terraform', icon: 'bi bi-cloud', level: 75 },
      { name: 'Docker', icon: 'bi bi-box-seam', level: 80 },
      { name: 'Linux', icon: 'bi bi-terminal', level: 85 }
    ];
  }

  getFeaturedTechs(): any[] {
    return [
      { name: 'Python/FastAPI', icon: 'bi bi-filetype-py', level: 90, category: 'Backend' },
      { name: 'LangGraph', icon: 'bi bi-diagram-3', level: 85, category: 'AI' },
      { name: 'AWS', icon: 'bi bi-cloud', level: 80, category: 'Cloud' },
      { name: 'Flutter', icon: 'bi bi-phone', level: 85, category: 'Mobile' }
    ];
  }

  getTechCategories(): any[] {
    return [
      {
        name: 'Backend & AI',
        icon: 'bi bi-server',
        technologies: [
          { name: 'Python/FastAPI', level: 90 },
          { name: 'LangGraph', level: 85 },
          { name: 'NestJS', level: 80 }
        ]
      },
      {
        name: 'Cloud & Infra',
        icon: 'bi bi-cloud',
        technologies: [
          { name: 'AWS', level: 80 },
          { name: 'Terraform', level: 75 },
          { name: 'Docker', level: 80 }
        ]
      },
      {
        name: 'Frontend',
        icon: 'bi bi-palette',
        technologies: [
          { name: 'Angular', level: 85 },
          { name: 'React', level: 75 },
          { name: 'TypeScript', level: 90 }
        ]
      },
      {
        name: 'Mobile',
        icon: 'bi bi-phone',
        technologies: [
          { name: 'Flutter', level: 85 },
          { name: 'React Native', level: 70 },
          { name: 'Firebase', level: 75 }
        ]
      }
    ];
  }

  getTotalTechCount(): number {
    return 20;
  }

  getPrimaryTechs(): any[] {
    return [
      { name: 'Python', icon: 'bi bi-filetype-py', level: 90 },
      { name: 'FastAPI', icon: 'bi bi-lightning', level: 85 },
      { name: 'LangGraph', icon: 'bi bi-diagram-3', level: 85 },
      { name: 'TypeScript', icon: 'bi bi-braces', level: 90 }
    ];
  }

  getSecondaryTechs(): any[] {
    return [
      { name: 'Angular', icon: 'bi bi-triangle', level: 85 },
      { name: 'React', icon: 'bi bi-atom', level: 75 },
      { name: 'NestJS', icon: 'bi bi-server', level: 80 },
      { name: 'Django', icon: 'bi bi-diagram-3', level: 80 },
      { name: 'Flutter', icon: 'bi bi-phone', level: 85 },
      { name: 'AWS Bedrock', icon: 'bi bi-robot', level: 75 },
      { name: 'Prisma', icon: 'bi bi-boxes', level: 75 },
      { name: 'PostgreSQL', icon: 'bi bi-database', level: 85 }
    ];
  }

  getToolsTechs(): any[] {
    return [
      { name: 'Docker', icon: 'bi bi-box-seam', level: 80 },
      { name: 'Terraform', icon: 'bi bi-cloud', level: 75 },
      { name: 'CI/CD', icon: 'bi bi-arrow-repeat', level: 80 },
      { name: 'CloudWatch', icon: 'bi bi-graph-up', level: 70 },
      { name: 'Linux', icon: 'bi bi-terminal', level: 85 },
      { name: 'Git', icon: 'bi bi-git', level: 90 }
    ];
  }

  getExperienceIcon(index: number): string {
    const icons = [
      'bi bi-star-fill',        // Experiencia actual - estrella
      'bi bi-code-slash',       // Freelance - código
      'bi bi-rocket-takeoff'    // Primera experiencia - cohete
    ];
    return icons[index] || 'bi bi-briefcase-fill';
  }

  getSkillCategories(): any[] {
    return [
      {
        name: 'Backend & AI Engineering',
        icon: 'bi bi-gear-fill',
        skills: [
          { name: 'Python', level: 90 },
          { name: 'FastAPI', level: 85 },
          { name: 'Django', level: 80 },
          { name: 'NestJS', level: 80 },
          { name: 'LangGraph', level: 85 },
          { name: 'AWS Bedrock', level: 75 }
        ]
      },
      {
        name: 'Programming Languages',
        icon: 'bi bi-code-slash',
        skills: [
          { name: 'Python', level: 90 },
          { name: 'TypeScript', level: 90 },
          { name: 'JavaScript', level: 90 },
          { name: 'PHP', level: 75 },
          { name: 'Dart', level: 75 },
          { name: 'SQL', level: 85 }
        ]
      },
      {
        name: 'Infrastructure & Cloud',
        icon: 'bi bi-cloud',
        skills: [
          { name: 'AWS Lambdas', level: 80 },
          { name: 'S3', level: 80 },
          { name: 'Terraform', level: 75 },
          { name: 'Docker', level: 80 },
          { name: 'CI/CD', level: 80 },
          { name: 'CloudWatch', level: 70 }
        ]
      },
      {
        name: 'Frontend & Mobile',
        icon: 'bi bi-layers',
        skills: [
          { name: 'Angular', level: 85 },
          { name: 'React', level: 75 },
          { name: 'Flutter', level: 85 },
          { name: 'React Native', level: 70 },
          { name: 'Firebase', level: 75 }
        ]
      }
    ];
  }

  getCategoryOverview(): any[] {
    return [
      { name: 'Backend & AI Engineering', icon: 'bi bi-gear-fill', level: 85 },
      { name: 'Programming Languages', icon: 'bi bi-code-slash', level: 87 },
      { name: 'Infrastructure & Cloud', icon: 'bi bi-cloud', level: 78 },
      { name: 'Frontend & Mobile', icon: 'bi bi-layers', level: 80 }
    ];
  }
}