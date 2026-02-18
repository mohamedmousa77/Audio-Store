import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { OrderServices } from '../../../../core/services/order/order-services';
import { OrderStatus } from '../../../../core/models/order';
import { ClientHeader } from '../../layout/client-header/client-header';
import { ClientFooter } from '../../layout/client-footer/client-footer';
import { TranslationService } from '../../../../core/services/translation/translation.service';

/**
 * Order History Component
 * Updated to use Signals from OrderServices
 * 
 * Breaking Changes:
 * - Uses Signals instead of Observables
 * - Order IDs are now numbers (not strings)
 * - OrderStatus is now enum (not string)
 */
@Component({
  selector: 'app-order-history',
  imports: [CommonModule],
  templateUrl: './order-history.html',
  styleUrl: './order-history.css',
})
export class OrderHistory implements OnInit {
  private orderService = inject(OrderServices);
  private router = inject(Router);
  private translationService = inject(TranslationService);

  // Use Signals from OrderServices
  orders = this.orderService.orders;
  loading = this.orderService.loadingSignal;
  error = this.orderService.errorSignal;
  hasOrders = this.orderService.hasOrders;

  // Translations
  translations = this.translationService.translations;

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
   * Navigate to order details
   * @param orderId Order ID (number)
   */
  viewOrderDetails(orderId: number): void {
    this.router.navigate(['/client/order-details', orderId]);
  }

  /**
   * Get status label in Italian
   * @param status OrderStatus enum value
   */
  getStatusLabel(status: OrderStatus): string {
    const labels = {
      [OrderStatus.Pending]: 'In Attesa',
      [OrderStatus.Processing]: 'In Elaborazione',
      [OrderStatus.Shipped]: 'Spedito',
      [OrderStatus.Delivered]: 'Consegnato',
      [OrderStatus.Cancelled]: 'Annullato'
    };
    return labels[status] || 'Sconosciuto';
  }

  /**
   * Get status CSS class
   * @param status OrderStatus enum value
   */
  getStatusClass(status: OrderStatus): string {
    const classes = {
      [OrderStatus.Pending]: 'status-pending',
      [OrderStatus.Processing]: 'status-processing',
      [OrderStatus.Shipped]: 'status-shipped',
      [OrderStatus.Delivered]: 'status-delivered',
      [OrderStatus.Cancelled]: 'status-cancelled'
    };
    return classes[status] || 'status-unknown';
  }

  /**
   * Format date for display
   * @param dateString ISO date string
   */
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Retry loading orders (called from error state)
   */
  retryLoad(): void {
    this.loadOrders();
  }
}
