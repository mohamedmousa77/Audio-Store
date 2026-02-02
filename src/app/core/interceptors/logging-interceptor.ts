import { HttpInterceptorFn } from '@angular/common/http';
import { tap, finalize } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

/**
 * Logging interceptor for debugging HTTP requests
 * Only active when environment.enableLogging is true
 */
export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
    if (!environment.enableLogging) {
        return next(req);
    }

    const startTime = Date.now();
    let status: string;

    console.log(`🔵 HTTP Request: ${req.method} ${req.url}`);

    if (req.body) {
        console.log('📦 Request Body:', req.body);
    }

    return next(req).pipe(
        tap({
            next: (event: any) => {
                if (event.status) {
                    status = 'succeeded';
                    console.log(`✅ HTTP Response: ${req.method} ${req.url}`, {
                        status: event.status,
                        duration: `${Date.now() - startTime}ms`
                    });
                }
            },
            error: (error: any) => {
                status = 'failed';
                console.error(`❌ HTTP Error: ${req.method} ${req.url}`, {
                    status: error.status,
                    duration: `${Date.now() - startTime}ms`,
                    error: error.message
                });
            }
        }),
        finalize(() => {
            const duration = Date.now() - startTime;
            console.log(`⏱️ Request completed in ${duration}ms - Status: ${status || 'unknown'}`);
        })
    );
};
