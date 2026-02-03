import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

/**
 * Base HTTP Service
 * Provides common HTTP methods with automatic base URL configuration
 */
@Injectable({
    providedIn: 'root'
})
export class HttpService {
    private http = inject(HttpClient);
    private baseUrl = environment.apiUrl;

    /**
     * Build full URL with base URL
     */
    private buildUrl(endpoint: string): string {
        // Remove leading slash if present
        const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
        // Remove trailing slash from baseUrl if present
        const cleanBaseUrl = this.baseUrl.endsWith('/') ? this.baseUrl.slice(0, -1) : this.baseUrl;
        return `${cleanBaseUrl}/${cleanEndpoint}`;
    }

    /**
     * GET request
     */
    get<T>(endpoint: string, params?: any): Observable<T> {
        const url = this.buildUrl(endpoint);
        let httpParams = new HttpParams();

        if (params) {
            Object.keys(params).forEach(key => {
                if (params[key] !== null && params[key] !== undefined) {
                    httpParams = httpParams.append(key, params[key].toString());
                }
            });
        }

        return this.http.get<T>(url, { params: httpParams });
    }

    /**
     * POST request
     */
    post<T>(endpoint: string, body: any, options?: { headers?: HttpHeaders }): Observable<T> {
        const url = this.buildUrl(endpoint);
        return this.http.post<T>(url, body, options);
    }

    /**
     * PUT request
     */
    put<T>(endpoint: string, body: any): Observable<T> {
        const url = this.buildUrl(endpoint);
        return this.http.put<T>(url, body);
    }

    /**
     * PATCH request
     */
    patch<T>(endpoint: string, body: any): Observable<T> {
        const url = this.buildUrl(endpoint);
        return this.http.patch<T>(url, body);
    }

    /**
     * DELETE request
     */
    delete<T>(endpoint: string): Observable<T> {
        const url = this.buildUrl(endpoint);
        return this.http.delete<T>(url);
    }

    /**
     * Upload file with FormData
     */
    upload<T>(endpoint: string, formData: FormData): Observable<T> {
        const url = this.buildUrl(endpoint);
        return this.http.post<T>(url, formData);
    }

    /**
     * Download file
     */
    download(endpoint: string): Observable<Blob> {
        const url = this.buildUrl(endpoint);
        return this.http.get(url, { responseType: 'blob' });
    }
}
