import { Component, inject, DestroyRef, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NavComponent } from './shared/components/layout/nav/nav.component';
import { FooterComponent } from './shared/components/layout/footer/footer.component';
import { LanguageService } from './shared/services/language.service';
import { combineLatest, filter, startWith } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SeoService } from './core/services/seo.service';
import { environment } from '../environments/environment';
import { ThemeService } from './shared/services/theme.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavComponent, FooterComponent, TranslateModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  private router = inject(Router);
  private seo = inject(SeoService);
  private destroyRef = inject(DestroyRef);
  private language = inject(LanguageService);
  private theme = inject(ThemeService);
  ngOnInit(): void {
    combineLatest([
      this.router.events.pipe(
        filter((event) => event instanceof NavigationEnd),
        startWith(null),
      ),
      this.language.currentLanguage$,
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const path = this.router.url.split(/[?#]/)[0];
        if (path.startsWith('/blog') || path.startsWith('/portfolio/project/'))
          return;
        const es = this.language.getCurrentLanguage() === 'es';
        const titles: Record<string, string> = {
          '/': es ? 'Inicio' : 'Home',
          '/home': es ? 'Inicio' : 'Home',
          '/resume': es ? 'Trayectoria' : 'Background',
          '/portfolio': es ? 'Proyectos' : 'Projects',
          '/contact': es ? 'Contacto' : 'Contact',
          '/about': es ? 'Sobre mí' : 'About me',
        };
        this.seo.updateMetaTags({
          title: titles[path] || 'EMCode',
          description: es
            ? 'Miguel Muzo, desarrollador de software. APIs, Python, NestJS, AWS, Angular e integraciones con modelos de lenguaje.'
            : 'Miguel Muzo, software developer. APIs, Python, NestJS, AWS, Angular and language model integrations.',
          url: environment.seo.siteUrl + path,
          image: environment.seo.defaultImage,
          type: 'website',
        });
      });
  }
  constructor() {
    this.language.initialize();
  }
}
