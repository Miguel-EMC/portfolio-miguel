export interface TechSkill {
  name: string;
  mastery: number;
}

export interface SkillArea {
  id: string;
  emoji: string;
  color: string;
  technologies: string[];
  detailedTechs: TechSkill[];
}

export const skillAreas: SkillArea[] = [
  {
    id: 'backend',
    emoji: '⚙️',
    color: '#4ECDC4',
    technologies: ['Python', 'FastAPI', 'Django', 'Node.js', 'NestJS', 'Express', 'Laravel', 'Lumen', 'Prisma'],
    detailedTechs: [
      { name: 'FastAPI', mastery: 8 },
      { name: 'Django', mastery: 7.5 },
      { name: 'NestJS', mastery: 7.5 },
      { name: 'Laravel', mastery: 6.5 },
      { name: 'Lumen', mastery: 6 },
      { name: 'Express', mastery: 6 },
      { name: 'Prisma', mastery: 7 }
    ]
  },
  {
    id: 'ai',
    emoji: '🤖',
    color: '#9B59B6',
    technologies: ['LangGraph', 'LangChain', 'RAG', 'AWS Bedrock', 'SQL Agents', 'Text-to-SQL'],
    detailedTechs: [
      { name: 'LangGraph', mastery: 8 },
      { name: 'LangChain', mastery: 7.5 },
      { name: 'AWS Bedrock', mastery: 7 },
      { name: 'RAG', mastery: 7 },
      { name: 'SQL Agents', mastery: 7.5 }
    ]
  },
  {
    id: 'devops',
    emoji: '☁️',
    color: '#74B9FF',
    technologies: ['AWS Lambdas', 'S3', 'CloudWatch', 'Terraform', 'Docker', 'CI/CD', 'Google Cloud', 'Linux'],
    detailedTechs: [
      { name: 'AWS Lambdas', mastery: 7 },
      { name: 'S3', mastery: 7 },
      { name: 'CloudWatch', mastery: 6 },
      { name: 'Terraform', mastery: 6.5 },
      { name: 'Docker', mastery: 7 },
      { name: 'CI/CD', mastery: 7 },
      { name: 'Linux', mastery: 8 },
      { name: 'Google Cloud', mastery: 5 }
    ]
  },
  {
    id: 'frontend',
    emoji: '🎨',
    color: '#A29BFE',
    technologies: ['Angular', 'React', 'TypeScript', 'JavaScript', 'HTML5/CSS3'],
    detailedTechs: [
      { name: 'Angular', mastery: 7.5 },
      { name: 'React', mastery: 6.5 },
      { name: 'TypeScript', mastery: 8 },
      { name: 'JavaScript', mastery: 8 },
      { name: 'HTML5/CSS3', mastery: 7 }
    ]
  },
  {
    id: 'mobile',
    emoji: '📱',
    color: '#45B7D1',
    technologies: ['Flutter', 'React Native', 'Firebase', 'Android', 'iOS'],
    detailedTechs: [
      { name: 'Flutter', mastery: 7.5 },
      { name: 'React Native', mastery: 5 },
      { name: 'Firebase', mastery: 6.5 }
    ]
  },
  {
    id: 'databases',
    emoji: '🗄️',
    color: '#836c42ff',
    technologies: ['PostgreSQL', 'SQL Server', 'MySQL', 'Modelado de datos'],
    detailedTechs: [
      { name: 'PostgreSQL', mastery: 8 },
      { name: 'SQL Server', mastery: 6.5 },
      { name: 'MySQL', mastery: 7 },
      { name: 'Modelado de datos', mastery: 7 }
    ]
  },
  {
    id: 'languages',
    emoji: '💻',
    color: '#1ad1ffff',
    technologies: ['Python', 'TypeScript', 'JavaScript', 'PHP', 'Dart'],
    detailedTechs: [
      { name: 'Python', mastery: 8.5 },
      { name: 'TypeScript', mastery: 8 },
      { name: 'JavaScript', mastery: 8 },
      { name: 'PHP', mastery: 6.5 },
      { name: 'Dart', mastery: 6.5 }
    ]
  }
];