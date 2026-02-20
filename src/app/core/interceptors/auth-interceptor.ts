import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthServices } from '../services/auth/auth-services';
import { catchError, switchMap } from 'rxjs/operators';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthServices);
  const token = authService.getToken();

  // Skip auth header for auth endpoints
  const isAuthEndpoint = req.url.includes('/auth/login') ||
    req.url.includes('/auth/register') ||
    req.url.includes('/auth/refresh-token');

  if (isAuthEndpoint) {
    return next(req);
  }

  // If token is expiring soon, refresh it first
  if (token && authService.isTokenExpiringSoon()) {
    return authService.refreshToken().pipe(
      switchMap(() => {
        // After refresh, clone request with new token
        const newToken = authService.getToken();
        const clonedReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${newToken}`
          }
        });
        return next(clonedReq);
      }),
      catchError(error => {
        // If refresh fails, proceed with original request
        // (error interceptor will handle logout)
        return next(addAuthHeader(req, token));
      })
    );
  }

  // Add auth header if token exists
  if (token) {
    return next(addAuthHeader(req, token));
  }

  return next(req);
};

/**
 * Helper function to add Authorization header
 */
function addAuthHeader(req: any, token: string) {
  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
}
