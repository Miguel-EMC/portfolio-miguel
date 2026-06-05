export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: Date;
  updatedAt?: Date;
  category: BlogCategory;
  tags: string[];
  coverImage: string;
  readingTime: number;
  featured: boolean;
  published: boolean;
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  publishedAt: Date;
  updatedAt?: Date;
  category: BlogCategory;
  tags: string[];
  coverImage: string;
  readingTime: number;
  featured: boolean;
  published: boolean;
}

export type BlogCategory = 
  | 'technology'
  | 'programming'
  | 'web-development'
  | 'mobile-development'
  | 'devops'
  | 'career'
  | 'tutorials'
  | 'general';

export interface BlogCategoryInfo {
  id: BlogCategory;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export const BLOG_CATEGORIES: BlogCategoryInfo[] = [
  {
    id: 'technology',
    name: 'Technology',
    description: 'Latest tech trends and innovations',
    icon: 'bi-cpu',
    color: '#3B82F6'
  },
  {
    id: 'programming',
    name: 'Programming',
    description: 'Coding tips, patterns, and best practices',
    icon: 'bi-code-slash',
    color: '#10B981'
  },
  {
    id: 'web-development',
    name: 'Web Development',
    description: 'Frontend and backend web technologies',
    icon: 'bi-globe',
    color: '#8B5CF6'
  },
  {
    id: 'mobile-development',
    name: 'Mobile Development',
    description: 'iOS, Android, and cross-platform development',
    icon: 'bi-phone',
    color: '#F59E0B'
  },
  {
    id: 'devops',
    name: 'DevOps',
    description: 'CI/CD, containers, and infrastructure',
    icon: 'bi-gear',
    color: '#EF4444'
  },
  {
    id: 'career',
    name: 'Career',
    description: 'Professional growth and career advice',
    icon: 'bi-briefcase',
    color: '#EC4899'
  },
  {
    id: 'tutorials',
    name: 'Tutorials',
    description: 'Step-by-step guides and how-tos',
    icon: 'bi-book',
    color: '#06B6D4'
  },
  {
    id: 'general',
    name: 'General',
    description: 'Thoughts and miscellaneous topics',
    icon: 'bi-chat-dots',
    color: '#6B7280'
  }
];

export interface BlogManifest {
  posts: BlogPostMeta[];
  categories: BlogCategory[];
  lastUpdated: string;
}
