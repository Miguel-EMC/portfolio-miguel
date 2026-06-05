import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Performance Monitoring Utility
 * 
 * Provides utilities for measuring and optimizing application performance.
 */
@Injectable({
  providedIn: 'root'
})
export class PerformanceService {
  private platformId = inject(PLATFORM_ID);
  private marks = new Map<string, number>();

  /**
   * Start measuring a performance mark
   */
  startMark(name: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    if (performance.mark) {
      performance.mark(`${name}-start`);
    }
    this.marks.set(name, performance.now());
  }

  /**
   * End measuring and get duration
   */
  endMark(name: string): number {
    if (!isPlatformBrowser(this.platformId)) return 0;
    
    const startTime = this.marks.get(name);
    if (!startTime) return 0;

    const duration = performance.now() - startTime;
    
    if (performance.mark && performance.measure) {
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);
    }

    this.marks.delete(name);
    return duration;
  }

  /**
   * Get Web Vitals metrics
   */
  getWebVitals(): Promise<{
    lcp: number | null;
    fid: number | null;
    cls: number | null;
    fcp: number | null;
    ttfb: number | null;
  }> {
    return new Promise((resolve) => {
      if (!isPlatformBrowser(this.platformId)) {
        resolve({ lcp: null, fid: null, cls: null, fcp: null, ttfb: null });
        return;
      }

      const metrics: any = {
        lcp: null,
        fid: null,
        cls: null,
        fcp: null,
        ttfb: null
      };

      // Get paint timing
      const paintEntries = performance.getEntriesByType('paint');
      const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
      if (fcpEntry) {
        metrics.fcp = fcpEntry.startTime;
      }

      // Get navigation timing for TTFB
      const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      if (navEntries.length > 0) {
        metrics.ttfb = navEntries[0].responseStart - navEntries[0].requestStart;
      }

      // Use PerformanceObserver for LCP, FID, CLS
      if ('PerformanceObserver' in window) {
        // LCP
        try {
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1] as any;
            metrics.lcp = lastEntry.startTime;
          });
          lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
        } catch (e) {}

        // FID
        try {
          const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const firstEntry = entries[0] as any;
            metrics.fid = firstEntry.processingStart - firstEntry.startTime;
          });
          fidObserver.observe({ type: 'first-input', buffered: true });
        } catch (e) {}

        // CLS
        try {
          let clsValue = 0;
          const clsObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries() as any[]) {
              if (!entry.hadRecentInput) {
                clsValue += entry.value;
              }
            }
            metrics.cls = clsValue;
          });
          clsObserver.observe({ type: 'layout-shift', buffered: true });
        } catch (e) {}
      }

      // Return metrics after a short delay to collect data
      setTimeout(() => resolve(metrics), 1000);
    });
  }

  /**
   * Log performance metrics to console (dev mode only)
   */
  async logPerformanceMetrics(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;

    const vitals = await this.getWebVitals();
    
    console.group('Performance Metrics');
    console.log('FCP (First Contentful Paint):', vitals.fcp?.toFixed(2), 'ms');
    console.log('LCP (Largest Contentful Paint):', vitals.lcp?.toFixed(2), 'ms');
    console.log('FID (First Input Delay):', vitals.fid?.toFixed(2), 'ms');
    console.log('CLS (Cumulative Layout Shift):', vitals.cls?.toFixed(4));
    console.log('TTFB (Time to First Byte):', vitals.ttfb?.toFixed(2), 'ms');
    console.groupEnd();
  }

  /**
   * Debounce function for performance optimization
   */
  debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    
    return (...args: Parameters<T>) => {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  /**
   * Throttle function for performance optimization
   */
  throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle = false;
    
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  /**
   * Request idle callback with fallback
   */
  requestIdleCallback(callback: () => void, options?: { timeout?: number }): void {
    if (!isPlatformBrowser(this.platformId)) {
      callback();
      return;
    }

    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(callback, options);
    } else {
      setTimeout(callback, 1);
    }
  }
}

/**
 * Memory cache for expensive computations
 */
export function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map<string, ReturnType<T>>();
  
  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    
    const result = fn(...args);
    cache.set(key, result);
    
    // Limit cache size
    if (cache.size > 100) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
    
    return result;
  }) as T;
}
