export interface Experience {
  id: string;
  location: string;
  tasks: string[];
}

export const experiences: Experience[] = [
  {
    id: 'fullstack-lateral',
    location: 'Quito, Ecuador',
    tasks: [
      'Desarrollo del aplicativo móvil Münster Mind con Flutter',
      'Colaboración en el desarrollo de la plataforma web Münster Mind, trabajando en frontend y backend',
      'Desarrollo de un agente de inteligencia artificial con LangGraph, LangChain y FastAPI'
    ]
  },
  {
    id: 'billusos-dev',
    location: 'Quito, Ecuador',
    tasks: [
      'Desarrollo backend en Python - Django',
      'Desarrollo web y móvil en React Native'
    ]
  },
  {
    id: 'junior-fullstack',
    location: 'Quito, Ecuador',
    tasks: [
      'Maquetación de pantallas cliente para el sistema CONAFIS SARAS',
      'Manejo de base de datos y generación de scripts para el sistema CONAFIPS SARAS',
      'Desarrollo de la plataforma CONAFIPS SARAS'
    ]
  }
];