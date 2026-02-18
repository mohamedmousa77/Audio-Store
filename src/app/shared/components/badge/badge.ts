import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-badge',
  imports: [CommonModule],
  templateUrl: './badge.html',
  styleUrl: './badge.css',
})
export class Badge {
  @Input() status: 'Available' | 'Low Stock' | 'Unavailable' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'confirmed' | 'canceled' | 'Processing' | 'Shipped' | 'Delivered' | 'Canceled' | 'Cancelled' = 'Available';
  @Input() text?: string;

  get badgeClass(): string {
    const statusMap: { [key: string]: string } = {
      'Available': 'badge-success',
      'Low Stock': 'badge-warning',
      'Unavailable': 'badge-danger',
      'pending': 'badge-warning',
      'processing': 'badge-info',
      'confirmed': 'badge-info',
      'Processing': 'badge-info',
      'shipped': 'badge-primary',
      'Shipped': 'badge-primary',
      'delivered': 'badge-success',
      'Delivered': 'badge-success',
      'cancelled': 'badge-danger',
      'canceled': 'badge-danger',
      'Canceled': 'badge-danger',
      'Cancelled': 'badge-danger'
    };
    return statusMap[this.status] || 'badge-secondary';
  }

  get displayText(): string {
    return this.text || this.status;
  }
}
