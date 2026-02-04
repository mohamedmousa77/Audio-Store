import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
    Customer,
    CustomerDetail,
    CustomerFilter,
    CustomerSummary,
    PaginatedCustomerResult
} from '../../models/customer';
import { Order } from '../../models/order';

/**
 * Customer Management API Service
 * Handles HTTP requests to admin customer endpoints
 */
@Injectable({
    providedIn: 'root'
})
export class CustomerManagementApiService {
    private readonly baseUrl = `${environment.apiUrl}/admin`;

    constructor(private http: HttpClient) { }

    /**
     * Get customer summary/statistics
     * GET /api/admin/customers/summary
     */
    getCustomerSummary(): Observable<CustomerSummary> {
        return this.http.get<CustomerSummary>(`${this.baseUrl}/customers/summary`);
    }

    /**
     * Get all customers with pagination and filtering
     * GET /api/admin/customers
     */
    getAllCustomers(filter?: CustomerFilter): Observable<PaginatedCustomerResult> {
        let params = new HttpParams();

        if (filter) {
            if (filter.searchTerm) {
                params = params.set('searchTerm', filter.searchTerm);
            }
            if (filter.status) {
                params = params.set('status', filter.status);
            }
            if (filter.page !== undefined) {
                params = params.set('page', filter.page.toString());
            }
            if (filter.pageSize !== undefined) {
                params = params.set('pageSize', filter.pageSize.toString());
            }
        }

        return this.http.get<PaginatedCustomerResult>(`${this.baseUrl}/customers`, { params });
    }

    /**
     * Get customer details by ID
     * GET /api/admin/customers/{id}
     */
    getCustomerDetail(id: number): Observable<CustomerDetail> {
        return this.http.get<CustomerDetail>(`${this.baseUrl}/customers/${id}`);
    }

    /**
     * Get customer order history
     * GET /api/admin/customers/{id}/orders
     */
    getCustomerOrders(id: number): Observable<Order[]> {
        return this.http.get<Order[]>(`${this.baseUrl}/customers/${id}/orders`);
    }
}
