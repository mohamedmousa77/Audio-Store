import { Injectable, inject, signal, computed } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {
  Order,
  CreateOrderRequest,
  OrderConfirmation,
  UpdateOrderStatusRequest,
  OrderFilterParams,
  PaginatedResult,
  CreateOrderItem
} from '../../models/order';
import { OrderApiService } from './order-api.service';
import { Cart } from '../../models/cart';

/**
 * Order Services
 * High-level service for order management
 * 
 * ARCHITECTURE:
 * - All operations require authentication (JWT token)
 * - No mock data - always uses OrderApiService
 * - Uses Signals for reactive state management
 * - Provides helper methods for cart → order conversion
 */
@Injectable({
  providedIn: 'root'
})
export class OrderServices {
  private orderApi = inject(OrderApiService);

  // ============================================
  // STATE MANAGEMENT (Signals)
  // ============================================

  private ordersSignal = signal<Order[]>([]);
  private currentOrderSignal = signal<Order | null>(null);
  loadingSignal = signal<boolean>(false);
  errorSignal = signal<string | null>(null);

  // Computed values
  orders = computed(() => this.ordersSignal());
  currentOrder = computed(() => this.currentOrderSignal());
  hasOrders = computed(() => this.ordersSignal().length > 0);

  // ============================================
  // USER OPERATIONS
  // ============================================

  /**
   * Load current user's orders
   * Requires authentication
   */
  async loadUserOrders(): Promise<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    try {
      const orders = await firstValueFrom(this.orderApi.getUserOrders());
      this.ordersSignal.set(orders);
      console.log(`✅ Loaded ${orders.length} orders`);
    } catch (error) {
      console.error('Failed to load orders:', error);
      this.errorSignal.set('Failed to load orders');
      this.ordersSignal.set([]);
    } finally {
      this.loadingSignal.set(false);
    }
  }

  /**
   * Load all orders (Admin only)
   * @param filter Optional filter (status, customer search, date range, pagination)
   */
  async loadAllOrders(filter?: OrderFilterParams): Promise<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    try {
      const result = await firstValueFrom(this.orderApi.getAllOrders(filter));
      this.ordersSignal.set(result.items);
      console.log(`✅ Loaded ${result.items.length} orders (admin)`);
    } catch (error) {
      console.error('Failed to load all orders:', error);
      this.errorSignal.set('Failed to load orders');
      this.ordersSignal.set([]);
    } finally {
      this.loadingSignal.set(false);
    }
  }

  /**
   * Get order details by ID
   * @param id Order ID
   */
  async getOrderDetails(id: number): Promise<Order | undefined> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    try {
      const order = await firstValueFrom(this.orderApi.getOrderById(id));
      this.currentOrderSignal.set(order);
      console.log(`✅ Loaded order ${id}`);
      return order;
    } catch (error) {
      console.error(`Failed to load order ${id}:`, error);
      this.errorSignal.set('Failed to load order details');
      return undefined;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  /**
   * Get order by order number
   * @param orderNumber Order number (e.g., "ORD-2024-001")
   */
  async getOrderByNumber(orderNumber: string): Promise<Order | undefined> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    try {
      const order = await firstValueFrom(
        this.orderApi.getOrderByNumber(orderNumber)
      );
      this.currentOrderSignal.set(order);
      console.log(`✅ Loaded order ${orderNumber}`);
      return order;
    } catch (error) {
      console.error(`Failed to load order ${orderNumber}:`, error);
      this.errorSignal.set('Order not found');
      return undefined;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  /**
   * Create new order from cart
   * @param request Order creation data
   * @returns Order confirmation or undefined if failed
   */
  async createOrder(request: CreateOrderRequest): Promise<OrderConfirmation | undefined> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    try {
      const confirmation = await firstValueFrom(
        this.orderApi.createOrder(request)
      );

      console.log(`✅ Order created: ${confirmation.orderNumber}`);

      // Reload user orders to include new order
      await this.loadUserOrders();

      return confirmation;
    } catch (error) {
      console.error('Failed to create order:', error);
      this.errorSignal.set('Failed to create order');
      throw error;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  /**
   * Cancel order
   * @param id Order ID
   * @returns true if successful, false otherwise
   */
  async cancelOrder(id: number): Promise<boolean> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    try {
      await firstValueFrom(this.orderApi.cancelOrder(id));

      console.log(`✅ Order ${id} canceled`);

      // Reload orders to reflect cancellation
      await this.loadUserOrders();

      return true;
    } catch (error) {
      console.error(`Failed to cancel order ${id}:`, error);
      this.errorSignal.set('Failed to cancel order');
      return false;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  // ============================================
  // ADMIN OPERATIONS
  // ============================================

  /**
   * Get all orders with filtering (Admin only)
   * @param filter Filter parameters
   */
  async getAllOrders(filter?: OrderFilterParams): Promise<PaginatedResult<Order> | undefined> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    try {
      const result = await firstValueFrom(
        this.orderApi.getAllOrders(filter)
      );

      console.log(`✅ Loaded ${result.items.length} orders (page ${result.page})`);
      return result;
    } catch (error) {
      console.error('Failed to load all orders:', error);
      this.errorSignal.set('Failed to load orders');
      return undefined;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  /**
   * Update order status (Admin only)
   * @param request Order ID and new status
   */
  async updateOrderStatus(request: UpdateOrderStatusRequest): Promise<Order | undefined> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    try {
      const updatedOrder = await firstValueFrom(
        this.orderApi.updateOrderStatus(request)
      );

      console.log(`✅ Order ${request.orderId} status updated to ${request.newStatus}`);
      return updatedOrder;
    } catch (error) {
      console.error('Failed to update order status:', error);
      this.errorSignal.set('Failed to update order status');
      return undefined;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  // ============================================
  // HELPER METHODS
  // ============================================

  /**
   * Convert cart to order items
   * Helper method for checkout process
   * @param cart Shopping cart
   */
  convertCartToOrderItems(cart: Cart): CreateOrderItem[] {
    return cart.items.map(item => ({
      ProductId: item.productId,
      Quantity: item.quantity,
      UnitPrice: item.unitPrice
    }));
  }

  /**
   * Clear current order
   */
  clearCurrentOrder(): void {
    this.currentOrderSignal.set(null);
  }

  /**
   * Clear all orders (e.g., on logout)
   */
  clearOrders(): void {
    this.ordersSignal.set([]);
    this.currentOrderSignal.set(null);
    this.errorSignal.set(null);
  }
}
