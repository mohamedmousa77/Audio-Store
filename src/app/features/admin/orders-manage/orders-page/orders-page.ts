import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminSidebar } from '../../layout/admin-sidebar/admin-sidebar';
import { AdminHeader } from '../../layout/admin-header/header';
import { OrderForm } from '../order-form/order-form';
import { Badge } from '../../../../shared/components/badge/badge';
import { Order, OrderStatus } from '../../../../core/models/order';
import { OrderServices } from '../../../../core/services/order/order-services';

/**
 * Admin Orders Page Component
 * Updated to use OrderServices with Signals
 * 
 * Breaking Changes:
 * - Uses Signals instead of hardcoded data
 * - OrderStatus is enum (not string)
 * - Order properties: orderDate, totalAmount, orderStatus, orderNumber
 */
@Component({
  selector: 'app-orders-page',
  imports: [
    CommonModule,
    FormsModule,
    AdminSidebar,
    AdminHeader,
    OrderForm,
    Badge
  ],
  templateUrl: './orders-page.html',
  styleUrl: './orders-page.css',
})
export class OrdersPage implements OnInit {
  private orderService = inject(OrderServices);

  // Use Signals from OrderServices
  orders = this.orderService.orders;
  loading = this.orderService.loadingSignal;
  error = this.orderService.errorSignal;

  // Local state
  showDetail = signal<boolean>(false);
  selectedOrder = signal<Order | null>(null);
  searchTerm = signal<string>('');
  selectedStatus = signal<OrderStatus | null>(null);

  // Computed filtered orders
  filteredOrders = computed(() => {
    const allOrders = this.orders();
    const search = this.searchTerm().toLowerCase();
    const status = this.selectedStatus();

    return allOrders.filter(order => {
      const matchesSearch = !search ||
        order.orderNumber.toLowerCase().includes(search) ||
        `${order.customerFirstName} ${order.customerLastName}`.toLowerCase().includes(search) ||
        order.customerEmail.toLowerCase().includes(search);

      const matchesStatus = status === null || order.orderStatus === status;

      return matchesSearch && matchesStatus;
    });
  });

  // Expose OrderStatus enum to template
  OrderStatus = OrderStatus;

  async ngOnInit(): Promise<void> {
    await this.loadOrders();

    // Select first order if available
    const firstOrder = this.filteredOrders()[0];
    if (firstOrder) {
      this.selectOrder(firstOrder);
    }
  }

  /**
   * Load all orders (admin)
   */
  async loadOrders(): Promise<void> {
    await this.orderService.loadAllOrders();
  }

  /**
   * Select order to view details
   */
  selectOrder(order: Order): void {
    this.selectedOrder.set(order);
    this.showDetail.set(true);
    this.scrollToDetail();
  }

  /**
   * Scroll to detail section
   */
  private scrollToDetail(): void {
    setTimeout(() => {
      const element = document.getElementById('order-detail-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  /**
   * Update order status (admin)
   */
  async updateStatus(newStatus: OrderStatus): Promise<void> {
    const order = this.selectedOrder();
    if (!order) return;

    try {
      await this.orderService.updateOrderStatus({ orderId: order.id, newStatus });

      // Update selected order
      const updatedOrders = this.orders();
      const updated = updatedOrders.find(o => o.id === order.id);
      if (updated) {
        this.selectedOrder.set(updated);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Errore durante l\'aggiornamento dello stato dell\'ordine');
    }
  }

  /**
   * Handle status change from dropdown
   */
  async onStatusChange(order: Order, event: any): Promise<void> {
    const newStatus = parseInt(event.target.value) as OrderStatus;

    try {
      await this.orderService.updateOrderStatus({ orderId: order.id, newStatus });
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Errore durante l\'aggiornamento dello stato');
    }
  }

  /**
   * Get count of shipped orders
   */
  getShippedCount(): number {
    return this.orders().filter(order => order.orderStatus === OrderStatus.Shipped).length;
  }

  /**
   * Apply filters
   */
  applyFilters(): void {
    // Filters are automatically applied via computed signal
    // This method kept for compatibility with template
  }

  /**
   * Clear all filters
   */
  clearFilters(): void {
    this.searchTerm.set('');
    this.selectedStatus.set(null);
  }

  /**
   * Delete order (not implemented - requires backend endpoint)
   */
  deleteOrder(order: Order): void {
    if (confirm(`Are you sure you want to delete order ${order.orderNumber}?`)) {
      alert('Delete functionality not implemented yet');
      // TODO: Implement delete endpoint in backend
    }
  }

  /**
   * Handle cancel/close detail view
   */
  handleCancel(): void {
    this.selectedOrder.set(null);
    this.showDetail.set(false);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
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
