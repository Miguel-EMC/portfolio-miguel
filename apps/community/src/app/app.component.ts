import { Component, Inject, PLATFORM_ID, OnInit, AfterViewInit, inject } from '@angular/core';
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
    <router-outlet />
    <app-blog-footer></app-blog-footer>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
  `]
})
export class AppComponent implements OnInit, AfterViewInit {
  private loadingService = inject(LoadingService);

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private translate: TranslateService
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.translate.addLangs(['en', 'es']);
      this.translate.setDefaultLang('es');
      this.translate.use('es');
    }
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.loadingService.hideInitialLoader();
      }, 500);
    }
  }
}
