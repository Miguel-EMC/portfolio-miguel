import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeService } from '../../../../../core/services/theme.service';

import { DomainService } from '../../../../../core/services/domain.service';

@Component({
  selector: 'app-blog-nav',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, TranslateModule],
  templateUrl: './blog-nav.component.html',
  styleUrls: ['./blog-nav.component.scss']
})
export class BlogNavComponent {
  themeService = inject(ThemeService);
  private domainService = inject(DomainService);
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  navigateToPortfolio() {
    window.location.href = this.domainService.getPortfolioUrl();
  }
}
