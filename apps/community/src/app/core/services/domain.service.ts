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
    if (!this.isBrowser) return 'https://migueldev11.com';
    const host = window.location.host;
    if (host.includes('localhost')) {
      return 'http://localhost:4200';
    }
    return window.location.protocol + '//' + host.replace('blog.', '').replace('demo.', 'demo.');
  }

  getBlogUrl(): string {
    if (!this.isBrowser) return 'https://blog.migueldev11.com';
    const host = window.location.host;
    const protocol = window.location.protocol;
    
    if (host.includes('localhost')) {
      return `${protocol}//${host}/blog`; 
    }
    
    if (host.startsWith('blog.')) return `${protocol}//${host}`;
    return `${protocol}//blog.${host}`;
  }

  isBlogDomain(): boolean {
    if (!this.isBrowser) return false;
    const hostname = window.location.hostname;
    
    // En internet, el dominio empieza por blog.
    if (hostname.startsWith('blog.')) return true;
    
    // En local (localhost), el modo blog se activa si la ruta actual contiene /blog
    if (hostname === 'localhost') {
      return window.location.pathname.startsWith('/blog');
    }
    
    return false;
  }

  getDomainType(): 'portfolio' | 'blog' {
    return this.isBlogDomain() ? 'blog' : 'portfolio';
  }
}
