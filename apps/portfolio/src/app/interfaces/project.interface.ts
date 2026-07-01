export type LocalizedText = { es: string; en: string };
export type LocalizedList = { es: string[]; en: string[] };

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

export interface PortfolioProject {
  id: string;
  slug: string;
  type: 'personal' | 'professional';
  platform?: 'web' | 'mobile';
  frameworks: string[];
  images: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
  completedAt?: string;
  client?: string;
  role?: string;
  // Bilingual text — present when loaded from projects.json
  title?: LocalizedText;
  description?: LocalizedText;
  longDescription?: LocalizedText;
  challenges?: LocalizedList;
  solutions?: LocalizedList;
  results?: LocalizedList;
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
