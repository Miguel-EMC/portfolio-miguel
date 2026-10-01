import {
  Component,
  ElementRef,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeService, ThemePreference } from '../../services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [TranslateModule],
  template: ` <div class="theme-picker">
    <button
      class="theme-trigger"
      type="button"
      aria-haspopup="menu"
      [attr.aria-expanded]="opened()"
      aria-controls="theme-menu"
      [attr.aria-label]="
        ('ui.theme' | translate) +
        ': ' +
        ('ui.' + theme.preference() | translate)
      "
      (click)="toggle()"
      (keydown.arrowdown)="open($event)"
      (keydown.arrowup)="open($event)"
    >
      <i [class]="'bi ' + selectedIcon" aria-hidden="true"></i>
      <span>{{ 'ui.' + theme.preference() | translate }}</span>
      <i
        class="bi bi-chevron-down theme-chevron"
        [class.expanded]="opened()"
        aria-hidden="true"
      ></i>
    </button>
    <div
      id="theme-menu"
      class="theme-menu"
      role="menu"
      [attr.aria-label]="'ui.theme' | translate"
      [hidden]="!opened()"
      (keydown)="navigate($event)"
    >
      <div class="theme-menu-heading">{{ 'ui.theme' | translate }}</div>
      @for (option of options; track option.value) {
        <button
          type="button"
          class="theme-option"
          role="menuitemradio"
          [attr.aria-checked]="theme.preference() === option.value"
          [class.selected]="theme.preference() === option.value"
          (click)="choose(option.value)"
        >
          <span class="theme-option-icon"
            ><i [class]="'bi ' + option.icon" aria-hidden="true"></i
          ></span>
          <span class="theme-option-copy"
            ><strong>{{ 'ui.' + option.value | translate }}</strong
            ><small>{{ option.description | translate }}</small></span
          >
          @if (theme.preference() === option.value) {
            <i class="bi bi-check2 theme-check" aria-hidden="true"></i>
          }
        </button>
      }
    </div>
  </div>`,
  styles: [
    `
      :host {
        display: block;
      }
      .theme-picker {
        position: relative;
      }
      .theme-trigger {
        display: flex;
        align-items: center;
        gap: 8px;
        min-height: 38px;
        padding: 7px 10px;
        border: 1px solid var(--border-muted);
        border-radius: 11px;
        background: var(--surface-primary);
        color: var(--text-primary);
        font: inherit;
        font-size: 0.78rem;
        cursor: pointer;
        transition:
          border-color 0.2s,
          background 0.2s;
      }
      .theme-trigger:hover,
      .theme-trigger[aria-expanded='true'] {
        border-color: var(--accent-primary);
        background: var(--bg-accent);
      }
      .theme-trigger:focus-visible,
      .theme-option:focus-visible {
        outline: 2px solid var(--accent-primary);
        outline-offset: 3px;
      }
      .theme-trigger > i:first-child {
        font-size: 1rem;
        color: var(--text-accent);
      }
      .theme-chevron {
        font-size: 0.65rem;
        transition: transform 0.2s;
      }
      .theme-chevron.expanded {
        transform: rotate(180deg);
      }
      .theme-menu {
        position: absolute;
        top: calc(100% + 12px);
        right: 0;
        width: 248px;
        max-width: calc(100vw - 32px);
        padding: 8px;
        border: 1px solid var(--border-muted);
        border-radius: 16px;
        background: var(--surface-primary);
        box-shadow: 0 16px 45px rgba(0, 0, 0, 0.2);
        z-index: 1100;
      }
      .theme-menu[hidden] {
        display: none;
      }
      .theme-menu-heading {
        padding: 7px 10px 10px;
        font-size: 0.68rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: var(--text-tertiary);
      }
      .theme-option {
        display: flex;
        align-items: center;
        gap: 10px;
        width: 100%;
        padding: 10px;
        border: 0;
        border-radius: 10px;
        background: transparent;
        color: var(--text-primary);
        text-align: left;
        font: inherit;
        cursor: pointer;
      }
      .theme-option:hover,
      .theme-option:focus-visible {
        background: var(--bg-primary);
      }
      .theme-option.selected {
        background: var(--bg-accent);
      }
      .theme-option-icon {
        display: grid;
        place-items: center;
        flex-shrink: 0;
        width: 34px;
        height: 34px;
        border: 1px solid var(--border-muted);
        border-radius: 9px;
        color: var(--text-accent);
      }
      .theme-option-copy {
        display: grid;
        gap: 3px;
        flex: 1;
      }
      .theme-option-copy strong {
        font-size: 0.8rem;
        font-weight: 600;
      }
      .theme-option-copy small {
        font-size: 0.68rem;
        color: var(--text-secondary);
      }
      .theme-check {
        color: var(--text-accent);
      }
      @media (max-width: 420px) {
        .theme-trigger {
          gap: 5px;
          padding: 7px;
          font-size: 0.7rem;
        }
        .theme-chevron {
          display: none;
        }
      }
    `,
  ],
})
export class ThemeToggleComponent {
  readonly theme = inject(ThemeService);
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly opened = signal(false);
  readonly options = [
    {
      value: 'system' as ThemePreference,
      icon: 'bi-laptop',
      description: 'ui.themeSystemDescription',
    },
    {
      value: 'light' as ThemePreference,
      icon: 'bi-sun',
      description: 'ui.themeLightDescription',
    },
    {
      value: 'dark' as ThemePreference,
      icon: 'bi-moon-stars',
      description: 'ui.themeDarkDescription',
    },
  ];
  get selectedIcon(): string {
    return this.options.find(
      (option) => option.value === this.theme.preference(),
    )!.icon;
  }
  toggle(): void {
    if (this.opened()) this.close();
    else this.open();
  }
  open(event?: Event): void {
    event?.preventDefault();
    this.opened.set(true);
    requestAnimationFrame(() =>
      this.buttons()[
        this.options.findIndex(
          (option) => option.value === this.theme.preference(),
        )
      ]?.focus(),
    );
  }
  choose(value: ThemePreference): void {
    this.theme.setPreference(value);
    this.close(true);
  }
  close(focus = false): void {
    this.opened.set(false);
    if (focus)
      this.element.nativeElement
        .querySelector<HTMLButtonElement>('.theme-trigger')
        ?.focus();
  }
  private buttons(): HTMLButtonElement[] {
    return Array.from(
      this.element.nativeElement.querySelectorAll<HTMLButtonElement>(
        '.theme-option',
      ),
    );
  }
  navigate(event: KeyboardEvent): void {
    const buttons = this.buttons();
    const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
    let next: number;
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      this.close(true);
      return;
    }
    if (event.key === 'Tab') {
      this.close();
      return;
    }
    if (event.key === 'ArrowDown') next = (index + 1) % buttons.length;
    else if (event.key === 'ArrowUp')
      next = (index + buttons.length - 1) % buttons.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = buttons.length - 1;
    else return;
    event.preventDefault();
    buttons[next].focus();
  }
  @HostListener('document:click', ['$event']) outside(event: MouseEvent): void {
    if (!this.element.nativeElement.contains(event.target as Node))
      this.close();
  }
}
