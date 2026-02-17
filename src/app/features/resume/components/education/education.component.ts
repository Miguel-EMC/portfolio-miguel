import { Component } from '@angular/core';
import { NgForOf, NgIf } from "@angular/common";
import { TranslateModule } from '@ngx-translate/core';

// Data imports
import { educationItems, type Education } from '../../../../core/data/education.data';


interface SkillCategory {
  name: string;
  icon: string;
  skills: string[];
}

@Component({
  selector: 'app-education',
  standalone: true,
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.scss'],
  imports: [NgForOf, NgIf, TranslateModule]
})
export class EducationComponent {
  educationItems: Education[] = educationItems;

  skillsAcquired: SkillCategory[] = [
    {
      name: 'Backend & AI Engineering',
      icon: 'bi bi-code-slash',
      skills: [
        'Python', 'FastAPI', 'Django', 'NestJS', 'Express', 'Laravel', 'Lumen', 'TypeScript', 'JavaScript'
      ]
    },
    {
      name: 'Inteligencia Artificial',
      icon: 'bi bi-robot',
      skills: [
        'LangGraph', 'LangChain', 'RAG', 'AWS Bedrock', 'SQL Agents', 'Prisma'
      ]
    },
    {
      name: 'Frontend & Mobile',
      icon: 'bi bi-layers',
      skills: [
        'Angular', 'React', 'Flutter', 'React Native', 'Firebase'
      ]
    },
    {
      name: 'Bases de Datos',
      icon: 'bi bi-database',
      skills: [
        'PostgreSQL', 'SQL Server', 'MySQL', 'Modelado de datos'
      ]
    },
    {
      name: 'Infrastructure & Cloud',
      icon: 'bi bi-cloud',
      skills: [
        'AWS Lambdas', 'S3', 'CloudWatch', 'Terraform', 'Docker', 'CI/CD', 'Google Cloud', 'Linux'
      ]
    },
    {
      name: 'Idiomas',
      icon: 'bi bi-globe',
      skills: [
        'Español (Nativo)', 'Inglés (B1/B2 Técnico)'
      ]
    }
  ];

  visibleItems: boolean[] = [];
  expandedIndex: number = 0; // First item expanded by default
  showAllItems: boolean = false;

  ngOnInit() {
    this.visibleItems = new Array(this.educationItems.length).fill(true);
  }

  toggleItem(index: number) {
    if (this.expandedIndex === index) {
      this.expandedIndex = -1; // Collapse if already open
    } else {
      this.expandedIndex = index; // Expand clicked item
    }
  }

  toggleShowAll() {
    this.showAllItems = !this.showAllItems;
  }

  getVisibleItems(): Education[] {
    return this.showAllItems ? this.educationItems : this.educationItems.slice(0, 3);
  }

  getStatusClass(date: string): string {
    return date.toLowerCase().includes('actualidad') ? 'current' : 'completed';
  }

  getStatusIcon(date: string): string {
    return date.toLowerCase().includes('actualidad') ? 'bi bi-play-circle-fill' : 'bi bi-check-circle-fill';
  }

  getStatusText(date: string): string {
    return date.toLowerCase().includes('actualidad') ? 'En Curso' : 'Completado';
  }

  getEducationIcon(index: number): string {
    const icons = ['bi bi-mortarboard-fill', 'bi bi-code-slash', 'bi bi-book'];
    return icons[index] || 'bi bi-mortarboard-fill';
  }
}