import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'blog',
    pathMatch: 'full'
  },
  {
    path: 'blog',
    loadChildren: () => import('./features/blog/blog.routes').then(m => m.blogRoutes),
    title: 'MiguelDev Community'
  },
  {
    path: 'auth/login',
    loadComponent: () => import('./features/auth/login.component').then(m => m.CommunityLoginComponent),
    title: 'Entrar | Community'
  },
  {
    path: 'auth/signup',
    loadComponent: () => import('./features/auth/signup.component').then(m => m.CommunitySignupComponent),
    title: 'Unirse | Community'
  },
  {
    path: '**',
    redirectTo: 'blog'
  }
];
