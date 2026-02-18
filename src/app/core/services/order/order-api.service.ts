import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../http/http.service';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import {
    Order,
    CreateOrderRequest,
    OrderConfirmation,
    UpdateOrderStatusRequest,
    OrderFilterParams,
    PaginatedResult
} from '../../models/order';

/**
 * Order API Service
 * Handles all API calls for order operations
 * 
 * IMPORTANT: All endpoints require authentication (JWT token)
 * No guest support - users must be logged in to create/view orders
 */
@Injectable({
    providedIn: 'root'
})
export class OrderApiService {
    private httpService = inject(HttpService);

    // ============================================
    // USER OPERATIONS
    // ============================================

    /**
     * Get current user's orders
     * Requires authentication
     */
    getUserOrders(): Observable<Order[]> {
        return this.httpService.get<Order[]>(API_ENDPOINTS.orders.base);
    }

    /**
     * Get order by ID
     * Requires authentication
     * User can only access their own orders (unless admin)
     * @param id Order ID
     */
    getOrderById(id: number): Observable<Order> {
        return this.httpService.get<Order>(API_ENDPOINTS.orders.byId(id));
    }

    /**
     * Get order by order number
     * Requires authentication
     * @param orderNumber Order number (e.g., "ORD-2024-001")
     */
    getOrderByNumber(orderNumber: string): Observable<Order> {
        return this.httpService.get<Order>(
            API_ENDPOINTS.orders.byNumber(orderNumber)
        );
    }

    /**
     * Create new order from cart
     * Requires authentication
     * @param request Order creation data
     */
    createOrder(request: CreateOrderRequest): Observable<OrderConfirmation> {
        return this.httpService.post<OrderConfirmation>(
            API_ENDPOINTS.orders.base,
            request
        );
    }

    /**
     * Cancel order
     * Requires authentication
     * User can only cancel their own pending orders
     * @param id Order ID
     */
    cancelOrder(id: number): Observable<void> {
        return this.httpService.post<void>(
            API_ENDPOINTS.orders.cancel(id),
            {} // Empty body
        );
    }

    // ============================================
    // ADMIN OPERATIONS
    // ============================================

    /**
     * Get all orders with filtering (Admin only)
     * Requires admin role
     * @param filter Filter parameters
     */
    getAllOrders(filter?: OrderFilterParams): Observable<PaginatedResult<Order>> {
        return this.httpService.get<PaginatedResult<Order>>(
            API_ENDPOINTS.orders.admin.all,
            filter as Record<string, any>
        );
    }

    /**
     * Update order status (Admin only)
     * Requires admin role
     * @param request Order ID and new status
     */
    updateOrderStatus(request: UpdateOrderStatusRequest): Observable<Order> {
        return this.httpService.patch<Order>(
            API_ENDPOINTS.orders.admin.updateStatus(request.orderId),
            { OrderId: request.orderId, NewStatus: request.newStatus }
        );
    }
}
