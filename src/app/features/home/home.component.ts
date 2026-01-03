import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import { ToastrService } from 'ngx-toastr';

// Data imports
import { educationItems, type Education } from '../../core/data/education.data';
import { experiences, type Experience } from '../../core/data/experience.data';
import { featuredProjects, type Project } from '../../core/data/projects.data';
import { skillAreas, type SkillArea } from '../../core/data/skills.data';

import { LottieAnimationComponent } from '../../shared/components/ui/lottie-animation/lottie-animation.component';
import { AboutMeComponent } from '../contact/about-me/about-me.component';
import { ContactsComponent } from '../contact/contacts/contacts.component';
import { PortafolioComponent } from "../portfolio/portfolio/portafolio.component";
import { CurriculumComponent } from '../resume/components/curriculum/curriculum.component';
import { EducationComponent } from '../resume/components/education/education.component';
import { SkillsComponent } from '../resume/components/skills/skills.component';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    RouterLink,
    AboutMeComponent,
    SkillsComponent,
    EducationComponent,
    CurriculumComponent,
    PortafolioComponent,
    ContactsComponent,
    LottieAnimationComponent,
    LottieComponent
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
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {

  // Lottie Animation Options
  options: AnimationOptions = {
    path: '/assets/jsons/Artificial Intelligence Chatbot.json',
  };

  contactOptions: AnimationOptions = {
    path: '/assets/jsons/tech startup.json',
  };

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private toastr: ToastrService
  ) { }

  // Función helper para forzar estilos del toast
  private forceToastStyles() {
    setTimeout(() => {
      const container = document.querySelector('.toast-container') as HTMLElement;
      const toastElement = document.querySelector('.ngx-toastr') as HTMLElement;

      if (toastElement) {
        // Forzar estilos del contenedor
        if (container) {
          container.style.cssText = `
            position: fixed !important;
            top: 20px !important;
            right: 20px !important;
            z-index: 999999 !important;
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
          `;
        }

        // Determinar el color según el tipo de toast
        let bgGradient = 'linear-gradient(135deg, #10b981 0%, #059669 100%)'; // success por defecto
        if (toastElement.classList.contains('toast-error')) {
          bgGradient = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
        } else if (toastElement.classList.contains('toast-info')) {
          bgGradient = 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
        } else if (toastElement.classList.contains('toast-warning')) {
          bgGradient = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
        }

        // Forzar estilos del toast
        toastElement.style.cssText = `
          position: relative !important;
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
          width: 350px !important;
          min-height: 80px !important;
          padding: 20px !important;
          margin-bottom: 15px !important;
          background: ${bgGradient} !important;
          color: white !important;
          border-radius: 12px !important;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3) !important;
          font-family: Inter, sans-serif !important;
          font-size: 14px !important;
          line-height: 1.5 !important;
          pointer-events: auto !important;
          transform: translateX(0) !important;
        `;
      }
    }, 100);
  }

  // Typing animation
  currentRole = '';
  isTyping = false;
  private typingInterval: any;
  private roles = [
    'Backend Developer'
  ];
  private currentRoleIndex = 0;
  activeCard = 'code';

  // Top skills for about section
  topSkills = ['Angular', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL'];

  // Main technologies for compact view with details
  mainTechs = [
    { name: 'Angular', level: 'Experto', years: '3+' },
    { name: 'TypeScript', level: 'Experto', years: '3+' },
    { name: 'Node.js', level: 'Avanzado', years: '2+' },
    { name: 'Python', level: 'Avanzado', years: '2+' },
    { name: 'PostgreSQL', level: 'Avanzado', years: '2+' },
    { name: 'Docker', level: 'Intermedio', years: '1+' }
  ];

  // Use skillAreas from data file instead of duplicating

  // Featured projects for compact portfolio
  featuredProjects: Project[] = featuredProjects;

  // Detailed data for tabs
  educationItems: Education[] = educationItems;

  experiences: Experience[] = experiences;


  // Skill Areas Dashboard
  skillAreas: SkillArea[] = skillAreas;

  // Tab management
  activeTab = 'skills';

  // Area selection management
  selectedArea: number | null = null;

  // Scroll Spy
  activeSection: string = 'experience';
  private observer: IntersectionObserver | null = null;

  ngOnInit() {
    this.startTypingAnimation();
    this.initializeActiveCard();

    if (isPlatformBrowser(this.platformId)) {
      // Configurar scroll suave
      document.documentElement.style.scrollBehavior = 'smooth';
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.initializeCharts();
        this.setupIntersectionObserver();
      }, 500);
    }
  }

  ngOnDestroy() {
    if (this.typingInterval) {
      clearInterval(this.typingInterval);
    }

    if (this.observer) {
      this.observer.disconnect();
    }
  }

  scrollToSection(sectionId: string): void {
    if (isPlatformBrowser(this.platformId)) {
      const section = document.getElementById(sectionId);
      if (section) {
        const offset = 100;
        const elementPosition = section.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Update active section if it's a sub-section of resume
        if (['experience', 'education', 'skills'].includes(sectionId)) {
          this.activeSection = sectionId;
        }
      }
    }
  }

  private setupIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
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

  setActiveCard(cardType: string): void {
    this.activeCard = cardType;
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  viewAllProjects(): void {
    this.router.navigate(['/portfolio']).then(() => {
      if (isPlatformBrowser(this.platformId)) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
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
        this.cdr.markForCheck(); // Force change detection
        setTimeout(typeChar, 100);
      } else {
        this.isTyping = false;
        this.cdr.markForCheck(); // Force change detection
        setTimeout(() => {
          this.eraseText();
        }, 2000);
      }
    };

    typeChar();
  }

  private eraseText(): void {
    this.isTyping = true;
    const eraseChar = () => {
      if (this.currentRole.length > 0) {
        this.currentRole = this.currentRole.slice(0, -1);
        this.cdr.markForCheck(); // Force change detection
        setTimeout(eraseChar, 50);
      } else {
        this.currentRoleIndex = (this.currentRoleIndex + 1) % this.roles.length;
        setTimeout(() => {
          this.typeText(this.roles[this.currentRoleIndex]);
        }, 500);
      }
    };

    eraseChar();
  }

  private initializeActiveCard(): void {
    // Rotate active card every 3 seconds
    const cards = ['code', 'design', 'tech'];
    let cardIndex = 0;

    setInterval(() => {
      cardIndex = (cardIndex + 1) % cards.length;
      this.activeCard = cards[cardIndex];
    }, 3000);
  }

  // Area selection methods
  selectArea(index: number): void {
    this.selectedArea = index;
  }

  closeModal(): void {
    this.selectedArea = null;
  }

  getMasteryLabel(mastery: number): string {
    if ([1, 2].includes(mastery)) return 'Básico';
    if ([3, 4].includes(mastery)) return 'Intermedio';
    if ([5, 6].includes(mastery)) return 'Avanzado';
    if ([7, 8].includes(mastery)) return 'Experto';
    if ([9, 10].includes(mastery)) return 'Maestro';
    return 'Básico';
  }
  getExpertCount(areaIndex: number): number {
    return this.skillAreas[areaIndex].detailedTechs
      .filter(tech => [7, 8].includes(tech.mastery)).length;
  }

  getMasteryCount(areaIndex: number, level: number): number {
    return this.skillAreas[areaIndex].detailedTechs.filter(tech => tech.mastery === level).length;
  }

  // Dashboard utility methods - simplified

  getTotalExperience(): string {
    return '2+';
  }

  getSkillColor(index: number): string {
    const colors = [
      '#14B8A6', // Turquoise
      '#06B6D4', // Cyan
      '#0EA5E9', // Sky
      '#3B82F6', // Blue
      '#6366F1', // Indigo
      '#8B5CF6', // Violet
      '#A855F7', // Purple
      '#D946EF', // Fuchsia
      '#EC4899', // Pink
      '#F43F5E'  // Rose
    ];
    return colors[index % colors.length];
  }

  getEducationColor(index: number): string {
    const educationColors = [
      '#3B82F6', // Blue
      '#6366F1', // Indigo
      '#8B5CF6', // Violet
      '#A855F7'  // Purple
    ];
    return educationColors[index % educationColors.length];
  }

  getExperienceColor(index: number): string {
    const experienceColors = [
      '#14B8A6', // Turquoise
      '#06B6D4', // Cyan
      '#0EA5E9', // Sky
      '#3B82F6'  // Blue
    ];
    return experienceColors[index % experienceColors.length];
  }

  getExperienceGradient(index: number): string {
    const gradients = [
      'linear-gradient(135deg, rgba(20, 184, 166, 0.05), rgba(20, 184, 166, 0.02))',
      'linear-gradient(135deg, rgba(6, 182, 212, 0.05), rgba(6, 182, 212, 0.02))',
      'linear-gradient(135deg, rgba(14, 165, 233, 0.05), rgba(14, 165, 233, 0.02))',
      'linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(59, 130, 246, 0.02))'
    ];
    return gradients[index % gradients.length];
  }

  getExperienceEmoji(index: number): string {
    const emojis = ['🚀', '💻', '⚡'];
    return emojis[index] || '💼';
  }

  getEducationEmoji(index: number): string {
    const emojis = ['🎓', '💻', '📚'];
    return emojis[index] || '🎓';
  }

  // Método para obtener iconos de tecnologías
  getTechIcon(tech: string): string {
    const icons: { [key: string]: string } = {
      'Angular': 'bi-triangle',
      'React': 'bi-atom',
      'Vue.js': 'bi-lightning',
      'TypeScript': 'bi-braces',
      'JavaScript': 'bi-braces',
      'Node.js': 'bi-server',
      'Python': 'bi-filetype-py',
      'PostgreSQL': 'bi-database',
      'Docker': 'bi-box-seam',
      'Laravel': 'bi-boxes',
      'Flutter': 'bi-phone',
      'Firebase': 'bi-fire',
      'MySQL': 'bi-database-fill',
      'MongoDB': 'bi-database-down'
    };
    return icons[tech] || 'bi-code-slash';
  }

  // Chart initialization - removed for new design
  private initializeCharts(): void {
    // No charts needed for the new areas dashboard
  }

  // Method to get technologies for specific experience
  getTechForExperience(index: number): string[] {
    const techMap = [
      ['Angular', 'TypeScript', 'Node.js', 'Docker', 'PostgreSQL'],
      ['Laravel', 'Vue.js', 'Python', 'Django', 'MySQL'],
      ['Angular', 'NestJS', 'PostgreSQL', 'HTML5', 'CSS3']
    ];
    return techMap[index] || [];
  }

  onSubmit(event: Event) {
    // Solo ejecutar en el navegador, no en SSR
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const data = new FormData(form);

    // Mostrar toast de "enviando..." con traducción
    this.toastr.info(this.translate.instant('home.contact.toast.sending'), '', {
      timeOut: 2000
    });
    this.forceToastStyles();

    fetch("https://formspree.io/f/xandpyvw", {
      method: "POST",
      body: data,
      headers: { Accept: "application/json" }
    }).then(response => {
      if (response.ok) {
        // Toast de éxito con traducción
        this.toastr.success(
          this.translate.instant('home.contact.toast.successMessage'),
          this.translate.instant('home.contact.toast.successTitle'),
          {
            timeOut: 5000,
            progressBar: true
          }
        );
        this.forceToastStyles();
        form.reset();
      } else {
        // Toast de error con traducción
        this.toastr.error(
          this.translate.instant('home.contact.toast.errorMessage'),
          this.translate.instant('home.contact.toast.errorTitle'),
          {
            timeOut: 5000,
            progressBar: true
          }
        );
        this.forceToastStyles();
      }
    }).catch((error) => {
      // Toast de error de conexión con traducción
      this.toastr.error(
        this.translate.instant('home.contact.toast.connectionErrorMessage'),
        this.translate.instant('home.contact.toast.connectionErrorTitle'),
        {
          timeOut: 5000,
          progressBar: true
        }
      );
      this.forceToastStyles();
    });
  }

}
