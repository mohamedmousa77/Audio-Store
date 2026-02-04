import { Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { DashboardStats } from '../../models/dashboard';
import { DashboardApiService } from './dashboard-api.service';

/**
 * Dashboard Services
 * High-level service for dashboard statistics management
 * Uses DashboardApiService for API calls and Signals for state management
 */
@Injectable({
    providedIn: 'root',
})
export class DashboardServices {
    constructor(private dashboardApi: DashboardApiService) { }

    // Signals
    stats = signal<DashboardStats | null>(null);
    loading = signal<boolean>(false);
    error = signal<string | null>(null);

    /**
     * Load dashboard statistics from API
     */
    async loadDashboardStats(): Promise<void> {
        this.loading.set(true);
        this.error.set(null);

        try {
            const stats = await firstValueFrom(this.dashboardApi.getDashboardStats());
            this.stats.set(stats);
            console.log('✅ Dashboard stats loaded:', stats);
        } catch (error) {
            console.error('Failed to load dashboard stats:', error);
            this.error.set('Failed to load dashboard statistics');
        } finally {
            this.loading.set(false);
        }
    }

    /**
     * Clear dashboard stats
     */
    clearStats(): void {
        this.stats.set(null);
        this.error.set(null);
    }
}
