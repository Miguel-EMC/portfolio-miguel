import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeService, ThemePreference } from '../../services/theme.service';
@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [TranslateModule],
  template: `<label class="theme-control"
    ><i class="bi bi-circle-half" aria-hidden="true"></i
    ><span class="sr-only">{{ 'ui.theme' | translate }}</span
    ><select [value]="theme.preference()" (change)="change($event)">
      <option value="system">{{ 'ui.system' | translate }}</option>
      <option value="light">{{ 'ui.light' | translate }}</option>
      <option value="dark">{{ 'ui.dark' | translate }}</option>
    </select></label
  >`,
  styles: [
    `
      .theme-control {
        display: flex;
        align-items: center;
        gap: 0.35rem;
        padding: 0.25rem 0.4rem;
        border: 1px solid var(--border-muted);
        border-radius: 10px;
        color: var(--text-secondary);
        background: var(--surface-primary);
      }
      select {
        min-height: 34px;
        max-width: 100px;
        font: inherit;
        font-size: 0.8rem;
        background: var(--surface-primary);
        color: var(--text-primary);
        border: 0;
        cursor: pointer;
      }
      @media (max-width: 420px) {
        .theme-control > i {
          display: none;
        }
        select {
          max-width: 75px;
        }
      }
    `,
  ],
})
export class ThemeToggleComponent {
  readonly theme = inject(ThemeService);
  change(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    if (value === 'system' || value === 'light' || value === 'dark')
      this.theme.setPreference(value as ThemePreference);
  }
}
