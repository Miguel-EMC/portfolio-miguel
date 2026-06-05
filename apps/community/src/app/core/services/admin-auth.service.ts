import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

interface AdminSession {
  authenticated: boolean;
  loginTime: number;
  expiresAt: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService {
  private readonly STORAGE_KEY = 'admin_session';
  private readonly SESSION_DURATION = environment.admin.sessionDuration;
  
  // Simple password for demo - in production, use proper hashing
  private readonly ADMIN_PASSWORD = 'admin123'; // Change this!
  
  private sessionSignal = signal<AdminSession | null>(null);
  
  isAuthenticated = computed(() => {
    const session = this.sessionSignal();
    if (!session) return false;
    if (Date.now() > session.expiresAt) {
      this.logout();
      return false;
    }
    return session.authenticated;
  });

  constructor(private router: Router) {
    this.loadSession();
  }

  private loadSession(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const session: AdminSession = JSON.parse(stored);
        if (Date.now() < session.expiresAt) {
          this.sessionSignal.set(session);
        } else {
          this.clearSession();
        }
      }
    } catch (error) {
      console.error('Failed to load admin session:', error);
      this.clearSession();
    }
  }

  private saveSession(session: AdminSession): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(session));
    this.sessionSignal.set(session);
  }

  private clearSession(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.sessionSignal.set(null);
  }

  login(password: string): { success: boolean; message: string } {
    // Simple password check - in production use bcrypt comparison
    if (password === this.ADMIN_PASSWORD) {
      const now = Date.now();
      const session: AdminSession = {
        authenticated: true,
        loginTime: now,
        expiresAt: now + this.SESSION_DURATION
      };
      this.saveSession(session);
      return { success: true, message: 'Login successful' };
    }
    
    return { success: false, message: 'Invalid password' };
  }

  logout(): void {
    this.clearSession();
    this.router.navigate(['/admin/login']);
  }

  getSessionInfo(): { loginTime: Date; expiresAt: Date } | null {
    const session = this.sessionSignal();
    if (!session) return null;
    
    return {
      loginTime: new Date(session.loginTime),
      expiresAt: new Date(session.expiresAt)
    };
  }

  getRemainingTime(): number {
    const session = this.sessionSignal();
    if (!session) return 0;
    return Math.max(0, session.expiresAt - Date.now());
  }

  extendSession(): void {
    const session = this.sessionSignal();
    if (session && session.authenticated) {
      const updatedSession: AdminSession = {
        ...session,
        expiresAt: Date.now() + this.SESSION_DURATION
      };
      this.saveSession(updatedSession);
    }
  }
}
