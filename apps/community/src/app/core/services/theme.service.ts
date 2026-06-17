import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'portfolio-theme';
  private themeSubject = new BehaviorSubject<Theme>('dark');
  
  public theme$ = this.themeSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.initializeTheme();
  }

  private initializeTheme(): void {
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem(this.THEME_KEY) as Theme;
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      const theme = savedTheme || (prefersDark ? 'dark' : 'light');
      this.setTheme(theme);
    }
  }

  setTheme(theme: Theme): void {
    if (isPlatformBrowser(this.platformId)) {
      // Actualizar clase en body
      document.body.classList.remove('light-theme', 'dark-theme');
      document.body.classList.add(`${theme}-theme`);
      
      // Guardar en localStorage
      localStorage.setItem(this.THEME_KEY, theme);
      
      // Actualizar subject
      this.themeSubject.next(theme);
      
      // Actualizar meta theme-color
      this.updateThemeColor(theme);
    }
  }

  toggleTheme(): void {
    const currentTheme = this.themeSubject.value;
    const newTheme: Theme = currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  getCurrentTheme(): Theme {
    return this.themeSubject.value;
  }

  isDarkTheme(): boolean {
    return this.themeSubject.value === 'dark';
  }

  private updateThemeColor(theme: Theme): void {
    if (isPlatformBrowser(this.platformId)) {
      const themeColorMeta = document.querySelector('meta[name="theme-color"]');
      const color = theme === 'dark' ? '#0f172a' : '#ffffff';
      
      if (themeColorMeta) {
        themeColorMeta.setAttribute('content', color);
      }
    }
  }
}