export interface Project {
  id: string;
  image: string;
  tech: string[];
  liveUrl?: string;
  githubUrl?: string;
  type?: string;
}

export const featuredProjects: Project[] = [
  {
    id: 'asobanca',
    image: '/assets/img/asobancaPlataforma.png',
    tech: ['Laravel', 'Angular', 'PostgreSQL'],
    liveUrl: 'https://plataformariesgos.app/',
    githubUrl: undefined,
    type: 'web'
  },
  {
    id: 'munsterMind',
    image: '/assets/img/munstermain.png',
    tech: ['Flutter', 'PostgreSQL', 'NestJS'],
    liveUrl: 'https://play.google.com/store/apps/details?id=io.munstermind.dev&pcampaignid=web_share',
    githubUrl: undefined,
    type: 'mobile'
  },
  {
    id: 'conafis',
    image: '/assets/img/conafis.png',
    tech: ['Laravel', 'Angular', 'PostgreSQL'],
    liveUrl: 'https://saras.finanzaspopulares.gob.ec/View/SARAS/index.php',
    githubUrl: undefined,
    type: 'web'
  },
  {
    id: 'sinapsekEducation',
    image: '/assets/img/sinapsekEducation.png',
    tech: ['Django', 'React', 'PostgreSQL'],
    liveUrl: 'https://import-synapsek-plat-5b7i.bolt.host/',
    githubUrl: undefined,
    type: 'web'
  },
  {
    id: 'billusos',
    image: '/assets/img/billusos.png',
    tech: ['Django', 'React', 'PostgreSQL'],
    liveUrl: undefined,
    githubUrl: undefined,
    type: 'web'
  },
  {
    id: 'ecommerce',
    image: '/assets/img/ecommerce.png',
    tech: ['React', 'Next.js', 'Stripe'],
    liveUrl: undefined,
    githubUrl: undefined,
    type: 'web'
  }
];