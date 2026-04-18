import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { marked } from 'marked';

import { BlogService } from '../../../core/services/blog.service';
import { BlogPost, BlogCategory, BLOG_CATEGORIES } from '../../../interfaces/blog.interface';

interface PostForm {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: BlogCategory;
  tags: string;
  coverImage: string;
  author: string;
  featured: boolean;
  published: boolean;
}

@Component({
  selector: 'app-admin-editor',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-editor.component.html',
  styleUrls: ['./admin-editor.component.scss']
})
export class AdminEditorComponent implements OnInit, OnDestroy {
  private blogService = inject(BlogService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  isEditMode = signal(false);
  isLoading = signal(false);
  isSaving = signal(false);
  showPreview = signal(false);
  previewContent = signal('');
  categories = BLOG_CATEGORIES;

  form = signal<PostForm>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'general',
    tags: '',
    coverImage: '',
    author: 'Miguel',
    featured: false,
    published: false
  });

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.isEditMode.set(true);
      this.loadPost(slug);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadPost(slug: string): void {
    this.isLoading.set(true);
    this.blogService.getPostBySlug(slug).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (post) => {
        if (post) {
          this.form.set({
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            content: this.extractMarkdownContent(post.content),
            category: post.category,
            tags: post.tags.join(', '),
            coverImage: post.coverImage,
            author: post.author,
            featured: post.featured,
            published: post.published
          });
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Failed to load post:', error);
        this.isLoading.set(false);
      }
    });
  }

  private extractMarkdownContent(htmlContent: string): string {
    // This is a simplified extraction - in a real app, you'd store the original markdown
    return htmlContent
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .trim();
  }

  generateSlug(): void {
    const currentForm = this.form();
    const slug = currentForm.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    this.form.set({ ...currentForm, slug });
  }

  updateField(field: keyof PostForm, value: any): void {
    this.form.set({ ...this.form(), [field]: value });
  }

  togglePreview(): void {
    if (!this.showPreview()) {
      const content = marked.parse(this.form().content) as string;
      this.previewContent.set(content);
    }
    this.showPreview.set(!this.showPreview());
  }

  generateMarkdownFile(): string {
    const form = this.form();
    const frontmatter = `---
title: "${form.title}"
slug: "${form.slug}"
excerpt: "${form.excerpt}"
author: "${form.author}"
publishedAt: "${new Date().toISOString()}"
category: "${form.category}"
tags: [${form.tags.split(',').map(t => `"${t.trim()}"`).join(', ')}]
coverImage: "${form.coverImage}"
featured: ${form.featured}
published: ${form.published}
---

${form.content}`;

    return frontmatter;
  }

  savePost(): void {
    this.isSaving.set(true);
    
    // Generate the markdown content
    const markdown = this.generateMarkdownFile();
    
    // In a real app, this would save to a backend or GitHub
    // For now, we'll download the file
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.form().slug}.md`;
    a.click();
    URL.revokeObjectURL(url);
    
    setTimeout(() => {
      this.isSaving.set(false);
      alert('Post markdown file downloaded! Add it to assets/blog/posts/ folder.');
    }, 500);
  }

  cancel(): void {
    this.router.navigate(['/admin/posts']);
  }
}
