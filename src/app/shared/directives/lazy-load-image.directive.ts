import { 
  Directive, 
  ElementRef, 
  Input, 
  OnInit, 
  OnDestroy,
  Renderer2,
  inject,
  PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Lazy Load Image Directive
 * 
 * Uses Intersection Observer to lazy load images when they enter the viewport.
 * Includes a blur-up effect for smooth image loading.
 * 
 * Usage:
 * ```html
 * <img appLazyLoad="/assets/img/photo.jpg" alt="Photo">
 * <img appLazyLoad="/assets/img/photo.jpg" [placeholder]="'/assets/img/placeholder.jpg'" alt="Photo">
 * ```
 */
@Directive({
  selector: '[appLazyLoad]',
  standalone: true
})
export class LazyLoadImageDirective implements OnInit, OnDestroy {
  @Input('appLazyLoad') imageSrc: string = '';
  @Input() placeholder: string = '';
  @Input() threshold: number = 0.1;
  @Input() rootMargin: string = '50px';

  private elementRef = inject(ElementRef);
  private renderer = inject(Renderer2);
  private platformId = inject(PLATFORM_ID);
  
  private observer: IntersectionObserver | null = null;
  private isLoaded = false;

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      // On server, just set the src directly
      this.setSrc(this.imageSrc);
      return;
    }

    // Set placeholder or low-quality placeholder
    if (this.placeholder) {
      this.setSrc(this.placeholder);
    } else {
      // Use a tiny transparent GIF as default placeholder
      this.setSrc('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');
    }

    // Add loading styles
    this.addLoadingStyles();

    // Create intersection observer
    this.createObserver();
  }

  ngOnDestroy(): void {
    this.disconnectObserver();
  }

  private createObserver(): void {
    if (!('IntersectionObserver' in window)) {
      // Fallback for browsers that don't support IntersectionObserver
      this.loadImage();
      return;
    }

    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: this.rootMargin,
      threshold: this.threshold
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.isLoaded) {
          this.loadImage();
          this.disconnectObserver();
        }
      });
    }, options);

    this.observer.observe(this.elementRef.nativeElement);
  }

  private loadImage(): void {
    // Preload the image
    const img = new Image();
    img.onload = () => {
      this.setSrc(this.imageSrc);
      this.removeLoadingStyles();
      this.isLoaded = true;
    };
    img.onerror = () => {
      // On error, keep placeholder or set error state
      this.renderer.addClass(this.elementRef.nativeElement, 'lazy-error');
      this.isLoaded = true;
    };
    img.src = this.imageSrc;
  }

  private setSrc(src: string): void {
    this.renderer.setAttribute(this.elementRef.nativeElement, 'src', src);
  }

  private addLoadingStyles(): void {
    const element = this.elementRef.nativeElement;
    this.renderer.addClass(element, 'lazy-loading');
    this.renderer.setStyle(element, 'filter', 'blur(10px)');
    this.renderer.setStyle(element, 'transition', 'filter 0.3s ease-out');
  }

  private removeLoadingStyles(): void {
    const element = this.elementRef.nativeElement;
    this.renderer.removeClass(element, 'lazy-loading');
    this.renderer.addClass(element, 'lazy-loaded');
    this.renderer.setStyle(element, 'filter', 'none');
  }

  private disconnectObserver(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}

/**
 * Progressive Image Loading Directive
 * 
 * Loads a low-quality image first, then the full image.
 * Perfect for hero images and featured content.
 * 
 * Usage:
 * ```html
 * <div appProgressiveImage 
 *      [lowQuality]="'/assets/img/photo-low.jpg'"
 *      [highQuality]="'/assets/img/photo.jpg'">
 * </div>
 * ```
 */
@Directive({
  selector: '[appProgressiveImage]',
  standalone: true
})
export class ProgressiveImageDirective implements OnInit, OnDestroy {
  @Input() lowQuality: string = '';
  @Input() highQuality: string = '';
  @Input() backgroundSize: string = 'cover';
  @Input() backgroundPosition: string = 'center';

  private elementRef = inject(ElementRef);
  private renderer = inject(Renderer2);
  private platformId = inject(PLATFORM_ID);
  
  private observer: IntersectionObserver | null = null;

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      this.setBackgroundImage(this.highQuality);
      return;
    }

    // Set initial styles
    this.setBaseStyles();
    
    // Load low quality first
    if (this.lowQuality) {
      this.setBackgroundImage(this.lowQuality);
      this.renderer.setStyle(this.elementRef.nativeElement, 'filter', 'blur(20px)');
    }

    // Create observer for high quality
    this.createObserver();
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private createObserver(): void {
    if (!('IntersectionObserver' in window)) {
      this.loadHighQuality();
      return;
    }

    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        this.loadHighQuality();
        this.observer?.disconnect();
      }
    }, { rootMargin: '100px' });

    this.observer.observe(this.elementRef.nativeElement);
  }

  private loadHighQuality(): void {
    const img = new Image();
    img.onload = () => {
      this.setBackgroundImage(this.highQuality);
      this.renderer.setStyle(this.elementRef.nativeElement, 'filter', 'none');
    };
    img.src = this.highQuality;
  }

  private setBackgroundImage(src: string): void {
    this.renderer.setStyle(
      this.elementRef.nativeElement, 
      'backgroundImage', 
      `url(${src})`
    );
  }

  private setBaseStyles(): void {
    const element = this.elementRef.nativeElement;
    this.renderer.setStyle(element, 'backgroundSize', this.backgroundSize);
    this.renderer.setStyle(element, 'backgroundPosition', this.backgroundPosition);
    this.renderer.setStyle(element, 'backgroundRepeat', 'no-repeat');
    this.renderer.setStyle(element, 'transition', 'filter 0.5s ease-out');
  }
}
