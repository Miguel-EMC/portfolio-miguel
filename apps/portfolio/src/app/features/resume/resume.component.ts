import {
  Component,
  AfterViewInit,
  OnDestroy,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { EducationComponent } from './components/education/education.component';
import { CurriculumComponent } from './components/curriculum/curriculum.component';
import { SkillsComponent } from './components/skills/skills.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { inject } from '@angular/core';

@Component({
  selector: 'app-resume',
  standalone: true,
  imports: [
    CommonModule,
    EducationComponent,
    CurriculumComponent,
    SkillsComponent,
    TranslateModule,
  ],
  template: `
    <section class="resume-section">
      <div class="container">
        <header class="section-header">
          <span class="section-eyebrow">{{
            'ui.careerEyebrow' | translate
          }}</span>
          <h1 class="section-title">{{ 'ui.careerTitle' | translate }}</h1>
          <p class="section-subtitle">{{ 'ui.careerIntro' | translate }}</p>
          <a [href]="cvUrl" class="btn-secondary" download
            ><i class="bi bi-download"></i>
            {{ 'home.hero.actions.downloadCV' | translate }}</a
          >
        </header>
        <div class="resume-layout">
          <aside class="resume-sidebar">
            <nav
              class="resume-nav"
              [attr.aria-label]="'ui.careerNavigation' | translate"
            >
              <button
                type="button"
                [class.active]="activeSection === 'experience'"
                [attr.aria-current]="
                  activeSection === 'experience' ? 'location' : null
                "
                (click)="scrollToSection('experience')"
              >
                {{ 'ui.experience' | translate }}
              </button>
              <button
                type="button"
                [class.active]="activeSection === 'skills'"
                [attr.aria-current]="
                  activeSection === 'skills' ? 'location' : null
                "
                (click)="scrollToSection('skills')"
              >
                {{ 'ui.skillTitle' | translate }}
              </button>
              <button
                type="button"
                [class.active]="activeSection === 'education'"
                [attr.aria-current]="
                  activeSection === 'education' ? 'location' : null
                "
                (click)="scrollToSection('education')"
              >
                {{ 'ui.education' | translate }}
              </button>
            </nav>
          </aside>
          <div class="resume-content">
            <section id="experience" class="resume-section-content">
              <h2 class="content-title">{{ 'ui.experience' | translate }}</h2>
              <p class="content-intro">{{ 'ui.experienceNote' | translate }}</p>
              <app-curriculum />
            </section>
            <section id="skills" class="resume-section-content">
              <h2 class="content-title">{{ 'ui.skillTitle' | translate }}</h2>
              <app-skills />
            </section>
            <section id="education" class="resume-section-content">
              <h2 class="content-title">{{ 'ui.education' | translate }}</h2>
              <app-education />
            </section>
          </div>
        </div>
      </div>
    </section>
  `,
  styleUrls: ['./resume.component.scss'],
})
export class ResumeComponent implements AfterViewInit, OnDestroy {
  private translate = inject(TranslateService);
  get cvUrl(): string {
    return (
      '/assets/documents/' +
      (this.translate.currentLang === 'en'
        ? 'CV_MuzoMiguel_english.pdf'
        : 'CV_MuzoMiguel.pdf') +
      '?v=20261001'
    );
  }
  activeSection: string = 'experience';
  private observer: IntersectionObserver | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.setupIntersectionObserver();
    }
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  scrollToSection(sectionId: string) {
    if (!isPlatformBrowser(this.platformId)) return;

    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100; // Adjust for header height
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'auto'
          : 'smooth',
      });

      // Update active section immediately for better UX
      this.activeSection = sectionId;
    }
  }

  private setupIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: '-20% 0px -60% 0px', // Trigger when section is near top
      threshold: 0,
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.activeSection = entry.target.id;
        }
      });
    }, options);

    const sections = document.querySelectorAll('.resume-section-content');
    sections.forEach((section) => {
      this.observer?.observe(section);
    });
  }
}
