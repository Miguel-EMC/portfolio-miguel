import { Routes, CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { DomainService } from './core/services/domain.service';

const domainGuard: CanActivateFn = (route, state) => {
  const domainService = inject(DomainService);
  const router = inject(Router);
  const isBlog = domainService.isBlogDomain();
  const currentPath = state.url;

  // Si estamos en el dominio del blog y tratamos de entrar a la raíz, ir a /blog
  if (isBlog && currentPath === '/') {
    router.navigate(['/blog']);
    return false;
  }
  return true;
};

export const routes: Routes = [
  {
    path: '',
    canActivate: [domainGuard],
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home.component').then(c => c.HomeComponent),
    title: 'Home'
  },
  // ... resto de rutas se mantienen igual
  {
    path: 'blog',
    loadChildren: () => import('./features/blog/blog.routes').then(m => m.blogRoutes),
    title: 'Blog',
    data: { preload: true, preloadDelay: 2000 }
  },
  // ...
];
