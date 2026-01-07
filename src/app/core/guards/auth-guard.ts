import {Router, CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthServices } from '../services/auth/auth-services';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthServices);
  
  if (authService.isLoggedIn) {
    return true;
  }

  // Se non è loggato, reindirizza al login salvando l'URL di provenienza
  router.navigate(['/auth/login'], { 
    queryParams: { returnUrl: state.url } 
  });
  return false;
};
