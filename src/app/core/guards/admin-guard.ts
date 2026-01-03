import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { LocalStorage } from '../services/local-storage';

export const adminGuard: CanActivateFn = (route, state) => {
 const router = inject(Router);
  const localStorageService = inject(LocalStorage);
  
  const userRole = localStorageService.getItem('userRole');
  
  if (userRole === 'admin') {
    return true;
  }

  router.navigate(['/auth/login']);
  return false;
};
