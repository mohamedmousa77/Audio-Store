import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { LocalStorage } from '../services/local-storage';
import { AuthServices } from '../services/auth/auth-services';

export const adminGuard: CanActivateFn = (route, state) => {
const router = inject(Router);
  const authService = inject(AuthServices);
  
  // Verifica se è loggato E se è un amministratore
  // if (authService.isAuthenticated && authService.isAdmin) {
  //   return true;
  // }

  // Se non è admin, reindirizza al login o a una pagina di accesso negato
  router.navigate(['/auth/login']);
  return false;
};
