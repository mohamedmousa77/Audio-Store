import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { AuthResponse, User, LoginRequest, RegisterRequest, RefreshTokenRequest, TokenResponse } from '../../models/user';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpService } from '../http/http.service';
import { ErrorHandlingService } from '../error/error-handling.service';

@Injectable({
  providedIn: 'root',
})
export class AuthServices {
  private httpService = inject(HttpService);
  private errorService = inject(ErrorHandlingService);

  // Reactive state
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    // Auto-load user from localStorage on service initialization
    this.loadUserFromLocalStorage();
  }

  // --- AUTHENTICATION METHODS ---

  /**
   * Login with email and password
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.httpService.post<AuthResponse>(API_ENDPOINTS.auth.login, credentials)
      .pipe(
        tap(response => {
          this.setUser(response.user, response.token, response.refreshToken, response.expiresIn);
        }),
        catchError(error => {
          this.errorService.handleHttpError(error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Register new user
   */
  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.httpService.post<AuthResponse>(API_ENDPOINTS.auth.register, userData)
      .pipe(
        tap(response => {
          this.setUser(response.user, response.token, response.refreshToken, response.expiresIn);
        }),
        catchError(error => {
          this.errorService.handleHttpError(error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Refresh access token using refresh token
   */
  refreshToken(): Observable<TokenResponse> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error('No refresh token available'));
    }

    const request: RefreshTokenRequest = { refreshToken };

    return this.httpService.post<TokenResponse>(API_ENDPOINTS.auth.refreshToken, request)
      .pipe(
        tap(response => {
          // Update tokens
          localStorage.setItem('auth_token', response.accessToken);
          localStorage.setItem('refresh_token', response.refreshToken);
          localStorage.setItem('token_expiry', (Date.now() + response.expiresIn * 1000).toString());
        }),
        catchError(error => {
          // If refresh fails, logout user
          this.logout();
          return throwError(() => error);
        })
      );
  }

  /**
   * Logout user (calls backend API and clears local storage)
   */
  logout(): Observable<any> {
    const token = this.getToken();

    // Clear local state immediately
    this.clearLocalStorage();
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);

    // If no token, just return
    if (!token) {
      return new Observable(observer => {
        observer.next(undefined);
        observer.complete();
      });
    }

    // Call backend logout endpoint
    return this.httpService.post(API_ENDPOINTS.auth.logout, {})
      .pipe(
        catchError(error => {
          // Even if backend call fails, user is logged out locally
          console.error('Logout API error (user logged out locally):', error);
          return throwError(() => error);
        })
      );
  }

  // --- TOKEN MANAGEMENT ---

  /**
   * Get current access token
   */
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  /**
   * Get refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  /**
   * Check if token is expired
   */
  isTokenExpired(): boolean {
    const expiry = localStorage.getItem('token_expiry');
    if (!expiry) return true;
    return Date.now() >= parseInt(expiry);
  }

  /**
   * Check if token will expire soon (within 5 minutes)
   */
  isTokenExpiringSoon(): boolean {
    const expiry = localStorage.getItem('token_expiry');
    if (!expiry) return true;
    const fiveMinutes = 5 * 60 * 1000;
    return Date.now() >= (parseInt(expiry) - fiveMinutes);
  }

  // --- USER STATE ---

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value && !this.isTokenExpired();
  }

  /**
   * Check if current user is admin
   */
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'Admin';
  }

  // --- VALIDATION ---

  /**
   * Validate email format
   */
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate password strength
   */
  validatePassword(password: string): { valid: boolean; strength: 'weak' | 'medium' | 'strong' } {
    const minLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*]/.test(password);

    const strength =
      hasUppercase && hasNumber && hasSpecial ? 'strong' :
        hasUppercase && hasNumber ? 'medium' : 'weak';

    return {
      valid: minLength && hasUppercase && hasNumber,
      strength,
    };
  }

  /**
   * Get password strength message
   */
  getPasswordStrengthMessage(strength: 'weak' | 'medium' | 'strong'): string {
    const messages = {
      weak: 'Weak - Add uppercase letters and numbers',
      medium: 'Medium - Add special characters for better security',
      strong: 'Strong password',
    };
    return messages[strength];
  }

  // --- PRIVATE HELPERS ---

  /**
   * Set user and tokens in state and localStorage
   */
  private setUser(user: User, token: string, refreshToken: string, expiresIn: number): void {
    // Compute additional fields
    const enhancedUser: User = {
      ...user,
      name: `${user.firstName} ${user.lastName}`,
      initials: `${user.firstName[0]}${user.lastName[0]}`.toUpperCase(),
      color: this.generateColorFromEmail(user.email)
    };

    // Save to localStorage
    localStorage.setItem('user', JSON.stringify(enhancedUser));
    localStorage.setItem('auth_token', token);
    localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem('token_expiry', (Date.now() + expiresIn * 1000).toString());

    // Update reactive state
    this.currentUserSubject.next(enhancedUser);
    this.isAuthenticatedSubject.next(true);

    console.log('✓ User authenticated:', enhancedUser.email);
  }

  /**
   * Load user from localStorage on app init
   */
  private loadUserFromLocalStorage(): void {
    const userJson = localStorage.getItem('user');
    const token = localStorage.getItem('auth_token');
    const expiry = localStorage.getItem('token_expiry');

    if (userJson && token && expiry) {
      if (Date.now() < parseInt(expiry)) {
        const user: User = JSON.parse(userJson);
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
        console.log('✓ User loaded from storage:', user.email);
      } else {
        // Token expired, clear storage
        this.clearLocalStorage();
      }
    }
  }

  /**
   * Clear all auth data from localStorage
   */
  private clearLocalStorage(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    localStorage.removeItem('token_expiry');
  }

  /**
   * Generate consistent color from email for avatar
   */
  private generateColorFromEmail(email: string): string {
    const colors = [
      '#f49d25', '#d68310', '#9c7a49', '#1c160d',
      '#3b82f6', '#8b5cf6', '#ec4899', '#10b981',
      '#f59e0b', '#ef4444', '#06b6d4', '#84cc16'
    ];

    let hash = 0;
    for (let i = 0; i < email.length; i++) {
      hash = email.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
  }
}
