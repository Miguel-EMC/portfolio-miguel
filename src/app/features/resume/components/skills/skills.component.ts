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
      name: 'Frontend',
      skills: ['Angular', 'React', 'Vue.js', 'TypeScript', 'JavaScript', 'HTML/CSS']
    },
    {
      name: 'Backend',
      skills: ['Node.js', 'Python', 'Django', 'Laravel', 'Express.js', 'PHP']
    },
    {
      name: 'Bases de Datos',
      skills: ['PostgreSQL', 'MySQL', 'MongoDB', 'Firebase', 'Redis']
    },
    {
      name: 'Herramientas',
      skills: ['Docker', 'Git', 'AWS', 'Linux', 'Figma', 'Postman']
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