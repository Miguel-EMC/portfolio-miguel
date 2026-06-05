import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil, switchMap } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

import { BlogService } from '../../../core/services/blog.service';
import { SeoService } from '../../../core/services/seo.service';
import { BlogPost, BlogPostMeta, BLOG_CATEGORIES } from '../../../interfaces/blog.interface';

@Component({
  selector: 'app-blog-post',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './blog-post.component.html',
  styleUrls: ['./blog-post.component.scss']
})
export class BlogPostComponent implements OnInit, OnDestroy {
  private blogService = inject(BlogService);
  private seoService = inject(SeoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  post = signal<BlogPost | null>(null);
  relatedPosts = signal<BlogPostMeta[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.route.paramMap.pipe(
      takeUntil(this.destroy$),
      switchMap(params => {
        const slug = params.get('slug');
        if (!slug) {
          this.error.set('Post not found');
          this.isLoading.set(false);
          return [];
        }
        this.isLoading.set(true);
        return this.blogService.getPostBySlug(slug);
      })
    ).subscribe({
      next: (post) => {
        if (post) {
          this.post.set(post);
          this.updateSeo(post);
          this.loadRelatedPosts(post.slug);
        } else {
          this.error.set('Post not found');
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load post:', err);
        this.error.set('Failed to load post');
        this.isLoading.set(false);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadRelatedPosts(currentSlug: string): void {
    this.blogService.getRelatedPosts(currentSlug, 3).pipe(
      takeUntil(this.destroy$)
    ).subscribe(posts => this.relatedPosts.set(posts));
  }

  private updateSeo(post: BlogPost): void {
    this.seoService.updateForBlogPost({
      title: post.title,
      excerpt: post.excerpt,
      coverImage: post.coverImage,
      author: post.author,
      publishedAt: post.publishedAt,
      updatedAt: post.updatedAt,
      category: post.category,
      tags: post.tags,
      slug: post.slug
    });
  }

  getCategoryInfo(categoryId: string) {
    return BLOG_CATEGORIES.find(c => c.id === categoryId);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  }

  shareOnTwitter(): void {
    const post = this.post();
    if (!post) return;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank');
  }

  shareOnLinkedIn(): void {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank');
  }

  copyLink(): void {
    navigator.clipboard.writeText(window.location.href).then(() => {
      // Could show a toast notification here
      alert('Link copied to clipboard!');
    });
  }

  goBack(): void {
    this.router.navigate(['/blog']);
  }
}
