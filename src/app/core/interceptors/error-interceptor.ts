import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unexpected error occurred';

      if (error.error instanceof ErrorEvent) {
        // Client-side or network error
        errorMessage = `Network error: ${error.error.message}`;
        if (environment.enableLogging) {
          console.error('Client-side error:', error.error.message);
        }
      } else {
        // Backend returned an unsuccessful response code
        switch (error.status) {
          case 400:
            errorMessage = error.error?.error || error.error?.message || 'Bad request';
            break;
          case 401:
            errorMessage = 'Unauthorized. Please login again.';
            // Clear auth data and redirect to login
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            localStorage.removeItem('token_expiry');
            router.navigate(['/auth/login']).catch(err =>
              console.error('Navigation error:', err)
            );
            break;
          case 403:
            errorMessage = 'Access forbidden. You do not have permission.';
            break;
          case 404:
            errorMessage = error.error?.error || 'Resource not found';
            break;
          case 500:
            errorMessage = 'Internal server error. Please try again later.';
            break;
          case 503:
            errorMessage = 'Service unavailable. Please try again later.';
            break;
          default:
            errorMessage = error.error?.error || error.error?.message ||
              `Server error: ${error.status}`;
        }

        if (environment.enableLogging) {
          console.error('HTTP Error:', {
            status: error.status,
            message: errorMessage,
            url: error.url,
            error: error.error
          });
        }
      }

      // Return user-friendly error
      return throwError(() => ({
        message: errorMessage,
        status: error.status,
        originalError: error
      }));
    })
  );
};
