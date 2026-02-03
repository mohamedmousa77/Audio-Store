import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Order, OrderStatus } from '../../../../core/models/order';

/**
 * Recent Orders Component (Dashboard Widget)
 * Updated to use Order model with OrderStatus enum
 * 
 * Breaking Changes:
 * - Order properties: orderDate, totalAmount, orderStatus, orderNumber
 * - OrderStatus is enum (not string)
 */
@Component({
  selector: 'app-recent-orders',
  imports: [CommonModule, RouterModule],
  templateUrl: './recent-orders.html',
  styleUrl: './recent-orders.css',
})
export class RecentOrders {
  @Input() orders: Order[] = [];

  // Expose OrderStatus enum to template
  OrderStatus = OrderStatus;

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
   * Get status CSS class
   */
  getStatusClass(status: OrderStatus): string {
    const statusMap: { [key: number]: string } = {
      [OrderStatus.Pending]: 'status-pending',
      [OrderStatus.Confirmed]: 'status-confirmed',
      [OrderStatus.Shipped]: 'status-shipped',
      [OrderStatus.Delivered]: 'status-delivered',
      [OrderStatus.Canceled]: 'status-canceled'
    };
    return statusMap[status] || 'status-pending';
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
   * Format price
   */
  formatPrice(price: number): string {
    return `€${price.toFixed(2)}`;
  }
}
