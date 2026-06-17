import { Component, OnInit, OnDestroy, HostListener, Inject, PLATFORM_ID, inject, NgZone, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser, NgClass } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeService } from "../../../../core/services/theme.service";
import { LanguageToggleComponent } from "../../ui/language-toggle/language-toggle.component";
import { ThemeToggleComponent } from "../../ui/theme-toggle/theme-toggle.component";
import { filter } from 'rxjs/operators';
import { DomainService } from '../../../../core/services/domain.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  standalone: true,
  imports: [NgClass, TranslateModule, RouterModule, LanguageToggleComponent, ThemeToggleComponent],
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit, OnDestroy {
  private ngZone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);
  private themeService = inject(ThemeService);
  private router = inject(Router);
  private domainService = inject(DomainService);
  private platformId = inject(PLATFORM_ID);

  isMobileMenuOpen = false;
  isScrolled = false;
  activeRoute = '';

  constructor() { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.updateActiveRoute();

      // Listen to route changes
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(() => {
        this.updateActiveRoute();
      });
    }
  }

  ngOnDestroy(): void {
    if (this.isMobileMenuOpen && isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = '';
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isScrolled = window.pageYOffset > 50;
      this.updateActiveSection();
    }
  }

  @HostListener('window:resize', [])
  onWindowResize(): void {
    if (this.isMobileMenuOpen && isPlatformBrowser(this.platformId)) {
      if (window.innerWidth >= 992) {
        this.closeMobileMenu();
      }
    }
  }

  navigateToBlog(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.location.href = this.domainService.getBlogUrl();
    }
  }

  get theme() {
    return this.themeService.getCurrentTheme();
  }

  /**
   * Maneja la navegación en el portfolio.
   * Si es una sección interna (home markers), hace scroll.
   * Si es una ruta real, navega.
   */
  navigateToRoute(route: string): void {
    const isHomeRoute = this.router.url === '/' || this.router.url === '/home' || this.router.url.startsWith('/home#');
    
    // Lista de IDs que son secciones en el HOME
    const homeSections = ['home', 'resume', 'portafolio', 'contacto'];

    if (homeSections.includes(route)) {
      if (isHomeRoute) {
        this.scrollToSection(route);
      } else {
        this.router.navigate(['/home']).then(() => {
          // Esperar a que la página cargue para hacer scroll
          setTimeout(() => this.scrollToSection(route), 100);
        });
      }
    } else {
      // Es una ruta real (ej: /resume si se quiere ir a la página completa)
      this.router.navigate([route]);
    }

    if (this.isMobileMenuOpen) {
      this.closeMobileMenu();
    }
  }

  scrollToSection(sectionId: string): void {
    if (isPlatformBrowser(this.platformId)) {
      const element = document.getElementById(sectionId);
      if (element) {
        const offset = 90;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // IMPORTANTE: Actualizar el estado dentro de la zona de Angular
        this.ngZone.run(() => {
          this.activeRoute = `/${sectionId}`;
          this.cdr.detectChanges();
        });
      }
    }
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = this.isMobileMenuOpen ? 'hidden' : '';
    }
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = '';
    }
  }

  private updateActiveRoute(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.activeRoute = this.router.url;
    this.cdr.detectChanges();
  }

  private updateActiveSection(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.router.url !== '/' && !this.router.url.startsWith('/home')) return;

    const sections = [
      { id: 'home', route: '/home' },
      { id: 'resume', route: '/resume' },
      { id: 'portafolio', route: '/portfolio' },
      { id: 'contacto', route: '/contact' }
    ];

    const scrollPosition = window.pageYOffset + 200;

    for (const section of sections) {
      const element = document.getElementById(section.id);
      if (element) {
        const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
        const elementHeight = element.offsetHeight;

        if (scrollPosition >= elementTop && scrollPosition < elementTop + elementHeight) {
          if (this.activeRoute !== section.route) {
            this.ngZone.run(() => {
              this.activeRoute = section.route;
              this.cdr.detectChanges();
            });
          }
          break;
        }
      }
    }
  }

  isActive(route: string): boolean {
    return this.activeRoute === route || this.activeRoute === `/${route}` || (route === 'home' && this.activeRoute === '/');
  }
}
