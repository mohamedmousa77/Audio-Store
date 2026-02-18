import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Order, OrderStatus } from '../../../../core/models/order';

@Component({
  selector: 'app-order-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './order-form.html',
  styleUrl: './order-form.css',
})
export class OrderForm implements OnChanges {
  // Riceve l'ordine selezionato dalla riga della tabella
  @Input() order: Order | null = null;

  // Notifica al padre il cambio di stato per aggiornare la lista principale
  @Output() statusUpdate = new EventEmitter<OrderStatus>();

  @Output() cancel = new EventEmitter<void>();

  showSuccess = false;
  selectedStatus: OrderStatus = OrderStatus.Pending;

  // Expose OrderStatus to template
  OrderStatus = OrderStatus;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['order'] && this.order) {
      this.selectedStatus = this.order.orderStatus;
    }
  }

  onUpdateStatus(): void {
    this.statusUpdate.emit(this.selectedStatus);

    // Feedback visivo
    this.showSuccess = true;
    setTimeout(() => this.showSuccess = false, 3000);
  }

  onCancel(): void {
    this.cancel.emit();
  }

  getStatusText(status: OrderStatus): string {
    const statusMap: { [key: number]: string } = {
      [OrderStatus.Pending]: 'Pending',
      [OrderStatus.Processing]: 'Processing',
      [OrderStatus.Shipped]: 'Shipped',
      [OrderStatus.Delivered]: 'Delivered',
      [OrderStatus.Cancelled]: 'Cancelled'
    };
    return statusMap[status] || 'Unknown';
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  formatPrice(price: number): string {
    return `€${price.toFixed(2)}`;
  }
}
