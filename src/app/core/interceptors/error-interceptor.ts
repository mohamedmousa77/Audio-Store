import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ErrorDialogService } from '../services/error/error-dialog.service';

/**
 * Error Interceptor
 * Handles HTTP errors globally and shows appropriate error dialogs
 * 
 * Error Handling Strategy:
 * - 0 (No response): Server unavailable → Critical error dialog
 * - 401 (Unauthorized): Session expired → Auth error dialog + redirect to login
 * - 403 (Forbidden): Access denied → Forbidden error dialog
 * - 404 (Not Found): Resource not found → Not found error dialog
 * - 500+ (Server errors): Internal server error → Server error dialog
 * - Network errors: Network error dialog
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const errorDialog = inject(ErrorDialogService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unexpected error occurred';

      // Client-side or network error
      if (error.error instanceof ErrorEvent) {
        errorMessage = `Network error: ${error.error.message}`;

        if (environment.enableLogging) {
          console.error('Client-side error:', error.error.message);
        }

        // Show network error dialog
        errorDialog.showNetworkError();

        return throwError(() => ({
          message: errorMessage,
          status: 0,
          originalError: error
        }));
      }

      // Backend returned an unsuccessful response code
      switch (error.status) {
        case 0:
          // Server unavailable (no response)
          errorMessage = 'Server unavailable';
          errorDialog.showServerUnavailable();
          break;

        case 400:
          // Bad Request
          errorMessage = error.error?.error || error.error?.message || 'Bad request';
          // Don't show dialog for 400 - let component handle it
          break;

        case 401:
          // Unauthorized
          errorMessage = 'Unauthorized. Please login again.';

          // ✅ FIX: Only show session expired dialog if user was actually logged in
          const hadAuthToken = localStorage.getItem('auth_token') !== null;

          // Clear auth data
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          localStorage.removeItem('token_expiry');
          localStorage.removeItem('refresh_token');

          // Only show dialog and redirect if user was logged in
          if (hadAuthToken) {
            // Show auth error dialog
            errorDialog.showAuthError();

            // Redirect to login
            router.navigate(['/auth/login']).catch(err =>
              console.error('Navigation error:', err)
            );
          } else {
            // Anonymous user - just log the error, don't show dialog
            if (environment.enableLogging) {
              console.log('401 error for anonymous user - no action needed');
            }
          }
          break;

        case 403:
          // Forbidden
          errorMessage = 'Access forbidden. You do not have permission.';
          errorDialog.showForbiddenError();
          break;

        case 404:
          // Not Found
          errorMessage = error.error?.error || 'Resource not found';

          // Extract resource name from URL if possible
          const resourceName = req.url.split('/').pop();
          errorDialog.showNotFoundError(resourceName);
          break;

        case 500:
        case 502:
        case 503:
        case 504:
          // Server errors
          errorMessage = error.error?.error || error.error?.message ||
            'Internal server error. Please try again later.';
          errorDialog.showInternalServerError(errorMessage);
          break;

        default:
          // Other errors
          errorMessage = error.error?.error || error.error?.message ||
            `Server error: ${error.status}`;

          // Show generic error dialog for unexpected status codes
          if (error.status >= 400) {
            errorDialog.showError({
              title: `Errore ${error.status}`,
              message: errorMessage,
              canRetry: true,
              isCritical: false
            });
          }
      }

      if (environment.enableLogging) {
        console.error('HTTP Error:', {
          status: error.status,
          message: errorMessage,
          url: error.url,
          error: error.error
        });
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
