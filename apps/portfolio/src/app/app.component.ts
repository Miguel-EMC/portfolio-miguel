import { Component, Inject, PLATFORM_ID, OnInit, AfterViewInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { NavComponent } from './shared/components/layout/nav/nav.component';
import { FooterComponent } from './shared/components/layout/footer/footer.component';
import { BlogNavComponent } from './features/blog/components/layout/blog-nav/blog-nav.component';
import { BlogFooterComponent } from './features/blog/components/layout/blog-footer/blog-footer.component';
import { LanguageToggleComponent } from './shared/components/ui/language-toggle/language-toggle.component';
import { LoadingService } from './core/services/loading.service';
import { ThemeService } from './core/services/theme.service';
import { DomainService } from './core/services/domain.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavComponent, FooterComponent, BlogNavComponent, BlogFooterComponent, LanguageToggleComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'portfolio-personal';
  private domainService = inject(DomainService);
  isBlog = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private translate: TranslateService,
    private loadingService: LoadingService,
    private themeService: ThemeService
  ) {
    this.isBlog = this.domainService.isBlogDomain();

    if (isPlatformBrowser(this.platformId)) {
      this.translate.addLangs(['en', 'es']);
      this.translate.setDefaultLang('es');
      
      const browserLang = this.translate.getBrowserLang();
      const savedLang = localStorage.getItem('portfolio-language');
      
      if (savedLang && ['en', 'es'].includes(savedLang)) {
        this.translate.use(savedLang);
      } else if (browserLang && browserLang.match(/en|es/)) {
        this.translate.use(browserLang);
      } else {
        this.translate.use('es');
      }
    }
  }

  ngOnInit(): void {
    // Initialize translation service
  }

  ngAfterViewInit(): void {
    // Ocultar el loader inicial después de que la vista esté lista
    if (isPlatformBrowser(this.platformId)) {
      // Esperamos un poco para asegurar que todo esté cargado
      setTimeout(() => {
        this.loadingService.hideInitialLoader();
      }, 500);
    }
  }
}