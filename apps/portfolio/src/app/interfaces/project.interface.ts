export interface Project {
  id: number;
  slug: string;
  title: string;
  description: string;
  longDescription?: string;
  images: string[];
  frameworks: string[];
  githubUrl?: string;
  liveUrl?: string;
  type: 'personal' | 'professional';
  featured?: boolean;
  completedAt?: Date;
  client?: string;
  role?: string;
  challenges?: string[];
  solutions?: string[];
  results?: string[];
}

/** Metadata loaded from the portfolio manifest (no body content). */
export interface PortfolioProjectMeta {
  id: string;
  slug: string;
  lang: string;
  title: string;
  description: string;
  type: 'personal' | 'professional';
  frameworks: string[];
  images: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
  completedAt?: string;
  client?: string;
  role?: string;
}

/** Full project including rendered HTML body (challenges / solutions / results). */
export interface PortfolioProject extends PortfolioProjectMeta {
  content: string;
}

export interface PortfolioManifest {
  projects: PortfolioProjectMeta[];
  lastUpdated: string;
}

export interface Tool {
  name: string;
  iconUrl: string;
}

export interface ProjectFilter {
  type?: 'all' | 'personal' | 'professional';
  framework?: string;
  featured?: boolean;
}
