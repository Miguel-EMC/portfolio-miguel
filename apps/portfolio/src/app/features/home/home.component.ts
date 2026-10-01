import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, PLATFORM_ID, inject, NgZone } from '@angular/core';
import { RouterLink } from "@angular/router";
import { TranslateModule, TranslateService } from '@ngx-translate/core';

// Data imports
import { upcomingProjects, type UpcomingProject } from '../../core/data/upcoming-projects.data';
import { BlogService } from '../../core/services/blog.service';
import { PortfolioService } from '../../core/services/portfolio.service';
import { BLOG_CATEGORIES, BlogCategory, BlogCategoryInfo, BlogPostMeta } from '../../interfaces/blog.interface';
import { PortfolioProjectMeta } from '../../interfaces/project.interface';

import { ProjectCardComponent } from '../../shared/components/ui/project-card/project-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  imports: [
    CommonModule,
    TranslateModule,
    RouterLink,
    ProjectCardComponent
  ],
  styleUrls: ['./home.component.scss', './toast-fix.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0 }))
      ])
    ]),
    trigger('slideInScale', [
      transition(':enter', [
        style({
          transform: 'scale(0.7) translateY(-50px)',
          opacity: 0
        }),
        animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)',
          style({
            transform: 'scale(1) translateY(0)',
            opacity: 1
          })
        )
      ]),
      transition(':leave', [
        animate('300ms ease-in',
          style({
            transform: 'scale(0.8) translateY(20px)',
            opacity: 0
          })
        )
      ])
    ])
  ]
})
export class HomeComponent implements OnInit, OnDestroy {
  private ngZone = inject(NgZone);

  private portfolioService = inject(PortfolioService);
  private blogService = inject(BlogService);

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService
  ) { }

  // Typing animation
  currentRole = '';
  isTyping = false;
  private typingInterval: any;
  private roles: string[] = ['Backend Developer'];
  private currentRoleIndex = 0;

  currentLang: 'es' | 'en' = 'es';

  // Own projects (featured + coming-soon), loaded from the portfolio service.
  // Client work stays on /portfolio only — no longer duplicated as a home section.
  ownProjects: PortfolioProjectMeta[] = [];
  readonly upcomingProjects: UpcomingProject[] = upcomingProjects;

  recentPosts: BlogPostMeta[] = [];

  ngOnInit() {
    // Track current language
    this.currentLang = (this.translate.currentLang || this.translate.defaultLang || 'es') as 'es' | 'en';
    this.loadRoles();
    this.translate.onLangChange.subscribe(event => {
      this.currentLang = (event.lang || 'es') as 'es' | 'en';
      this.loadRoles();
      this.cdr.markForCheck();
    });

    this.portfolioService.getAllProjects().subscribe((projects: PortfolioProjectMeta[]) => {
      this.ownProjects = projects.filter(p => p.type === 'personal');
      this.cdr.markForCheck();
    });

    this.blogService.getRecentPosts(3).subscribe((posts: BlogPostMeta[]) => {
      this.recentPosts = posts;
      this.cdr.markForCheck();
    });

    if (isPlatformBrowser(this.platformId)) {
      this.startTypingAnimation();
      // Configurar scroll suave
      document.documentElement.style.scrollBehavior = 'smooth';
    }
  }

  ngOnDestroy() {
    if (this.typingInterval) {
      clearInterval(this.typingInterval);
    }
  }

  private loadRoles(): void {
    const roles = this.translate.instant('home.hero.roles');
    if (Array.isArray(roles) && roles.length > 0) {
      this.roles = roles;
      this.currentRoleIndex = 0;
    }
  }

  private startTypingAnimation(): void {
    this.typeText(this.roles[this.currentRoleIndex]);
  }

  private typeText(text: string): void {
    this.currentRole = '';
    this.isTyping = true;
    let charIndex = 0;

    const typeChar = () => {
      if (charIndex < text.length) {
        this.currentRole += text.charAt(charIndex);
        charIndex++;
        this.cdr.detectChanges();
        this.ngZone.runOutsideAngular(() => setTimeout(typeChar, 100));
      } else {
        this.isTyping = false;
        this.cdr.detectChanges();
        this.ngZone.runOutsideAngular(() => {
          setTimeout(() => {
            this.eraseText();
          }, 2000);
        });
      }
    };

    this.ngZone.runOutsideAngular(() => typeChar());
  }

  private eraseText(): void {
    this.isTyping = true;
    const eraseChar = () => {
      if (this.currentRole.length > 0) {
        this.currentRole = this.currentRole.slice(0, -1);
        this.cdr.detectChanges();
        this.ngZone.runOutsideAngular(() => setTimeout(eraseChar, 50));
      } else {
        this.currentRoleIndex = (this.currentRoleIndex + 1) % this.roles.length;
        this.ngZone.runOutsideAngular(() => {
          setTimeout(() => {
            this.typeText(this.roles[this.currentRoleIndex]);
          }, 500);
        });
      }
    };

    this.ngZone.runOutsideAngular(() => eraseChar());
  }

  getCategoryInfo(category: BlogCategory): BlogCategoryInfo {
    return BLOG_CATEGORIES.find(c => c.id === category) ?? BLOG_CATEGORIES[BLOG_CATEGORIES.length - 1];
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
