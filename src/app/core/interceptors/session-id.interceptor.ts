import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SessionManager } from '../services/session/session-manager.service';
import { AuthServices } from '../services/auth/auth-services';

/**
 * Session ID Interceptor
 * Automatically adds X-Session-Id header to API requests for guest users
 * 
 * Flow:
 * - If user is authenticated → Skip (JWT token is used)
 * - If user is guest → Add X-Session-Id header
 * 
 * Backend reads this header to identify guest carts:
 * CartController.GetSessionId() → HttpContext.Request.Headers["X-Session-Id"]
 */
export const sessionIdInterceptor: HttpInterceptorFn = (req, next) => {
    const sessionManager = inject(SessionManager);
    const authService = inject(AuthServices);

    // Skip if user is authenticated (JWT token already present)
    if (authService.isAuthenticated()) {
        return next(req);
    }

    // Skip if not an API request
    if (!req.url.includes('/api/')) {
        return next(req);
    }

    // Get or create session ID for guest user
    const sessionId = sessionManager.getOrCreateSessionId();

    // Clone request and add X-Session-Id header
    const clonedReq = req.clone({
        setHeaders: {
            'X-Session-Id': sessionId
        }
    });

    return next(clonedReq);
};
