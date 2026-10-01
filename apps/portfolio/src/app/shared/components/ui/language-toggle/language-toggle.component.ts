import { Component, DestroyRef, Inject, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-language-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './language-toggle.component.html',
  styleUrl: './language-toggle.component.scss'
})
export class LanguageToggleComponent implements OnInit {
  currentLanguage = 'es';
  private destroyRef = inject(DestroyRef);
  constructor(private translate: TranslateService, @Inject(PLATFORM_ID) private platformId: Object) {}
  ngOnInit(): void {
    this.currentLanguage = this.translate.currentLang || this.translate.defaultLang || 'es';
    this.translate.onLangChange.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(event => {
      this.currentLanguage = event.lang;
    });
  }
  onLanguageChange(langCode: string): void {
    if (!['es', 'en'].includes(langCode) || langCode === this.currentLanguage) return;
    this.translate.use(langCode);
    if (isPlatformBrowser(this.platformId)) {
      try { localStorage.setItem('portfolio-language', langCode); } catch { /* Language still switches when storage is unavailable. */ }
    }
  }
}
