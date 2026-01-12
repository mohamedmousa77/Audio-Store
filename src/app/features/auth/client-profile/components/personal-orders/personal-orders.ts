import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OrderServices } from '../../../../../core/services/order/order-services';
import { Order } from '../../../../../core/models/order';

type DateFilter = 'all' | 'today' | 'week' | 'month';

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
export class PersonalOrders implements OnInit, OnDestroy {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  selectedDateFilter: DateFilter = 'all';
  loading = true;
  error: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(private orderService: OrderServices) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Carica gli ordini
   */
  private loadOrders(): void {
    this.loading = true;
    this.error = null;

    this.orderService
      .getOrders()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (orders) => {
          this.orders = orders;
          this.applyDateFilter();
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading orders:', err);
          this.error = 'Failed to load orders. Please try again.';
          this.loading = false;
        },
      });
  }

  /**
   * Applica il filtro per data
   */
  onDateFilterChange(filter: DateFilter): void {
    this.selectedDateFilter = filter;
    this.applyDateFilter();
  }

  /**
   * Filtra gli ordini per data
   */
  private applyDateFilter(): void {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfDay);
    startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    this.filteredOrders = this.orders.filter((order) => {
      if (!order.date) return false;

      const orderDate = new Date(order.date);
      const orderDateOnly = new Date(
        orderDate.getFullYear(),
        orderDate.getMonth(),
        orderDate.getDate()
      );

      switch (this.selectedDateFilter) {
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
  }

  /**
   * Ottiene il colore dello status
   */
  getStatusColor(status: string): string {
    switch (status?.toLowerCase()) {
      case 'processing':
      case 'pending':
        return 'status-processing';
      case 'shipped':
        return 'status-shipped';
      case 'delivered':
        return 'status-delivered';
      case 'canceled':
        return 'status-canceled';
      default:
        return 'status-processing';
    }
  }

  /**
   * Formatta il prezzo
   */
  formatPrice(price: number | string): string {
    if (typeof price === 'string') {
      return `$${price}`
    }
    return `$${(price ?? 0).toFixed(2)}`;
  }

  /**
   * Formatta la data
   */
  formatDate(date: Date | string | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  /**
   * Ottieni le immagini dei prodotti (max 2)
   */
  getProductImages(order: Order): any[] {
    return (order.items || []).slice(0, 2);
  }

  /**
   * Conta i prodotti aggiuntivi
   */
  getExtraProductsCount(order: Order): number {
    const count = (order.items || []).length - 2;
    return count > 0 ? count : 0;
  }

  /**
   * Naviga ai dettagli dell'ordine
   */
  viewOrderDetails(orderId: string): void {
    // Naviga alla pagina di dettaglio dell'ordine
    window.location.href = `/client/order-confirmation/${orderId}`;
  }


}
