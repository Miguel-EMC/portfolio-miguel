import {
  Component,
  HostListener,
  Inject,
  PLATFORM_ID,
  ElementRef,
} from '@angular/core';
import { isPlatformBrowser, NgClass } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [TranslateModule, NgClass, RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  readonly year = new Date().getFullYear();
  showScrollButton = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private element: ElementRef<HTMLElement>,
  ) {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (isPlatformBrowser(this.platformId)) {
      const footer = this.element.nativeElement.querySelector('footer');
      this.showScrollButton =
        window.scrollY > 300 &&
        (!footer || footer.getBoundingClientRect().top >= window.innerHeight);
    }
  }

  scrollToTop(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({
        top: 0,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'auto'
          : 'smooth',
      });
    }
  }
}
