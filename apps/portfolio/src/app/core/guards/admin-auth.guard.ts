import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AdminAuthService } from '../services/admin-auth.service';

export const adminAuthGuard: CanActivateFn = () => {
  const authService = inject(AdminAuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/admin/login']);
};

export const adminLoginGuard: CanActivateFn = () => {
  const authService = inject(AdminAuthService);
  const router = inject(Router);

  // If already authenticated, redirect to dashboard
  if (authService.isAuthenticated()) {
    return router.createUrlTree(['/admin/dashboard']);
  }

  return true;
};
