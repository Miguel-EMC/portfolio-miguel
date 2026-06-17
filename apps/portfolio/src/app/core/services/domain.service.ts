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
      // Usar el puerto detectado para el portfolio si ya estamos en él, 
      // de lo contrario usar el puerto conocido de esta sesión.
      return 'http://localhost:34209';
    }
    
    return window.location.protocol + '//' + host.replace('blog.', '').replace('demo.', 'demo.');
  }

  getBlogUrl(): string {
    if (!this.isBrowser) return 'https://blog.migueldev11.com';
    const host = window.location.host;
    const protocol = window.location.protocol;
    
    if (host.includes('localhost')) {
      return `http://localhost:43565`;
    }
    
    if (host.startsWith('blog.')) return `${protocol}//${host}`;
    return `${protocol}//blog.${host}`;
  }

  isBlogDomain(): boolean {
    if (!this.isBrowser) return false;
    const hostname = window.location.hostname;
    const port = window.location.port;
    
    if (hostname.startsWith('blog.')) return true;
    
    if (hostname === 'localhost') {
      return port === '43565' || window.location.pathname.startsWith('/blog');
    }
    
    return false;
  }

  getDomainType(): 'portfolio' | 'blog' {
    return this.isBlogDomain() ? 'blog' : 'portfolio';
  }
}
