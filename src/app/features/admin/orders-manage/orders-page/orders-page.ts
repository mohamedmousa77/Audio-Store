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
import { TranslationService } from '../../../../core/services/translation/translation.service';
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
  private translationService = inject(TranslationService);

  // Expose translations
  translations = this.translationService.translations;

  // Use Signals from OrderServices
  orders = this.orderService.orders;
  loading = this.orderService.loadingSignal;
  error = this.orderService.errorSignal;

  // Local state
  showDetail = false;
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

      const matchesStatus = statusStr === '' ||
        order.orderStatus == parseInt(statusStr) || // loose equality for string/number match
        order.orderStatus.toString() === statusStr; // handle direct string match

      return matchesSearch && matchesStatus;
    });
  });

  // Expose OrderStatus enum to template
  OrderStatus = OrderStatus;

  async ngOnInit(): Promise<void> {
    await this.loadOrders();

    // Select first order if available
    // const firstOrder = this.filteredOrders()[0];
    // if (firstOrder) {
    //   this.selectOrder(firstOrder);
    // }
  }

  /**
   * Load all orders (admin)
   */
  async loadOrders(): Promise<void> {
    await this.orderService.loadAllOrders();
    console.log('Orders loaded:', this.orders());
  }

  /**
   * Select order to view details
   */
  selectOrder(order: Order): void {
    console.log('Selecting order:', order);
    this.selectedOrder.set(order);
    this.showDetail = true;
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
  /**
   * Update order status (admin)
   */
  async updateStatus(newStatus: OrderStatus): Promise<void> {
    const order = this.selectedOrder();
    console.log('Updating order status:', { order, newStatus });
    if (!order) return;

    try {
      await this.orderService.updateOrderStatus({ orderId: order.id, newStatus });

      // Show success dialog FIRST
      const statusText = this.getStatusTranslation(newStatus);
      await this.dialogService.showSuccessAlert(
        this.translations().common.success,
        `Lo stato dell'ordine ${order.orderNumber} è stato aggiornato a "${statusText}".`
        // Note: For full dynamic message we might need a parameterized translation, 
        // but keeping it simple for now as requested by user pattern. 
        // Ideally: this.translations().ordersManagement.messages.statusUpdated...
      );

      // AFTER user clicks OK:
      // 1. Reload orders to reflect updated status in the table
      await this.loadOrders();

      // 2. Close detail view and clear selected order
      this.showDetail = false;
      this.selectedOrder.set(null);

      // 3. Scroll to the updated order row
      setTimeout(() => {
        const rows = document.querySelectorAll('.order-row');
        rows.forEach(row => {
          if (row.textContent?.includes(order.orderNumber)) {
            row.scrollIntoView({ behavior: 'smooth', block: 'center' });
            row.classList.add('highlight-row');
            setTimeout(() => row.classList.remove('highlight-row'), 2000);
          }
        });
      }, 200);

    } catch (error: any) {
      console.error('Error updating order status:', error);

      // Show error dialog
      await this.dialogService.showErrorAlert(
        this.translations().common.error,
        error?.message || this.translations().errors.generic
      );
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
    return this.getStatusTranslation(parseInt(s) as OrderStatus);
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
    this.showDetail = false;
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  /**
   * Get status text from translations
   */
  getStatusTranslation(status: OrderStatus | string | number): string {
    // Handle string/number input
    let statusId: number;

    if (typeof status === 'string') {
      if (!isNaN(Number(status))) {
        statusId = Number(status);
      } else {
        // Try to map string name to enum value
        const key = Object.keys(OrderStatus).find(k => k.toLowerCase() === status.toLowerCase());
        if (key) {
          statusId = (OrderStatus as any)[key];
        } else {
          return 'Unknown';
        }
      }
    } else {
      statusId = status;
    }

    const t = this.translations().ordersManagement.status;
    const statusMap: { [key: number]: string } = {
      [OrderStatus.Pending]: t.pending,
      [OrderStatus.Processing]: t.processing,
      [OrderStatus.Shipped]: t.shipped,
      [OrderStatus.Delivered]: t.delivered,
      [OrderStatus.Cancelled]: t.cancelled
    };
    return statusMap[statusId] || 'Unknown';
  }

  /**
   * Get status for Badge component (lowercase)
   */
  getStatusBadge(status: OrderStatus | string | number): 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' {
    // Handle string/number input robustly
    let statusId: number;

    if (typeof status === 'string') {
      console.log('Parsing status string:', status);
      if (!isNaN(Number(status))) {
        statusId = Number(status);
      } else {
        // Handle "Processing", "Cancelled", etc.
        const s = status.toLowerCase();
        if (s === 'processing' || s === 'confirmed') return 'processing';
        if (s === 'cancelled' || s === 'canceled') return 'cancelled';
        if (s === 'shipped') return 'shipped';
        if (s === 'delivered') return 'delivered';
        return 'pending';
      }
    } else {
      statusId = status;
    }

    const statusMap: { [key: number]: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' } = {
      [OrderStatus.Pending]: 'pending',
      [OrderStatus.Processing]: 'processing',
      [OrderStatus.Shipped]: 'shipped',
      [OrderStatus.Delivered]: 'delivered',
      [OrderStatus.Cancelled]: 'cancelled'
    };
    return statusMap[statusId] || 'pending';
  }

  /**
   * Get status CSS class
   */
  getStatusClass(status: OrderStatus | string | number): string {
    const badge = this.getStatusBadge(status);
    return `status-${badge}`;
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
