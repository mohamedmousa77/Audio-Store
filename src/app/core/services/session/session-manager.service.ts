import { Injectable } from '@angular/core';

/**
 * Session Manager Service
 * Manages session IDs for guest users
 * SessionId is used to persist guest carts in the backend database
 */
@Injectable({
    providedIn: 'root'
})
export class SessionManager {
    private readonly SESSION_KEY = 'audiostore_session_id';

    /**
     * Get existing session ID or create a new one
     * SessionId is stored in localStorage for persistence across browser sessions
     * @returns Session ID (UUID v4)
     */
    getOrCreateSessionId(): string {
        let sessionId = localStorage.getItem(this.SESSION_KEY);

        if (!sessionId) {
            sessionId = this.generateUUID();
            localStorage.setItem(this.SESSION_KEY, sessionId);
            console.log('🆔 New SessionId created:', sessionId);
        }

        return sessionId;
    }

    /**
     * Get current session ID without creating a new one
     * @returns Session ID or null if not exists
     */
    getSessionId(): string | null {
        return localStorage.getItem(this.SESSION_KEY);
    }

    /**
     * Clear session ID
     * Called after successful login when guest cart is merged with user cart
     */
    clearSessionId(): void {
        const sessionId = localStorage.getItem(this.SESSION_KEY);
        if (sessionId) {
            localStorage.removeItem(this.SESSION_KEY);
            console.log('🗑️ SessionId cleared:', sessionId);
        }
    }

    /**
     * Generate UUID v4
     * Format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
     * @returns UUID v4 string
     */
    private generateUUID(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    /**
     * Check if current session is a guest session
     * @returns true if SessionId exists (guest), false if not (authenticated or new)
     */
    isGuestSession(): boolean {
        return this.getSessionId() !== null;
    }
}
