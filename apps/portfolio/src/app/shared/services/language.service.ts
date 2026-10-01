import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { map, defer, concat, of, distinctUntilChanged } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class LanguageService {
  private translate = inject(TranslateService);
  private document = inject(DOCUMENT);
  private platformId = inject(PLATFORM_ID);
  readonly currentLanguage$ = defer(() =>
    concat(
      of(this.getCurrentLanguage()),
      this.translate.onLangChange.pipe(map((event) => event.lang)),
    ),
  ).pipe(distinctUntilChanged());
  initialize(): void {
    this.translate.addLangs(['es', 'en']);
    this.translate.setDefaultLang('es');
    let language = 'es';
    if (isPlatformBrowser(this.platformId)) {
      try {
        const saved = localStorage.getItem('portfolio-language');
        if (saved === 'es' || saved === 'en') language = saved;
      } catch {}
    }
    this.setLanguage(language);
  }
  getCurrentLanguage(): string {
    return this.translate.currentLang || this.translate.defaultLang || 'es';
  }
  setLanguage(lang: string): void {
    if (lang !== 'es' && lang !== 'en') return;
    this.document.documentElement.lang = lang;
    this.translate.use(lang);
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem('portfolio-language', lang);
      } catch {}
    }
  }
  getLanguageLabel(lang: string): string {
    return lang === 'es' ? 'Español' : 'English';
  }
  getAvailableLanguages() {
    return [
      { code: 'es', label: 'Español', flag: '' },
      { code: 'en', label: 'English', flag: '' },
    ];
  }
}
