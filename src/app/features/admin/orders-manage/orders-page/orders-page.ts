import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminSidebar } from '../../layout/admin-sidebar/admin-sidebar';
import { AdminHeader } from '../../layout/admin-header/header';
import { OrderForm } from '../order-form/order-form';
import { Badge } from '../../../../shared/components/badge/badge';
import { Order, OrderStatus } from '../../../../core/models/order';
import { OrderServices } from '../../../../core/services/order/order-services';
import { ConfirmDialogService } from '../../../../core/services/confirm-dialog/confirm-dialog.service';

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
  private dialogService = inject(ConfirmDialogService);

  // Use Signals from OrderServices
  orders = this.orderService.orders;
  loading = this.orderService.loadingSignal;
  error = this.orderService.errorSignal;

  // Local state
  showDetail = signal<boolean>(false);
  selectedOrder = signal<Order | null>(null);
  searchTerm = signal<string>('');
  selectedStatus = signal<string>('');

  // Computed filtered orders
  filteredOrders = computed(() => {
    const allOrders = this.orders();
    const search = this.searchTerm().toLowerCase();
    const statusStr = this.selectedStatus();

    return allOrders.filter(order => {
      const matchesSearch = !search ||
        order.orderNumber.toLowerCase().includes(search) ||
        `${order.customerFirstName} ${order.customerLastName}`.toLowerCase().includes(search) ||
        order.customerEmail.toLowerCase().includes(search);

      const matchesStatus = statusStr === '' || order.orderStatus === parseInt(statusStr);

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

      // Reload orders to reflect updated status in the table
      await this.loadOrders();

      // Update selected order with fresh data
      const refreshed = this.orders().find(o => o.id === order.id);
      if (refreshed) {
        this.selectedOrder.set(refreshed);
      }

      // Show success dialog
      await this.dialogService.showSuccessAlert(
        'Stato aggiornato',
        `Lo stato dell\'ordine ${order.orderNumber} è stato aggiornato a "${this.getStatusText(newStatus)}".`
      );
    } catch (error: any) {
      console.error('Error updating order status:', error);

      // Show error dialog
      await this.dialogService.showErrorAlert(
        'Errore aggiornamento',
        error?.message || 'Si è verificato un errore durante l\'aggiornamento dello stato dell\'ordine.'
      );
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
   * Get total orders count
   */
  getTotalOrders(): number {
    return this.orders().length;
  }

  /**
   * Get customer initial for avatar
   */
  getCustomerInitial(order: Order): string {
    return order.customerFirstName.charAt(0).toUpperCase();
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
    this.selectedStatus.set('');
  }

  /**
   * Get the text of the currently selected status filter
   */
  getSelectedStatusText(): string {
    const s = this.selectedStatus();
    if (s === '') return '';
    return this.getStatusText(parseInt(s) as OrderStatus);
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
      [OrderStatus.Processing]: 'In Elaborazione',
      [OrderStatus.Shipped]: 'Spedito',
      [OrderStatus.Delivered]: 'Consegnato',
      [OrderStatus.Cancelled]: 'Annullato'
    };
    return statusMap[status] || 'Sconosciuto';
  }

  /**
   * Get status for Badge component (lowercase)
   */
  getStatusBadge(status: OrderStatus): 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' {
    const statusMap: { [key: number]: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' } = {
      [OrderStatus.Pending]: 'pending',
      [OrderStatus.Processing]: 'processing',
      [OrderStatus.Shipped]: 'shipped',
      [OrderStatus.Delivered]: 'delivered',
      [OrderStatus.Cancelled]: 'cancelled'
    };
    return statusMap[status] || 'pending';
  }

  /**
   * Get status CSS class
   */
  getStatusClass(status: OrderStatus): string {
    const statusMap: { [key: number]: string } = {
      [OrderStatus.Pending]: 'status-pending',
      [OrderStatus.Processing]: 'status-processing',
      [OrderStatus.Shipped]: 'status-shipped',
      [OrderStatus.Delivered]: 'status-delivered',
      [OrderStatus.Cancelled]: 'status-cancelled'
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
