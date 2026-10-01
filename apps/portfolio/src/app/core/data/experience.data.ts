export interface Experience {
  id: string;
  start: string;
  end: string | null;
  technologies: string[];
}
export const experiences: Experience[] = [
  {
    id: 'fullstack-lateral',
    start: '2024-06',
    end: null,
    technologies: [
      'Python',
      'NestJS',
      'AWS Lambda',
      'Step Functions',
      'Angular',
      'Flutter',
      'LLM APIs',
      'Terraform',
      'Prisma',
    ],
  },
  {
    id: 'billusos-dev',
    start: '2023-12',
    end: '2024-11',
    technologies: [
      'Python',
      'Django',
      'PostgreSQL',
      'React Native',
      'REST APIs',
    ],
  },
  {
    id: 'junior-fullstack',
    start: '2023-01',
    end: '2023-06',
    technologies: ['PHP', 'Laravel', 'Angular', 'SQL'],
  },
  {
    id: 'latin-trails',
    start: '2022-09',
    end: '2022-12',
    technologies: ['Nuxt', 'Vue', 'JavaScript'],
  },
  {
    id: 'it-ecuador',
    start: '2022-04',
    end: '2022-08',
    technologies: ['CG/Web', 'Documentation'],
  },
];
