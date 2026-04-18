import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { environment } from '../../../environments/environment';

export interface SeoConfig {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private titleService = inject(Title);
  private meta = inject(Meta);
  private document = inject(DOCUMENT);

  private readonly defaultConfig: SeoConfig = {
    title: environment.seo.siteName,
    description: 'Full-stack developer portfolio showcasing web and mobile development projects',
    type: 'website'
  };

  updateMetaTags(config: SeoConfig): void {
    const mergedConfig = { ...this.defaultConfig, ...config };
    
    // Update title
    const fullTitle = config.title 
      ? `${config.title} | ${environment.seo.siteName}`
      : environment.seo.siteName;
    this.titleService.setTitle(fullTitle);

    // Basic meta tags
    this.updateTag('description', mergedConfig.description || '');
    
    if (mergedConfig.keywords?.length) {
      this.updateTag('keywords', mergedConfig.keywords.join(', '));
    }

    // Open Graph tags
    this.updateTag('og:title', fullTitle, 'property');
    this.updateTag('og:description', mergedConfig.description || '', 'property');
    this.updateTag('og:type', mergedConfig.type || 'website', 'property');
    this.updateTag('og:site_name', environment.seo.siteName, 'property');
    
    if (mergedConfig.url) {
      this.updateTag('og:url', mergedConfig.url, 'property');
      this.updateCanonicalUrl(mergedConfig.url);
    }

    if (mergedConfig.image) {
      const imageUrl = mergedConfig.image.startsWith('http') 
        ? mergedConfig.image 
        : `${environment.seo.siteUrl}${mergedConfig.image}`;
      this.updateTag('og:image', imageUrl, 'property');
      this.updateTag('twitter:image', imageUrl);
    }

    // Twitter Card tags
    this.updateTag('twitter:card', 'summary_large_image');
    this.updateTag('twitter:title', fullTitle);
    this.updateTag('twitter:description', mergedConfig.description || '');
    
    if (environment.seo.twitterHandle) {
      this.updateTag('twitter:site', environment.seo.twitterHandle);
      this.updateTag('twitter:creator', environment.seo.twitterHandle);
    }

    // Article specific tags
    if (mergedConfig.type === 'article') {
      if (mergedConfig.author) {
        this.updateTag('article:author', mergedConfig.author, 'property');
      }
      if (mergedConfig.publishedTime) {
        this.updateTag('article:published_time', mergedConfig.publishedTime, 'property');
      }
      if (mergedConfig.modifiedTime) {
        this.updateTag('article:modified_time', mergedConfig.modifiedTime, 'property');
      }
      if (mergedConfig.section) {
        this.updateTag('article:section', mergedConfig.section, 'property');
      }
      if (mergedConfig.tags?.length) {
        mergedConfig.tags.forEach(tag => {
          this.meta.addTag({ property: 'article:tag', content: tag });
        });
      }
    }
  }

  private updateTag(name: string, content: string, attribute: 'name' | 'property' = 'name'): void {
    const selector = attribute === 'name' ? `name="${name}"` : `property="${name}"`;
    
    if (this.meta.getTag(selector)) {
      this.meta.updateTag({ [attribute]: name, content });
    } else {
      this.meta.addTag({ [attribute]: name, content });
    }
  }

  private updateCanonicalUrl(url: string): void {
    let link: HTMLLinkElement | null = this.document.querySelector('link[rel="canonical"]');
    
    if (link) {
      link.setAttribute('href', url);
    } else {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      link.setAttribute('href', url);
      this.document.head.appendChild(link);
    }
  }

  updateForBlogPost(post: {
    title: string;
    excerpt: string;
    coverImage: string;
    author: string;
    publishedAt: Date;
    updatedAt?: Date;
    category: string;
    tags: string[];
    slug: string;
  }): void {
    this.updateMetaTags({
      title: post.title,
      description: post.excerpt,
      image: post.coverImage,
      type: 'article',
      author: post.author,
      publishedTime: post.publishedAt.toISOString(),
      modifiedTime: post.updatedAt?.toISOString(),
      section: post.category,
      tags: post.tags,
      url: `${environment.seo.siteUrl}/blog/${post.slug}`
    });
  }

  updateForProject(project: {
    title: string;
    description: string;
    image: string;
    slug: string;
  }): void {
    this.updateMetaTags({
      title: project.title,
      description: project.description,
      image: project.image,
      type: 'website',
      url: `${environment.seo.siteUrl}/portfolio/project/${project.slug}`
    });
  }

  resetToDefaults(): void {
    this.updateMetaTags(this.defaultConfig);
  }
}
