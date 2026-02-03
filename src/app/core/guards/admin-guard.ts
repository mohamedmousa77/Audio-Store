import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthServices } from '../services/auth/auth-services';

/**
 * Admin Guard - Protects routes that require admin role
 * Redirects to login if not authenticated
 * Redirects to access-denied if authenticated but not admin
 */
export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthServices);

  // Check if user is authenticated
  if (!authService.isAuthenticated()) {
    console.warn('🔒 Admin Guard: User not authenticated, redirecting to login');
    router.navigate(['/auth/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }

  // Check if user has admin role
  if (authService.isAdmin()) {
    return true;
  }

  // User is authenticated but not admin - redirect to access denied or home
  console.warn('🚫 Admin Guard: User does not have admin privileges');
  router.navigate(['/client/home']); // Or create /access-denied page
  return false;
};
