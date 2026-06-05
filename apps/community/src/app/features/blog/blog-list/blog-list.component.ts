import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

import { BlogService } from '../../../core/services/blog.service';
import { SeoService } from '../../../core/services/seo.service';
import { BlogPostMeta, BlogCategory, BLOG_CATEGORIES, BlogCategoryInfo } from '../../../interfaces/blog.interface';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, TranslateModule],
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss']
})
export class BlogListComponent implements OnInit, OnDestroy {
  private blogService = inject(BlogService);
  private seoService = inject(SeoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroy$ = new Subject<void>();
  
  // State signals
  posts = signal<BlogPostMeta[]>([]);
  filteredPosts = signal<BlogPostMeta[]>([]);
  categories = signal<BlogCategoryInfo[]>(BLOG_CATEGORIES);
  tags = signal<string[]>([]);
  isLoading = signal(true);
  searchQuery = signal('');
  activeCategory = signal<BlogCategory | null>(null);
  activeTag = signal<string | null>(null);
  
  // Pagination
  currentPage = signal(1);
  postsPerPage = environment.blog.postsPerPage;
  
  // Computed values
  paginatedPosts = computed(() => {
    const start = (this.currentPage() - 1) * this.postsPerPage;
    return this.filteredPosts().slice(start, start + this.postsPerPage);
  });
  
  totalPages = computed(() => 
    Math.ceil(this.filteredPosts().length / this.postsPerPage)
  );

  featuredPosts = computed(() => 
    this.posts().filter(p => p.featured).slice(0, 3)
  );

  private searchSubject = new Subject<string>();

  ngOnInit(): void {
    this.setupSearch();
    this.loadPosts();
    this.handleRouteParams();
    this.updateSeo();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSearch(): void {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(query => {
      this.searchQuery.set(query);
      this.filterPosts();
      this.currentPage.set(1);
    });
  }

  private handleRouteParams(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const category = params.get('category') as BlogCategory | null;
      const tag = params.get('tag');
      
      if (category) {
        this.activeCategory.set(category);
        this.activeTag.set(null);
      } else if (tag) {
        this.activeTag.set(tag);
        this.activeCategory.set(null);
      } else {
        this.activeCategory.set(null);
        this.activeTag.set(null);
      }
      
      this.filterPosts();
    });
  }

  private loadPosts(): void {
    this.isLoading.set(true);
    
    this.blogService.getAllPosts().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (posts) => {
        this.posts.set(posts);
        this.filterPosts();
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Failed to load posts:', error);
        this.isLoading.set(false);
      }
    });

    this.blogService.getAllTags().pipe(
      takeUntil(this.destroy$)
    ).subscribe(tags => this.tags.set(tags));
  }

  filterPosts(): void {
    let result = this.posts();
    
    // Filter by category
    if (this.activeCategory()) {
      result = result.filter(p => p.category === this.activeCategory());
    }
    
    // Filter by tag
    if (this.activeTag()) {
      result = result.filter(p => 
        p.tags.some(t => t.toLowerCase() === this.activeTag()?.toLowerCase())
      );
    }
    
    // Filter by search query
    const query = this.searchQuery().toLowerCase().trim();
    if (query) {
      result = result.filter(p => 
        p.title.toLowerCase().includes(query) ||
        p.excerpt.toLowerCase().includes(query) ||
        p.tags.some(t => t.toLowerCase().includes(query))
      );
    }
    
    this.filteredPosts.set(result);
  }

  onSearch(query: string): void {
    this.searchSubject.next(query);
  }

  setCategory(category: BlogCategory | null): void {
    if (category) {
      this.router.navigate(['/blog/category', category]);
    } else {
      this.router.navigate(['/blog']);
    }
  }

  setTag(tag: string | null): void {
    if (tag) {
      this.router.navigate(['/blog/tag', tag]);
    } else {
      this.router.navigate(['/blog']);
    }
  }

  clearFilters(): void {
    this.searchQuery.set('');
    this.router.navigate(['/blog']);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  getCategoryInfo(categoryId: BlogCategory): BlogCategoryInfo | undefined {
    return this.blogService.getCategoryInfo(categoryId);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  }

  private updateSeo(): void {
    const category = this.activeCategory();
    const tag = this.activeTag();
    
    let title = 'Blog';
    let description = 'Explore articles about web development, mobile apps, and technology';
    
    if (category) {
      const categoryInfo = this.getCategoryInfo(category);
      title = `${categoryInfo?.name || category} Articles`;
      description = categoryInfo?.description || description;
    } else if (tag) {
      title = `Articles tagged "${tag}"`;
      description = `Browse all articles about ${tag}`;
    }
    
    this.seoService.updateMetaTags({
      title,
      description,
      type: 'website'
    });
  }
}
