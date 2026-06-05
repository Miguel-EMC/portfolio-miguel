import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of, timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

/**
 * Selective Preloading Strategy
 * 
 * This strategy provides intelligent preloading based on route data:
 * - Routes marked with `preload: true` are preloaded immediately
 * - Routes marked with `preloadDelay: number` are preloaded after a delay
 * - Routes not marked are not preloaded
 * 
 * Usage in routes:
 * ```typescript
 * {
 *   path: 'portfolio',
 *   loadChildren: () => import('./portfolio/portfolio.module'),
 *   data: { preload: true }
 * },
 * {
 *   path: 'blog',
 *   loadChildren: () => import('./blog/blog.routes'),
 *   data: { preload: true, preloadDelay: 2000 }
 * }
 * ```
 */
import { Injectable, inject, PLATFORM_ID, NgZone } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of, timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SelectivePreloadStrategy implements PreloadingStrategy {
  private platformId = inject(PLATFORM_ID);
  private ngZone = inject(NgZone);

  preload(route: Route, load: () => Observable<any>): Observable<any> {
    // Only preload in the browser and if enabled
    if (!isPlatformBrowser(this.platformId) || !environment.features.enablePreloading) {
      return of(null);
    }

    // Check if route has preload data
    if (!route.data?.['preload']) {
      return of(null);
    }

    // Get delay if specified
    const delay = route.data?.['preloadDelay'] || 0;

    if (delay > 0) {
      // Run timer outside of Angular to prevent SSR/Hydration issues
      return new Observable(observer => {
        this.ngZone.runOutsideAngular(() => {
          setTimeout(() => {
            this.ngZone.run(() => {
              console.log(`[Preload] Loading module: ${route.path} (after ${delay}ms delay)`);
              load().subscribe({
                next: val => observer.next(val),
                complete: () => observer.complete(),
                error: err => observer.error(err)
              });
            });
          }, delay);
        });
      });
    }

    // Immediate preloading
    console.log(`[Preload] Loading module: ${route.path}`);
    return load();
  }
}

/**
 * Network-Aware Preloading Strategy
 * 
 * Preloads routes based on network conditions:
 * - Only preloads on fast connections (4g, wifi)
 * - Respects data saver mode
 */
@Injectable({
  providedIn: 'root'
})
export class NetworkAwarePreloadStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    // Check if preloading is enabled
    if (!environment.features.enablePreloading) {
      return of(null);
    }

    // Check network conditions
    const connection = (navigator as any).connection;
    
    if (connection) {
      // Don't preload if user has enabled data saver
      if (connection.saveData) {
        return of(null);
      }

      // Only preload on fast connections
      const effectiveType = connection.effectiveType;
      if (effectiveType === 'slow-2g' || effectiveType === '2g') {
        return of(null);
      }
    }

    // Check if route should be preloaded
    if (!route.data?.['preload']) {
      return of(null);
    }

    const delay = route.data?.['preloadDelay'] || 0;
    
    if (delay > 0) {
      return timer(delay).pipe(
        mergeMap(() => load())
      );
    }

    return load();
  }
}
