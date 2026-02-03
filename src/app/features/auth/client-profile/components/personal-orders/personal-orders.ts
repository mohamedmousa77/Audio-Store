import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderServices } from '../../../../../core/services/order/order-services';
import { Order, OrderStatus } from '../../../../../core/models/order';

type DateFilter = 'all' | 'today' | 'week' | 'month';

/**
 * Personal Orders Component
 * Updated to use Signals from OrderServices
 * 
 * Breaking Changes:
 * - Uses Signals instead of Observables
 * - Order IDs are numbers (not strings)
 * - OrderStatus is enum (not string)
 */
@Component({
  selector: 'app-personal-orders',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './personal-orders.html',
  styleUrl: './personal-orders.css',
})
export class PersonalOrders implements OnInit {
  private orderService = inject(OrderServices);
  private router = inject(Router);

  // Use Signals from OrderServices
  orders = this.orderService.orders;
  loading = this.orderService.loadingSignal;
  error = this.orderService.errorSignal;

  // Local state
  selectedDateFilter = signal<DateFilter>('all');

  // Computed filtered orders
  filteredOrders = computed(() => {
    const allOrders = this.orders();
    const filter = this.selectedDateFilter();

    if (filter === 'all') {
      return allOrders;
    }

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfDay);
    startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return allOrders.filter((order) => {
      const orderDate = new Date(order.orderDate);
      const orderDateOnly = new Date(
        orderDate.getFullYear(),
        orderDate.getMonth(),
        orderDate.getDate()
      );

      switch (filter) {
        case 'today':
          return orderDateOnly.getTime() === startOfDay.getTime();
        case 'week':
          return orderDate >= startOfWeek && orderDate <= now;
        case 'month':
          return orderDate >= startOfMonth && orderDate <= now;
        default:
          return true;
      }
    });
  });

  // Expose OrderStatus enum to template
  OrderStatus = OrderStatus;

  ngOnInit(): void {
    this.loadOrders();
  }

  /**
   * Load user's orders
   */
  async loadOrders(): Promise<void> {
    await this.orderService.loadUserOrders();
  }

  /**
   * Apply date filter
   */
  onDateFilterChange(filter: DateFilter): void {
    this.selectedDateFilter.set(filter);
  }

  /**
   * Get status CSS class
   */
  getStatusColor(status: OrderStatus): string {
    const statusMap: { [key: number]: string } = {
      [OrderStatus.Pending]: 'status-processing',
      [OrderStatus.Confirmed]: 'status-processing',
      [OrderStatus.Shipped]: 'status-shipped',
      [OrderStatus.Delivered]: 'status-delivered',
      [OrderStatus.Canceled]: 'status-canceled'
    };
    return statusMap[status] || 'status-processing';
  }

  /**
   * Get status text in Italian
   */
  getStatusText(status: OrderStatus): string {
    const statusMap: { [key: number]: string } = {
      [OrderStatus.Pending]: 'In Attesa',
      [OrderStatus.Confirmed]: 'Confermato',
      [OrderStatus.Shipped]: 'Spedito',
      [OrderStatus.Delivered]: 'Consegnato',
      [OrderStatus.Canceled]: 'Annullato'
    };
    return statusMap[status] || 'Sconosciuto';
  }

  /**
   * Format price
   */
  formatPrice(price: number): string {
    return `€${price.toFixed(2)}`;
  }

  /**
   * Format date
   */
  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  /**
   * Get product images (max 2)
   */
  getProductImages(order: Order): any[] {
    return (order.items || []).slice(0, 2);
  }

  /**
   * Get extra products count
   */
  getExtraProductsCount(order: Order): number {
    const count = (order.items || []).length - 2;
    return count > 0 ? count : 0;
  }

  /**
   * Navigate to order details
   * @param orderNumber Order number (string)
   */
  viewOrderDetails(orderNumber: string): void {
    this.router.navigate(['/client/order-confirmation', orderNumber]);
  }
}
