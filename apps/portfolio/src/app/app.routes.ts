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
  // Redirección al dominio del blog para el enlace de Blog
  {
    path: 'blog',
    redirectTo: 'home' // El componente Nav se encargará de la navegación externa
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
