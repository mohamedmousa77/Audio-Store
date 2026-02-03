import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../http/http.service';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import {
    Cart,
    AddToCartRequest,
    UpdateCartItemRequest,
    CartResponse
} from '../../models/cart';

/**
 * Cart API Service
 * Handles all API calls for shopping cart operations
 * 
 * IMPORTANT: This service works for BOTH guest and authenticated users
 * - Guest users: Backend uses X-Session-Id header (auto-injected by interceptor)
 * - Authenticated users: Backend uses JWT token userId
 * 
 * No need to pass userId or sessionId explicitly - backend handles it automatically!
 */
@Injectable({
    providedIn: 'root'
})
export class CartApiService {
    private httpService = inject(HttpService);

    // ============================================
    // CART OPERATIONS
    // ============================================

    /**
     * Get cart (guest or authenticated)
     * Backend automatically determines cart based on:
     * - JWT token (authenticated) → userId
     * - X-Session-Id header (guest) → sessionId
     */
    getCart(): Observable<Cart> {
        return this.httpService.get<Cart>(API_ENDPOINTS.cart.base);
    }

    /**
     * Add item to cart
     * @param request Product ID and quantity
     */
    addItem(request: AddToCartRequest): Observable<CartResponse> {
        return this.httpService.post<CartResponse>(
            API_ENDPOINTS.cart.items,
            request
        );
    }

    /**
     * Update cart item quantity
     * @param itemId Cart item ID
     * @param request New quantity
     */
    updateItemQuantity(itemId: number, request: UpdateCartItemRequest): Observable<CartResponse> {
        return this.httpService.put<CartResponse>(
            API_ENDPOINTS.cart.itemById(itemId),
            request
        );
    }

    /**
     * Remove item from cart
     * @param itemId Cart item ID
     */
    removeItem(itemId: number): Observable<CartResponse> {
        return this.httpService.delete<CartResponse>(
            API_ENDPOINTS.cart.itemById(itemId)
        );
    }

    /**
     * Clear entire cart
     */
    clearCart(): Observable<void> {
        return this.httpService.delete<void>(API_ENDPOINTS.cart.clear);
    }

    /**
     * Merge guest cart with user cart after login
     * @param sessionId Guest session ID to merge
     */
    mergeGuestCart(sessionId: string): Observable<CartResponse> {
        // Backend expects plain string in body: [FromBody] string sessionId
        return this.httpService.post<CartResponse>(
            API_ENDPOINTS.cart.merge,
            JSON.stringify(sessionId) // Send as JSON string
        );
    }
}
