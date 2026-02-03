import { Router, CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthServices } from '../services/auth/auth-services';

/**
 * Auth Guard - Protects routes that require authentication
 * Redirects to login if user is not authenticated or token is expired
 */
export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthServices);

  // Check if user is authenticated and token is not expired
  if (authService.isAuthenticated()) {
    return true;
  }

  // If not authenticated, redirect to login with returnUrl
  console.warn('🔒 Auth Guard: User not authenticated, redirecting to login');
  router.navigate(['/auth/login'], {
    queryParams: { returnUrl: state.url }
  });
  return false;
};
