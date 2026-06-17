export interface Education {
  id: string;
  achievements: string[];
  icon?: string;
}

export const educationItems: Education[] = [
  {
    id: 'computer-engineering',
    achievements: [
      'Énfasis en algoritmos, estructuras de datos y fundamentos matemáticos de IA',
      'Proyectos en Machine Learning y sistemas de inteligencia artificial',
      'Desarrollo de aplicaciones full-stack modernas',
      'Participación en competencias de programación'
    ],
    icon: 'bi-mortarboard'
  },
  {
    id: 'software-development',
    achievements: [
      'Graduado 2023 — base sólida en desarrollo web y backend',
      'Dominio de Angular, Django, FastAPI y APIs RESTful',
      'Diseño y optimización de bases de datos con PostgreSQL',
      'Introducción a infraestructura cloud y prácticas DevOps'
    ],
    icon: 'bi-code-slash'
  },
  {
    id: 'high-school',
    achievements: [
      'Graduado con honores en Ciencias Exactas',
      'Participación en olimpiadas de matemáticas',
      'Primer contacto con programación en Python',
      'Liderazgo estudiantil y trabajo en equipo'
    ],
    icon: 'bi-book'
  }
];