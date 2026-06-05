import { Component, OnInit, OnDestroy, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, NgClass } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeService } from "../../../../core/services/theme.service";
import { LanguageToggleComponent } from "../../ui/language-toggle/language-toggle.component";
import { ThemeToggleComponent } from "../../ui/theme-toggle/theme-toggle.component";
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  standalone: true,
  imports: [NgClass, TranslateModule, RouterModule, LanguageToggleComponent, ThemeToggleComponent],
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit, OnDestroy {
  isMobileMenuOpen = false;
  isScrolled = false;
  activeRoute = '/about';

  constructor(
    private themeService: ThemeService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

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
    // Cleanup body overflow if mobile menu is open
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
      if (window.innerWidth >= 769) {
        this.closeMobileMenu();
      }
    }
  }

  @HostListener('document:keydown.escape', [])
  onEscapeKey(): void {
    if (this.isMobileMenuOpen) {
      this.closeMobileMenu();
    }
  }

  get theme() {
    return this.themeService.getCurrentTheme();
  }

  navigateToRoute(route: string): void {
    // Si estamos en la página principal (home), hacer scroll a la sección
    if (this.router.url === '/' || this.router.url === '/home') {
      this.scrollToSection(route);
    } else {
      // Si estamos en otra página, navegar a home y luego hacer scroll
      this.router.navigate(['/home']).then(() => {
        setTimeout(() => this.scrollToSection(route), 300);
      });
    }

    // Cerrar menú móvil si está abierto
    if (this.isMobileMenuOpen) {
      this.closeMobileMenu();
    }
  }

  scrollToSection(sectionId: string): void {
    if (isPlatformBrowser(this.platformId)) {
      const section = document.getElementById(sectionId);
      if (section) {
        const offset = 100;
        const elementPosition = section.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Actualizar la ruta activa visualmente
        this.activeRoute = `/${sectionId}`;
      }
    }
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;

    if (isPlatformBrowser(this.platformId)) {
      // Prevent body scroll when mobile menu is open
      if (this.isMobileMenuOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
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
  }

  private updateActiveSection(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Solo actualizar secciones si estamos en la página home
    if (this.router.url !== '/' && this.router.url !== '/home') return;

    const sections = [
      { id: 'home', route: '/home' },
      { id: 'resume', route: '/resume' },
      { id: 'portafolio', route: '/portfolio' },
      { id: 'contacto', route: '/contact' }
    ];

    const scrollPosition = window.pageYOffset + 150; // Offset para mejor detección

    let activeSection = '/home'; // Por defecto

    // Encontrar qué sección está visible
    for (const section of sections) {
      const element = document.getElementById(section.id);
      if (element) {
        const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
        const elementHeight = element.offsetHeight;

        if (scrollPosition >= elementTop && scrollPosition < elementTop + elementHeight) {
          activeSection = section.route;
          break;
        }
      }
    }

    // Actualizar activeRoute solo si cambió
    if (this.activeRoute !== activeSection) {
      this.activeRoute = activeSection;
    }
  }

  isActive(route: string): boolean {
    return this.activeRoute === route || this.activeRoute === `/${route}`;
  }
}