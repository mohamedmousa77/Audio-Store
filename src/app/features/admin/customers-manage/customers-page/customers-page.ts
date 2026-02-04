import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminSidebar } from '../../layout/admin-sidebar/admin-sidebar';
import { AdminHeader } from '../../layout/admin-header/header';
import { CustomerManagementService } from '../../../../core/services/customer/customer-management-services';
import { Customer, CustomerFilter } from '../../../../core/models/customer';
import { OrderStatus } from '../../../../core/models/order';

/**
 * Customers Management Page (Admin)
 * Updated to use CustomerManagementService with Signals
 * 
 * Breaking Changes:
 * - Uses Signals instead of hardcoded data
 * - Customer model updated (id is number, not string)
 * - Reactive filtering with computed()
 */
@Component({
  selector: 'app-customers-page',
  imports: [
    CommonModule,
    FormsModule,
    AdminSidebar,
    AdminHeader
  ],
  templateUrl: './customers-page.html',
  styleUrl: './customers-page.css',
})
export class CustomersPage implements OnInit {
  private customerService = inject(CustomerManagementService);

  // Use Signals from CustomerManagementService
  customers = this.customerService.customers;
  selectedCustomer = this.customerService.selectedCustomer;
  customerOrders = this.customerService.customerOrders;
  summary = this.customerService.summary;
  loading = this.customerService.loading;
  error = this.customerService.error;

  // Local state
  searchTerm = signal<string>('');
  selectedSort = signal<string>('recent');
  selectedOrdersRange = signal<string>('all');
  selectedStatus = signal<string>('');
  showDetailSection = signal<boolean>(false);

  // Computed filtered customers
  filteredCustomers = computed(() => {
    const allCustomers = this.customers();
    const search = this.searchTerm().toLowerCase();
    const ordersRange = this.selectedOrdersRange();
    const status = this.selectedStatus();

    let filtered = allCustomers.filter(customer => {
      // Search filter
      const matchesSearch = !search ||
        `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(search) ||
        customer.email.toLowerCase().includes(search);

      // Orders range filter
      let matchesOrders = true;
      if (ordersRange === 'none') matchesOrders = customer.totalOrders === 0;
      else if (ordersRange === '1-10') matchesOrders = customer.totalOrders >= 1 && customer.totalOrders <= 10;
      else if (ordersRange === '10+') matchesOrders = customer.totalOrders > 10;

      // Status filter
      const matchesStatus = !status || customer.status === status;

      return matchesSearch && matchesOrders && matchesStatus;
    });

    // Apply sorting
    const sort = this.selectedSort();
    switch (sort) {
      case 'recent':
        filtered.sort((a, b) =>
          new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime()
        );
        break;
      case 'alphabetical':
        filtered.sort((a, b) =>
          `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)
        );
        break;
      case 'orders':
        filtered.sort((a, b) => b.totalOrders - a.totalOrders);
        break;
      case 'spending':
        filtered.sort((a, b) => b.totalSpent - a.totalSpent);
        break;
    }

    return filtered;
  });

  // Expose OrderStatus enum to template
  OrderStatus = OrderStatus;

  async ngOnInit(): Promise<void> {
    await this.loadData();
  }

  /**
   * Load all data
   */
  async loadData(): Promise<void> {
    await Promise.all([
      this.customerService.loadAllCustomers(),
      this.customerService.loadCustomerSummary()
    ]);

    // Select first customer if available
    const firstCustomer = this.filteredCustomers()[0];
    if (firstCustomer) {
      await this.selectCustomer(firstCustomer);
    }
  }

  /**
   * Select customer to view details
   */
  async selectCustomer(customer: Customer): Promise<void> {
    await this.customerService.loadCustomerDetail(customer.id);
    await this.customerService.loadCustomerOrders(customer.id);
    this.showDetailSection.set(true);
    this.scrollToDetail();
  }

  /**
   * Scroll to detail section
   */
  private scrollToDetail(): void {
    setTimeout(() => {
      const element = document.getElementById('customer-detail-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  /**
   * Apply filters (reactive via computed)
   */
  applyFilters(): void {
    // Filters are automatically applied via computed signal
  }

  /**
   * Clear all filters
   */
  clearFilters(): void {
    this.searchTerm.set('');
    this.selectedOrdersRange.set('all');
    this.selectedStatus.set('');
  }

  /**
   * Close detail section
   */
  closeDetail(): void {
    this.showDetailSection.set(false);
    this.customerService.clearSelectedCustomer();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  /**
   * Get active customers count
   */
  getActiveCustomers(): number {
    return this.summary()?.activeCustomers || 0;
  }

  /**
   * Get total orders count
   */
  getTotalOrders(): number {
    return this.customers().reduce((sum, c) => sum + c.totalOrders, 0);
  }

  /**
   * Get top customer name
   */
  getTopCustomer(): string {
    const customers = this.customers();
    if (customers.length === 0) return 'N/A';

    const topCustomer = customers.reduce((max, c) =>
      c.totalOrders > max.totalOrders ? c : max
    );
    return topCustomer.firstName;
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

  /**
   * Get customer initials
   */
  getInitials(customer: Customer): string {
    return `${customer.firstName.charAt(0)}${customer.lastName.charAt(0)}`.toUpperCase();
  }

  /**
   * Get customer color (for avatar)
   */
  getColor(customer: Customer): string {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];
    return colors[customer.id % colors.length];
  }

  /**
   * Get status color
   */
  getStatusColor(status: string): string {
    return status === 'Active' ? 'status-active' : 'status-inactive';
  }

  /**
   * Get order status text in Italian
   */
  getOrderStatusText(status: OrderStatus): string {
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
   * Export customers (future implementation)
   */
  exportCustomers(): void {
    console.log('Exporting customers...');
    alert('Export functionality not implemented yet');
  }
}
