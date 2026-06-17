import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-community-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, TranslateModule],
  template: `
    <div class="login-page animate-fade-in">
      <div class="login-card">
        <header class="login-header">
          <div class="brand">
            <span class="logo">M</span>
            <h1>MiguelDev</h1>
          </div>
          <p>{{ 'auth.login.subtitle' | translate }}</p>
        </header>

        <form (ngSubmit)="onLogin()" class="login-form">
          <div class="form-group">
            <label for="email">{{ 'auth.fields.email' | translate }}</label>
            <input type="email" id="email" name="email" [placeholder]="'auth.placeholders.email' | translate" class="form-control" />
          </div>
          
          <div class="form-group">
            <label for="password">{{ 'auth.fields.password' | translate }}</label>
            <input type="password" id="password" name="password" placeholder="••••••••" class="form-control" />
          </div>

          <button type="submit" class="btn-primary">{{ 'auth.login.action' | translate }}</button>
        </form>

        <footer class="login-footer">
          <p>{{ 'auth.login.noAccount' | translate }} <a routerLink="/auth/signup">{{ 'auth.login.joinNow' | translate }}</a></p>
          <a routerLink="/blog" class="back-link">
            <i class="bi bi-arrow-left"></i> {{ 'blog.backToBlog' | translate }}
          </a>
        </footer>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: calc(100vh - 70px);
      display: flex;
      align-items: center;
      justify-content: center;
      background:
        radial-gradient(circle at top right, rgba(var(--accent-secondary-rgb), 0.16), transparent 28rem),
        var(--bg-secondary);
      padding: 2rem;
    }
    .login-card {
      background: var(--surface-elevated);
      padding: 3rem;
      border-radius: var(--radius-3xl);
      border: 1px solid var(--border-primary);
      width: 100%;
      max-width: 450px;
      box-shadow: var(--shadow-2xl);
    }
    .login-header {
      text-align: center;
      margin-bottom: 2.5rem;
      .brand {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        margin-bottom: 1rem;
        .logo {
          width: 45px;
          height: 45px;
          background: var(--accent-primary);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-lg);
          font-weight: 800;
          font-size: 1.5rem;
        }
        h1 { margin: 0; font-size: 1.75rem; letter-spacing: -0.02em; }
      }
      p { color: var(--text-secondary); font-size: 0.95rem; }
    }
    .login-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      label { font-weight: 600; font-size: 0.9rem; }
    }
    .form-control {
      padding: 0.75rem 1rem;
      background: var(--bg-tertiary);
      border: 1px solid var(--border-muted);
      border-radius: var(--radius-xl);
      color: var(--text-primary);
      &:focus { outline: none; border-color: var(--accent-primary); }
    }
    .btn-primary {
      padding: 1rem;
      background: var(--accent-primary);
      color: white;
      border: none;
      border-radius: var(--radius-xl);
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
      margin-top: 1rem;
      &:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(var(--accent-primary-rgb), 0.2); }
    }
    .login-footer {
      margin-top: 2rem;
      text-align: center;
      p { font-size: 0.9rem; margin-bottom: 1.5rem; }
      a { color: var(--accent-primary); font-weight: 600; text-decoration: none; }
      .back-link {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        color: var(--text-muted);
        font-size: 0.85rem;
        &:hover { color: var(--text-primary); }
      }
    }
  `]
})
export class CommunityLoginComponent {
  private router = inject(Router);
  onLogin() { this.router.navigate(['/blog']); }
}
