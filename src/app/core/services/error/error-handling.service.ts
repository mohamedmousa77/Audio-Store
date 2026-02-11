import { Injectable, signal } from '@angular/core';

export interface AppError {
    message: string;
    status?: number;
    timestamp: Date;
    type: 'error' | 'warning' | 'info';
}

/**
 * Error Handling Service
 * Centralized error management with reactive state
 */
@Injectable({
    providedIn: 'root'
})
export class ErrorHandlingService {
    // Reactive error state
    private currentError = signal<AppError | null>(null);
    private errorHistory = signal<AppError[]>([]);

    // Public readonly signals
    readonly error = this.currentError.asReadonly();
    readonly errors = this.errorHistory.asReadonly();

    /**
     * Set current error
     */
    setError(message: string, status?: number, type: 'error' | 'warning' | 'info' = 'error'): void {
        const error: AppError = {
            message,
            status,
            timestamp: new Date(),
            type
        };

        this.currentError.set(error);

        // Add to history (keep last 10)
        const history = [...this.errorHistory(), error];
        if (history.length > 10) {
            history.shift();
        }
        this.errorHistory.set(history);
    }

    /**
     * Clear current error
     */
    clearError(): void {
        this.currentError.set(null);
    }

    /**
     * Clear all errors
     */
    clearAll(): void {
        this.currentError.set(null);
        this.errorHistory.set([]);
    }

    /**
     * Get user-friendly error message
     */
    getUserFriendlyMessage(error: any): string {
        if (typeof error === 'string') {
            return error;
        }

        if (error?.message) {
            return error.message;
        }

        if (error?.error?.message) {
            return error.error.message;
        }

        return 'An unexpected error occurred. Please try again.';
    }

    /**
     * Handle HTTP error
     * Logs error to console but does NOT show error dialog to user
     * Components should handle their own user-facing error messages
     */
    handleHttpError(error: any, silent: boolean = true): void {
        const message = this.getUserFriendlyMessage(error);
        const status = error?.status || error?.originalError?.status;

        // Log to console for debugging
        console.error('HTTP Error:', { message, status, error });

        // Only set error state if not silent (default is silent to avoid showing technical dialogs)
        if (!silent) {
            this.setError(message, status, 'error');
        }
    }
}
