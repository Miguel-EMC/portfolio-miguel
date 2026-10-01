import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

// Data imports
import {
  upcomingProjects,
  type UpcomingProject,
} from '../../core/data/upcoming-projects.data';
import { BlogService } from '../../core/services/blog.service';
import { PortfolioService } from '../../core/services/portfolio.service';
import {
  BLOG_CATEGORIES,
  BlogCategory,
  BlogCategoryInfo,
  BlogPostMeta,
} from '../../interfaces/blog.interface';
import { PortfolioProjectMeta } from '../../interfaces/project.interface';

import { DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap, catchError, of } from 'rxjs';
import { LanguageService } from '../../shared/services/language.service';
import { SkillsComponent } from '../resume/components/skills/skills.component';
import { ProjectCardComponent } from '../../shared/components/ui/project-card/project-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  imports: [
    CommonModule,
    TranslateModule,
    RouterLink,
    ProjectCardComponent,
    SkillsComponent,
  ],
  styleUrls: ['./home.component.scss', './toast-fix.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private language = inject(LanguageService);

  private portfolioService = inject(PortfolioService);
  private blogService = inject(BlogService);

  constructor(
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
  ) {}
  currentRole = 'Software Developer';
  currentLang: 'es' | 'en' = 'es';

  // Curated featured projects from the shared content manifest.
  ownProjects: PortfolioProjectMeta[] = [];
  readonly upcomingProjects: UpcomingProject[] = upcomingProjects;

  recentPosts: BlogPostMeta[] = [];

  ngOnInit(): void {
    this.language.currentLanguage$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((lang) => {
        this.currentLang = lang === 'en' ? 'en' : 'es';
        this.currentRole = 'Software Developer';
        this.cdr.markForCheck();
      });
    this.language.currentLanguage$
      .pipe(
        switchMap(() =>
          this.portfolioService.getAllProjects().pipe(catchError(() => of([]))),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((projects) => {
        this.ownProjects = projects.filter((p) => p.featured).slice(0, 4);
        this.cdr.markForCheck();
      });
    this.language.currentLanguage$
      .pipe(
        switchMap(() =>
          this.blogService.getRecentPosts(3).pipe(catchError(() => of([]))),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((posts) => {
        this.recentPosts = posts;
        this.cdr.markForCheck();
      });
  }

  getCategoryInfo(category: BlogCategory): BlogCategoryInfo {
    return (
      BLOG_CATEGORIES.find((c) => c.id === category) ??
      BLOG_CATEGORIES[BLOG_CATEGORIES.length - 1]
    );
  }

  // Get CV URL based on current language
  getCvUrl(): string {
    const currentLang = this.translate.currentLang || 'es';
    if (currentLang === 'en') {
      return '/assets/documents/CV_MuzoMiguel_english.pdf?v=20261001';
    }
    return '/assets/documents/CV_MuzoMiguel.pdf?v=20261001';
  }
}
