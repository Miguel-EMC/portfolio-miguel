import { PortfolioProject } from '../../interfaces/project.interface';

export type { PortfolioProject };

export const portfolioProjects: PortfolioProject[] = [
  // Personal Projects
  {
    id: 'sinapsekEducation',
    slug: 'synapsek-education-platform',
    type: 'personal',
    frameworks: ['Django', 'React', 'PostgreSQL', 'Docker'],
    images: [
      '/assets/img/sinapsekEducation.png',
      'https://images.pexels.com/photos/3184293/pexels-photo-3184293.jpeg'
    ],
    liveUrl: 'https://import-synapsek-plat-5b7i.bolt.host/',
    featured: true,
    completedAt: '2024-06-15',
    role: 'Full Stack Developer',
    challenges: [
      'Building a scalable learning management system',
      'Implementing real-time collaboration features',
      'Creating an intuitive user experience for students and teachers'
    ],
    solutions: [
      'Used Django Channels for WebSocket support',
      'Implemented Redis caching for improved performance',
      'Created a modular React component architecture'
    ],
    results: [
      'Reduced page load times by 60%',
      'Achieved 99.9% uptime',
      'Supported 500+ concurrent users'
    ]
  },
  
  // Professional Projects
  {
    id: 'asobanca',
    slug: 'asobanca-risk-platform',
    type: 'professional',
    frameworks: ['Laravel', 'Angular', 'PostgreSQL'],
    images: [
      '/assets/img/asobancaPlataforma.png',
      'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg'
    ],
    liveUrl: 'https://plataformariesgos.app/',
    featured: true,
    completedAt: '2024-03-20',
    client: 'ASOBANCA',
    role: 'Lead Developer',
    challenges: [
      'Handling complex financial risk calculations',
      'Ensuring data security and compliance',
      'Building a multi-tenant architecture'
    ],
    solutions: [
      'Implemented robust authentication with 2FA',
      'Created efficient database indexing strategies',
      'Built a comprehensive API with rate limiting'
    ],
    results: [
      'Processed 1M+ risk assessments monthly',
      'Reduced manual processing time by 80%',
      'Zero security incidents since launch'
    ]
  },
  {
    id: 'munsterMind',
    slug: 'munster-mind-mobile-app',
    type: 'professional',
    frameworks: ['Flutter', 'PostgreSQL', 'NestJS'],
    images: [
      '/assets/img/munstermain.png',
      'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg'
    ],
    liveUrl: 'https://play.google.com/store/apps/details?id=io.munstermind.dev&pcampaignid=web_share',
    featured: true,
    completedAt: '2024-01-10',
    client: 'MunsterMind',
    role: 'Mobile Developer',
    challenges: [
      'Creating smooth animations for mental health exercises',
      'Implementing offline-first functionality',
      'Building secure user data storage'
    ],
    solutions: [
      'Used Flutter animations for engaging UX',
      'Implemented SQLite for local data persistence',
      'End-to-end encryption for sensitive data'
    ],
    results: [
      '4.8 star rating on Google Play',
      '10,000+ downloads in first month',
      '85% user retention rate'
    ]
  },
  {
    id: 'conafis',
    slug: 'conafis-saras-system',
    type: 'professional',
    frameworks: ['Laravel', 'Angular', 'PostgreSQL'],
    images: [
      '/assets/img/conafis.png',
      'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg'
    ],
    liveUrl: 'https://saras.finanzaspopulares.gob.ec/View/SARAS/index.php',
    featured: false,
    completedAt: '2023-11-05',
    client: 'CONAFIPS',
    role: 'Backend Developer',
    challenges: [
      'Integrating with legacy government systems',
      'Meeting strict regulatory requirements',
      'Handling large-scale data processing'
    ],
    solutions: [
      'Created API adapters for legacy integration',
      'Implemented comprehensive audit logging',
      'Used queue systems for background processing'
    ],
    results: [
      'Successfully integrated with 5 government systems',
      'Passed all compliance audits',
      'Processed 500K+ transactions monthly'
    ]
  },
  {
    id: 'billusos',
    slug: 'billusos-fintech-platform',
    type: 'professional',
    frameworks: ['Django', 'PostgreSQL', 'Docker', 'React Native'],
    images: [
      '/assets/img/billusos.png',
      'https://images.pexels.com/photos/3184632/pexels-photo-3184632.jpeg'
    ],
    liveUrl: 'https://ecuador.billusos.com/#',
    featured: false,
    completedAt: '2023-08-22',
    client: 'Billusos',
    role: 'Full Stack Developer',
    challenges: [
      'Building a secure payment processing system',
      'Creating cross-platform mobile applications',
      'Implementing real-time transaction tracking'
    ],
    solutions: [
      'Integrated PCI-compliant payment gateways',
      'Used React Native for iOS and Android apps',
      'Implemented WebSocket for real-time updates'
    ],
    results: [
      'Processed $2M+ in transactions',
      'Achieved PCI DSS compliance',
      'Reduced transaction errors by 95%'
    ]
  }
];

// Helper function to find project by slug
export function findProjectBySlug(slug: string): PortfolioProject | undefined {
  return portfolioProjects.find(p => p.slug === slug);
}

// Helper function to get related projects
export function getRelatedProjects(currentSlug: string, limit: number = 3): PortfolioProject[] {
  const current = findProjectBySlug(currentSlug);
  if (!current) return [];
  
  return portfolioProjects
    .filter(p => p.slug !== currentSlug)
    .filter(p => p.type === current.type || 
                 p.frameworks.some(f => current.frameworks.includes(f)))
    .slice(0, limit);
}

// Helper function to get featured projects
export function getFeaturedProjects(): PortfolioProject[] {
  return portfolioProjects.filter(p => p.featured);
}
