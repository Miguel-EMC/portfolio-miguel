import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  PLATFORM_ID,
  inject,
  ChangeDetectorRef,
} from '@angular/core';
import { isPlatformBrowser, NgClass } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageToggleComponent } from '../../ui/language-toggle/language-toggle.component';
import { DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ThemeToggleComponent } from '../../ui/theme-toggle.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  standalone: true,
  imports: [
    NgClass,
    TranslateModule,
    RouterModule,
    LanguageToggleComponent,
    ThemeToggleComponent,
  ],
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit, OnDestroy {
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  isMobileMenuOpen = false;
  isScrolled = false;
  activeRoute = '';

  constructor() {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.updateActiveRoute();

      // Listen to route changes
      this.router.events
        .pipe(
          filter((event) => event instanceof NavigationEnd),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe(() => {
          this.updateActiveRoute();
          this.closeMobileMenu();
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
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (
      !this.isMobileMenuOpen ||
      event.key !== 'Tab' ||
      !isPlatformBrowser(this.platformId)
    )
      return;
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>(
        '.navbar a, .navbar button, .navbar select',
      ),
    ).filter(
      (element) => element.offsetParent !== null && !element.closest('[inert]'),
    );
    const first = elements[0],
      last = elements[elements.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }
  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeMobileMenu();
  }

  @HostListener('window:resize', [])
  onWindowResize(): void {
    if (this.isMobileMenuOpen && isPlatformBrowser(this.platformId)) {
      if (window.innerWidth >= 992) {
        this.closeMobileMenu();
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

  isActive(route: string): boolean {
    return (
      this.activeRoute === route ||
      this.activeRoute === `/${route}` ||
      this.activeRoute.startsWith(route) ||
      (route === 'home' && this.activeRoute === '/')
    );
  }
}
