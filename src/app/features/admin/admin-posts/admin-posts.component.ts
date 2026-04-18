import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { BlogService } from '../../../core/services/blog.service';
import { AdminAuthService } from '../../../core/services/admin-auth.service';
import { BlogPostMeta, BLOG_CATEGORIES } from '../../../interfaces/blog.interface';

@Component({
  selector: 'app-admin-posts',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-posts.component.html',
  styleUrls: ['./admin-posts.component.scss']
})
export class AdminPostsComponent implements OnInit, OnDestroy {
  private blogService = inject(BlogService);
  private authService = inject(AdminAuthService);
  private destroy$ = new Subject<void>();

  posts = signal<BlogPostMeta[]>([]);
  filteredPosts = signal<BlogPostMeta[]>([]);
  isLoading = signal(true);
  searchQuery = signal('');
  filterStatus = signal<'all' | 'published' | 'draft'>('all');

  ngOnInit(): void {
    this.loadPosts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadPosts(): void {
    this.blogService.getAllPosts().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (posts) => {
        this.posts.set(posts);
        this.applyFilters();
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Failed to load posts:', error);
        this.isLoading.set(false);
      }
    });
  }

  applyFilters(): void {
    let result = this.posts();

    // Filter by status
    if (this.filterStatus() === 'published') {
      result = result.filter(p => p.published);
    } else if (this.filterStatus() === 'draft') {
      result = result.filter(p => !p.published);
    }

    // Filter by search query
    const query = this.searchQuery().toLowerCase().trim();
    if (query) {
      result = result.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }

    this.filteredPosts.set(result);
  }

  onSearch(query: string): void {
    this.searchQuery.set(query);
    this.applyFilters();
  }

  onFilterStatus(status: 'all' | 'published' | 'draft'): void {
    this.filterStatus.set(status);
    this.applyFilters();
  }

  getCategoryInfo(categoryId: string) {
    return BLOG_CATEGORIES.find(c => c.id === categoryId);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date));
  }

  logout(): void {
    this.authService.logout();
  }
}
