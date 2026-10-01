import { LanguageService } from '../../../shared/services/language.service';
import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil, switchMap, catchError, of } from 'rxjs';

import { PortfolioService } from '../../../core/services/portfolio.service';
import { PortfolioProjectMeta } from '../../../interfaces/project.interface';
import { ProjectCardComponent } from '../../../shared/components/ui/project-card/project-card.component';

@Component({
  selector: 'app-portafolio',
  standalone: true,
  imports: [NgForOf, NgIf, TranslateModule, ProjectCardComponent],
  templateUrl: './portafolio.component.html',
  styleUrls: ['./portafolio.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortafolioComponent implements OnInit, OnDestroy {
  private language = inject(LanguageService);
  hasError = false;
  private portfolioService = inject(PortfolioService);
  private cdr = inject(ChangeDetectorRef);
  private destroy$ = new Subject<void>();

  activeFilter: 'all' | 'personal' | 'professional' = 'all';
  allProjects: PortfolioProjectMeta[] = [];
  filteredProjects: PortfolioProjectMeta[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.language.currentLanguage$
      .pipe(
        switchMap(() => {
          this.isLoading = true;
          this.hasError = false;
          return this.portfolioService.getAllProjects().pipe(
            catchError(() => {
              this.hasError = true;
              return of([]);
            }),
          );
        }),
        takeUntil(this.destroy$),
      )
      .subscribe({
        next: (projects) => {
          this.allProjects = projects;
          this.applyFilter();
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.hasError = true;
          this.isLoading = false;
          this.cdr.markForCheck();
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get personalProjects(): PortfolioProjectMeta[] {
    return this.allProjects.filter((p) => p.type === 'personal');
  }

  get professionalProjects(): PortfolioProjectMeta[] {
    return this.allProjects.filter((p) => p.type === 'professional');
  }

  setFilter(filter: 'all' | 'personal' | 'professional'): void {
    this.activeFilter = filter;
    this.applyFilter();
    this.cdr.detectChanges();
  }

  private applyFilter(): void {
    switch (this.activeFilter) {
      case 'personal':
        this.filteredProjects = this.personalProjects;
        break;
      case 'professional':
        this.filteredProjects = this.professionalProjects;
        break;
      default:
        this.filteredProjects = this.allProjects;
    }
  }
}
