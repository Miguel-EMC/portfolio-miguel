import { Routes } from '@angular/router';

export const blogRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./blog-list/blog-list.component').then(c => c.BlogListComponent),
    title: 'Blog'
  },
  {
    path: 'category/:category',
    loadComponent: () => import('./blog-list/blog-list.component').then(c => c.BlogListComponent),
    title: 'Blog Category'
  },
  {
    path: 'tag/:tag',
    loadComponent: () => import('./blog-list/blog-list.component').then(c => c.BlogListComponent),
    title: 'Blog Tag'
  },
  {
    path: 'post/:slug',
    loadComponent: () => import('./blog-post/blog-post.component').then(c => c.BlogPostComponent),
    title: 'Blog Post'
  }
];
