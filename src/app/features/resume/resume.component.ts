import { Component, AfterViewInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { EducationComponent } from './components/education/education.component';
import { CurriculumComponent } from './components/curriculum/curriculum.component';
import { SkillsComponent } from './components/skills/skills.component';
import { LottieAnimationComponent } from '../../shared/components/ui/lottie-animation/lottie-animation.component';

@Component({
  selector: 'app-resume',
  standalone: true,
  imports: [
    CommonModule,
    EducationComponent,
    CurriculumComponent,
    SkillsComponent,
    LottieAnimationComponent

  ],
  template: `
    <section class="resume-section">
      <div class="container">
        <div class="resume-layout">
          <!-- Sticky Sidebar -->
          <aside class="resume-sidebar">
            <div class="sidebar-content">
              <div class="sidebar-animation">
                <app-lottie-animation
                  src="assets/jsons/tech startup.json"
                  width="100%"
                  height="180px">
                </app-lottie-animation>
              </div>
              <h2 class="sidebar-title">Resume</h2>
              <nav class="resume-nav">
                <button class="nav-link" 
                        [class.active]="activeSection === 'experience'"
                        (click)="scrollToSection('experience')">
                  <i class="bi bi-briefcase"></i>
                  <span>Experiencia</span>
                </button>
                <button class="nav-link" 
                        [class.active]="activeSection === 'education'"
                        (click)="scrollToSection('education')">
                  <i class="bi bi-mortarboard"></i>
                  <span>Educación</span>
                </button>
                <button class="nav-link" 
                        [class.active]="activeSection === 'skills'"
                        (click)="scrollToSection('skills')">
                  <i class="bi bi-tools"></i>
                  <span>Habilidades</span>
                </button>
              </nav>
            </div>
          </aside>

          <!-- Scrollable Content -->
          <div class="resume-content">
            <!-- Header for mobile/intro -->
            <div class="section-header">
              <h2 class="section-title">Mi Trayectoria</h2>
              <p class="section-subtitle">Un recorrido por mi carrera profesional y académica</p>
            </div>

            <div id="experience" class="resume-section-content">
              <h3 class="content-title">Experiencia Profesional</h3>
              <app-curriculum></app-curriculum>
            </div>
            
            <div id="education" class="resume-section-content">
              <h3 class="content-title">Educación</h3>
              <app-education></app-education>
            </div>
            
            <div id="skills" class="resume-section-content">
              <h3 class="content-title">Habilidades Técnicas</h3>
              <app-skills></app-skills>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styleUrls: ['./resume.component.scss']
})
export class ResumeComponent implements AfterViewInit, OnDestroy {
  activeSection: string = 'experience';
  private observer: IntersectionObserver | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

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
        behavior: 'smooth'
      });

      // Update active section immediately for better UX
      this.activeSection = sectionId;
    }
  }

  private setupIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: '-20% 0px -60% 0px', // Trigger when section is near top
      threshold: 0
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.activeSection = entry.target.id;
        }
      });
    }, options);

    const sections = document.querySelectorAll('.resume-section-content');
    sections.forEach(section => {
      this.observer?.observe(section);
    });
  }
}