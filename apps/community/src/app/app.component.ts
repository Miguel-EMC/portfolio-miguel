import { Component, Inject, PLATFORM_ID, OnInit, AfterViewInit, inject, NgZone } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { BlogNavComponent } from './features/blog/components/layout/blog-nav/blog-nav.component';
import { BlogFooterComponent } from './features/blog/components/layout/blog-footer/blog-footer.component';
import { LoadingService } from './core/services/loading.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BlogNavComponent, BlogFooterComponent],
  template: `
    <app-blog-nav></app-blog-nav>
    <main class="community-main">
      <router-outlet />
    </main>
    <app-blog-footer></app-blog-footer>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    .community-main {
      flex: 1;
      padding-top: 70px; /* Navbar height */
    }
  `]
})
export class AppComponent implements OnInit, AfterViewInit {
  private loadingService = inject(LoadingService);
  private ngZone = inject(NgZone);

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private translate: TranslateService
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.translate.addLangs(['en', 'es']);
      this.translate.setDefaultLang('es');
      const savedLanguage = localStorage.getItem('portfolio-language');
      const browserLanguage = navigator.language?.startsWith('en') ? 'en' : 'es';
      this.translate.use(savedLanguage || browserLanguage);
    }
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.ngZone.runOutsideAngular(() => {
        setTimeout(() => {
          this.loadingService.hideInitialLoader();
        }, 500);
      });
    }
  }
}
