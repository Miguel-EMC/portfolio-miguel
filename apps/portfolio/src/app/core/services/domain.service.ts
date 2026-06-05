import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class DomainService {
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  getPortfolioUrl(): string {
    if (!this.isBrowser) return '';
    const host = window.location.host;
    if (host.includes('localhost')) {
      return 'http://localhost:4200'; // Puerto estándar del portfolio
    }
    return window.location.protocol + '//' + host.replace('blog.', '').replace('demo.', 'demo.');
  }

  getBlogUrl(): string {
    if (!this.isBrowser) return '';
    const host = window.location.host;
    if (host.includes('localhost')) {
      return 'http://localhost:44953'; // Puerto del blog
    }
    if (host.startsWith('blog.')) return window.location.protocol + '//' + host;
    return window.location.protocol + '//blog.' + host;
  }

  isBlogDomain(): boolean {
    if (!this.isBrowser) return false;
    const host = window.location.host; // includes port
    const hostname = window.location.hostname;
    
    // Detecta si es blog.migueldev11.com, blog.demo... o localhost con el puerto del blog
    return hostname.startsWith('blog.') || host.includes('localhost:44953'); 
  }

  getDomainType(): 'portfolio' | 'blog' {
    return this.isBlogDomain() ? 'blog' : 'portfolio';
  }
}
