import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  hideInitialLoader(): void {
    if (isPlatformBrowser(this.platformId)) {
      const loader = document.getElementById('initial-loader');
      if (loader) {
        // Añadir animación de fade out
        loader.style.transition = 'opacity 0.5s ease-out, visibility 0.5s ease-out';
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';
        
        // Remover el elemento después de la animación
        setTimeout(() => {
          if (loader.parentNode) {
            loader.parentNode.removeChild(loader);
          }
        }, 500);
      }
    }
  }

  showPageLoader(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Crear loader temporal para navegación entre páginas
      const existingLoader = document.getElementById('page-loader');
      if (existingLoader) return;

      const loader = document.createElement('div');
      loader.id = 'page-loader';
      loader.innerHTML = `
        <div style="
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: rgba(34, 197, 94, 0.2);
          z-index: 9999;
        ">
          <div style="
            width: 0%;
            height: 100%;
            background: linear-gradient(90deg, #22c55e, #16a34a);
            transition: width 0.3s ease;
            animation: pageLoad 1s infinite;
          "></div>
        </div>
        <style>
          @keyframes pageLoad {
            0% { width: 0%; }
            50% { width: 60%; }
            100% { width: 100%; }
          }
        </style>
      `;
      
      document.body.appendChild(loader);
    }
  }

  hidePageLoader(): void {
    if (isPlatformBrowser(this.platformId)) {
      const loader = document.getElementById('page-loader');
      if (loader) {
        setTimeout(() => {
          if (loader.parentNode) {
            loader.parentNode.removeChild(loader);
          }
        }, 300);
      }
    }
  }
}