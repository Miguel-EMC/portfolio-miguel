import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './language-toggle.component.html',
  styleUrl: './language-toggle.component.scss'
})
export class LanguageToggleComponent implements OnInit {
  currentLanguage = 'es';
  isDropdownOpen = false;
  availableLanguages: Array<{code: string, label: string, flag: string}> = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'es', label: 'Español', flag: '🇪🇸' }
  ];

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    this.currentLanguage = this.translate.currentLang || this.translate.defaultLang;
    this.translate.onLangChange.subscribe(event => {
      this.currentLanguage = event.lang;
    });
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  onLanguageChange(langCode: string): void {
    if (langCode !== this.currentLanguage) {
      this.translate.use(langCode);
      localStorage.setItem('portfolio-language', langCode);
    }
    this.isDropdownOpen = false; // Close dropdown after selection
  }

  getCurrentLanguageFlag(): string {
    const currentLang = this.availableLanguages.find(lang => lang.code === this.currentLanguage);
    return currentLang?.flag || '🇪🇸';
  }
}
