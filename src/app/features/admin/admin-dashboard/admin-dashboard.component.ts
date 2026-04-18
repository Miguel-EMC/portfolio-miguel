import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { AdminAuthService } from '../../../core/services/admin-auth.service';
import { BlogService } from '../../../core/services/blog.service';
import { BlogPostMeta, BLOG_CATEGORIES } from '../../../interfaces/blog.interface';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  private authService = inject(AdminAuthService);
  private blogService = inject(BlogService);
  private destroy$ = new Subject<void>();

  posts = signal<BlogPostMeta[]>([]);
  recentPosts = signal<BlogPostMeta[]>([]);
  isLoading = signal(true);

  // Stats
  totalPosts = computed(() => this.posts().length);
  publishedPosts = computed(() => this.posts().filter(p => p.published).length);
  draftPosts = computed(() => this.posts().filter(p => !p.published).length);
  featuredPosts = computed(() => this.posts().filter(p => p.featured).length);

  categoryStats = computed(() => {
    const stats = new Map<string, number>();
    this.posts().forEach(post => {
      const count = stats.get(post.category) || 0;
      stats.set(post.category, count + 1);
    });
    return Array.from(stats.entries())
      .map(([category, count]) => ({
        category,
        count,
        info: BLOG_CATEGORIES.find(c => c.id === category)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  });

  sessionInfo = computed(() => this.authService.getSessionInfo());

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadData(): void {
    this.blogService.getAllPosts().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (posts) => {
        this.posts.set(posts);
        this.recentPosts.set(posts.slice(0, 5));
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Failed to load posts:', error);
        this.isLoading.set(false);
      }
    });
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(date));
  }

  logout(): void {
    this.authService.logout();
  }
}
