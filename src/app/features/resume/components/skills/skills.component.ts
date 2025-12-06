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
      name: 'Backend & Core',
      skills: ['Python', 'Django', 'NestJS', 'Node.js', 'PostgreSQL']
    },
    {
      name: 'Frontend',
      skills: ['Angular', 'TypeScript', 'Tailwind CSS']
    },
    {
      name: 'AI & Emerging',
      skills: ['LangChain', 'RAG', 'LLMs Integration']
    },
    {
      name: 'Tools',
      skills: ['Docker', 'Git', 'Linux', 'AWS']
    }
  ];
  getSkillIcon(skill: string): string {
    const iconMap: { [key: string]: string } = {
      'Angular': 'bi bi-filetype-html', // Placeholder, ideally use specific brand icons if available or generic code
      'React': 'bi bi-filetype-jsx',
      'Vue.js': 'bi bi-file-earmark-code',
      'TypeScript': 'bi bi-filetype-ts',
      'JavaScript': 'bi bi-filetype-js',
      'HTML/CSS': 'bi bi-filetype-html',
      'Node.js': 'bi bi-server',
      'Python': 'bi bi-filetype-py',
      'Django': 'bi bi-file-code',
      'Laravel': 'bi bi-file-code',
      'Express.js': 'bi bi-hdd-network',
      'PHP': 'bi bi-filetype-php',
      'PostgreSQL': 'bi bi-database',
      'MySQL': 'bi bi-database',
      'MongoDB': 'bi bi-database',
      'Firebase': 'bi bi-fire',
      'Redis': 'bi bi-layers',
      'Docker': 'bi bi-box-seam',
      'Git': 'bi bi-git',
      'AWS': 'bi bi-cloud',
      'Linux': 'bi bi-terminal',
      'Figma': 'bi bi-palette',
      'Postman': 'bi bi-send'
    };
    return iconMap[skill] || 'bi bi-code-square';
  }
}