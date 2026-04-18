import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home.component').then(c => c.HomeComponent),
    title: 'Home'
  },
  {
    path: 'about',
    loadComponent: () => import('./features/contact/about-me/about-me.component').then(c => c.AboutMeComponent),
    title: 'About Me'
  },
  {
    path: 'resume',
    loadChildren: () => import('./features/resume/resume.module').then(m => m.ResumeModule),
    title: 'Resume',
    data: { preload: true }
  },
  {
    path: 'portfolio',
    loadChildren: () => import('./features/portfolio/portfolio.module').then(m => m.PortfolioModule),
    title: 'Portfolio',
    data: { preload: true }
  },
  {
    path: 'contact',
    loadComponent: () => import('./features/contact/contacts/contacts.component').then(c => c.ContactsComponent),
    title: 'Contact'
  },
  // Blog routes
  {
    path: 'blog',
    loadChildren: () => import('./features/blog/blog.routes').then(m => m.blogRoutes),
    title: 'Blog',
    data: { preload: true, preloadDelay: 2000 }
  },
  // Admin routes
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.adminRoutes),
    title: 'Admin'
  },
  // Backward compatibility routes
  {
    path: 'sobre-mi',
    redirectTo: 'about'
  },
  {
    path: 'portafolio',
    redirectTo: 'portfolio'
  },
  {
    path: 'contacto',
    redirectTo: 'contact'
  },
  {
    path: 'about-me',
    redirectTo: 'about'
  },
  {
    path: 'contacts',
    redirectTo: 'contact'
  },
  {
    path: 'curriculum',
    redirectTo: 'resume'
  },
  {
    path: 'education',
    redirectTo: 'resume'
  },
  {
    path: 'experiencia',
    redirectTo: 'resume'
  },
  {
    path: 'educacion',
    redirectTo: 'resume'
  },
  {
    path: 'skills',
    redirectTo: 'resume'
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
