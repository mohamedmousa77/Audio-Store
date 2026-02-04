import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../http/http.service';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { DashboardStats } from '../../models/dashboard';

/**
 * Dashboard API Service
 * Handles API calls for admin dashboard statistics
 */
@Injectable({
    providedIn: 'root'
})
export class DashboardApiService {
    private httpService = inject(HttpService);

    /**
     * Get dashboard statistics
     * GET /api/admin/dashboard
     */
    getDashboardStats(): Observable<DashboardStats> {
        return this.httpService.get<DashboardStats>(
            `${API_ENDPOINTS.admin.dashboard}`
        );
    }
}
