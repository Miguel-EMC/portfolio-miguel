import { Component, Inject, PLATFORM_ID, OnInit, AfterViewInit, inject, NgZone } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { NavComponent } from './shared/components/layout/nav/nav.component';
import { FooterComponent } from './shared/components/layout/footer/footer.component';
import { LoadingService } from './core/services/loading.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavComponent, FooterComponent],
  template: `
    <app-nav></app-nav>
    <router-outlet />
    <app-footer></app-footer>
  `,
  styleUrls: ['./app.component.scss'],
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
      this.translate.use('es');
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
