import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminAuthService } from '../../../core/services/admin-auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent {
  private authService = inject(AdminAuthService);
  private router = inject(Router);

  password = signal('');
  error = signal<string | null>(null);
  isLoading = signal(false);
  showPassword = signal(false);

  onSubmit(): void {
    if (!this.password()) {
      this.error.set('Please enter the admin password');
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    // Simulate a small delay for UX
    setTimeout(() => {
      const result = this.authService.login(this.password());
      
      if (result.success) {
        this.router.navigate(['/admin/dashboard']);
      } else {
        this.error.set(result.message);
        this.password.set('');
      }
      
      this.isLoading.set(false);
    }, 500);
  }

  togglePasswordVisibility(): void {
    this.showPassword.set(!this.showPassword());
  }
}
