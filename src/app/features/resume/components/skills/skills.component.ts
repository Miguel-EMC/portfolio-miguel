import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss'
})
export class SkillsComponent {
  skillCategories = [
    {
      name: 'Backend & AI Engineering',
      skills: ['Python', 'FastAPI', 'Django', 'NestJS', 'Express', 'Laravel', 'Lumen', 'Prisma']
    },
    {
      name: 'Inteligencia Artificial',
      skills: ['LangGraph', 'LangChain', 'RAG', 'AWS Bedrock', 'SQL Agents']
    },
    {
      name: 'Infrastructure & Cloud',
      skills: ['AWS Lambdas', 'S3', 'CloudWatch', 'Terraform', 'Docker', 'CI/CD', 'Google Cloud', 'Linux']
    },
    {
      name: 'Frontend & Mobile',
      skills: ['Angular', 'React', 'Flutter', 'React Native', 'Firebase']
    },
    {
      name: 'Bases de Datos',
      skills: ['PostgreSQL', 'SQL Server', 'MySQL']
    },
    {
      name: 'Lenguajes',
      skills: ['Python', 'TypeScript', 'JavaScript', 'PHP', 'Dart']
    }
  ];
  getSkillIcon(skill: string): string {
    const iconMap: { [key: string]: string } = {
      // Backend & AI
      'Python': 'bi bi-filetype-py',
      'FastAPI': 'bi bi-lightning',
      'Django': 'bi bi-file-code',
      'NestJS': 'bi bi-server',
      'Express': 'bi bi-hdd-network',
      'Laravel': 'bi bi-file-code',
      'Lumen': 'bi bi-file-code',
      'Prisma': 'bi bi-boxes',
      // AI
      'LangGraph': 'bi bi-diagram-3',
      'LangChain': 'bi bi-link-45deg',
      'RAG': 'bi bi-cpu',
      'AWS Bedrock': 'bi bi-robot',
      'SQL Agents': 'bi bi-database-gear',
      // Cloud & Infra
      'AWS Lambdas': 'bi bi-cloud',
      'S3': 'bi bi-cloud-upload',
      'CloudWatch': 'bi bi-graph-up',
      'Terraform': 'bi bi-bricks',
      'Docker': 'bi bi-box-seam',
      'CI/CD': 'bi bi-arrow-repeat',
      'Google Cloud': 'bi bi-cloud',
      'Linux': 'bi bi-terminal',
      // Frontend & Mobile
      'Angular': 'bi bi-triangle',
      'React': 'bi bi-atom',
      'Flutter': 'bi bi-phone',
      'React Native': 'bi bi-phone-landscape',
      'Firebase': 'bi bi-fire',
      // Databases
      'PostgreSQL': 'bi bi-database',
      'SQL Server': 'bi bi-database-fill',
      'MySQL': 'bi bi-database',
      // Languages
      'TypeScript': 'bi bi-filetype-ts',
      'JavaScript': 'bi bi-filetype-js',
      'PHP': 'bi bi-filetype-php',
      'Dart': 'bi bi-lightning-charge'
    };
    return iconMap[skill] || 'bi bi-code-square';
  }
}