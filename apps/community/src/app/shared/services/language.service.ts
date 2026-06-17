import { Injectable, Inject, LOCALE_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLanguageSubject = new BehaviorSubject<string>('en');
  public currentLanguage$ = this.currentLanguageSubject.asObservable();

  constructor(@Inject(LOCALE_ID) private localeId: string) {
    this.initializeLanguage();
  }

  private initializeLanguage(): void {
    // Get current locale from Angular
    const currentLocale = this.localeId || 'en';
    this.currentLanguageSubject.next(currentLocale);
  }

  private detectBrowserLanguage(): string {
    const browserLang = navigator.language || navigator.languages[0];
    
    if (browserLang.startsWith('es')) {
      return 'es';
    }
    
    return 'en';
  }

  private isValidLanguage(lang: string): boolean {
    return ['en', 'es'].includes(lang);
  }

  getCurrentLanguage(): string {
    return this.currentLanguageSubject.value;
  }

  setLanguage(lang: string): void {
    if (this.isValidLanguage(lang)) {
      localStorage.setItem('portfolio-language', lang);
      
      // For Angular i18n, we need to redirect to the appropriate locale URL
      const currentUrl = window.location.pathname;
      let newUrl = '';
      
      if (lang === 'es') {
        newUrl = '/es' + currentUrl.replace(/^\/(es|en)?/, '');
      } else {
        newUrl = currentUrl.replace(/^\/es/, '');
      }
      
      window.location.href = newUrl || '/';
    }
  }

  getLanguageLabel(lang: string): string {
    const labels: { [key: string]: string } = {
      'en': 'English',
      'es': 'Español'
    };
    return labels[lang] || lang;
  }

  getAvailableLanguages(): Array<{code: string, label: string, flag: string}> {
    return [
      { code: 'en', label: 'English', flag: '🇺🇸' },
      { code: 'es', label: 'Español', flag: '🇪🇸' }
    ];
  }

  // Check if browser language should be used on first visit
  static shouldSetBrowserLanguage(): string | null {
    const savedLanguage = localStorage.getItem('portfolio-language');
    
    if (savedLanguage) {
      return savedLanguage;
    }
    
    const browserLang = navigator.language || navigator.languages[0];
    const detectedLang = browserLang.startsWith('es') ? 'es' : 'en';
    
    localStorage.setItem('portfolio-language', detectedLang);
    return detectedLang;
  }
}