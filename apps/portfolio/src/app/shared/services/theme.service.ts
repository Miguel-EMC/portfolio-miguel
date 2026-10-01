import {
  Injectable,
  inject,
  PLATFORM_ID,
  signal,
  DestroyRef,
} from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
export type ThemePreference = 'system' | 'light' | 'dark';
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private document = inject(DOCUMENT);
  private browser = isPlatformBrowser(inject(PLATFORM_ID));
  private destroyRef = inject(DestroyRef);
  readonly preference = signal<ThemePreference>('system');
  private media: MediaQueryList | null = null;
  constructor() {
    if (this.browser) {
      this.media = window.matchMedia('(prefers-color-scheme: dark)');
      try {
        const value = localStorage.getItem('portfolio-theme');
        if (value === 'dark' || value === 'light') this.preference.set(value);
      } catch {}
      const listener = () => this.apply();
      this.media.addEventListener('change', listener);
      this.destroyRef.onDestroy(() =>
        this.media?.removeEventListener('change', listener),
      );
    }
    this.apply();
  }
  setPreference(value: ThemePreference): void {
    this.preference.set(value);
    if (this.browser) {
      try {
        localStorage.setItem('portfolio-theme', value);
      } catch {}
    }
    this.apply();
  }
  private apply(): void {
    const dark =
      this.preference() === 'dark' ||
      (this.preference() === 'system' && (this.media?.matches ?? true));
    this.document.documentElement.dataset['theme'] = dark ? 'dark' : 'light';
    this.document.documentElement.classList.toggle('dark-theme', dark);
    this.document.documentElement.classList.toggle('light-theme', !dark);
  }
}
