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

  isBlogDomain(): boolean {
    if (!this.isBrowser) return false;
    const hostname = window.location.hostname;
    // Detecta si es blog.migueldev11.com o localhost con puerto específico si lo deseas
    return hostname.includes('blog.') || hostname.includes('localhost:44953'); 
  }

  getDomainType(): 'portfolio' | 'blog' {
    return this.isBlogDomain() ? 'blog' : 'portfolio';
  }
}
