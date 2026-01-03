import {Router, CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { LocalStorage } from '../services/local-storage';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const localStorageService = inject(LocalStorage);
  
  const token = localStorageService.getItem('authToken');
  
  if (token) {
    return true;
  }

  router.navigate(['/auth/login'], { 
    queryParams: { returnUrl: state.url } 
  });
  return false;
};
