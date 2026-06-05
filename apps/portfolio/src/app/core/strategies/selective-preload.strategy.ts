import { Injectable, inject, PLATFORM_ID, NgZone } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * Selective Preloading Strategy
 * 
 * Provides intelligent preloading based on route data:
 * - Routes with `data: { preload: true }` are preloaded.
 * - Supports `preloadDelay: number` for delayed preloading.
 */
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

    const delay = route.data?.['preloadDelay'] || 0;

    if (delay > 0) {
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

    console.log(`[Preload] Loading module: ${route.path}`);
    return load();
  }
}
