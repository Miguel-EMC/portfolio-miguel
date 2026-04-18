import { Routes } from '@angular/router';
import { adminAuthGuard, adminLoginGuard } from '../../core/guards/admin-auth.guard';

export const adminRoutes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./admin-login/admin-login.component').then(c => c.AdminLoginComponent),
    canActivate: [adminLoginGuard],
    title: 'Admin Login'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./admin-dashboard/admin-dashboard.component').then(c => c.AdminDashboardComponent),
    canActivate: [adminAuthGuard],
    title: 'Admin Dashboard'
  },
  {
    path: 'posts',
    loadComponent: () => import('./admin-posts/admin-posts.component').then(c => c.AdminPostsComponent),
    canActivate: [adminAuthGuard],
    title: 'Manage Posts'
  },
  {
    path: 'posts/new',
    loadComponent: () => import('./admin-editor/admin-editor.component').then(c => c.AdminEditorComponent),
    canActivate: [adminAuthGuard],
    title: 'New Post'
  },
  {
    path: 'posts/edit/:slug',
    loadComponent: () => import('./admin-editor/admin-editor.component').then(c => c.AdminEditorComponent),
    canActivate: [adminAuthGuard],
    title: 'Edit Post'
  }
];
