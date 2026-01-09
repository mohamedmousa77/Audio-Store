import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-badge',
  imports: [CommonModule],
  templateUrl: './badge.html',
  styleUrl: './badge.css',
})
export class Badge {
@Input() status: 'Available' | 'Low Stock' | 'Unavailable' |  'pending' | 'confirmed' | 'shipped' | 'delivered' | 'canceled'| 'Processing' | 'Shipped' | 'Delivered' | 'Canceled' = 'Available';
  @Input() text?: string;

  get badgeClass(): string {
    const statusMap: { [key: string]: string } = {
      'Available': 'badge-success',
      'Low Stock': 'badge-warning',
      'Unavailable': 'badge-danger',
      'Processing': 'badge-info',
      'Shipped': 'badge-primary',
      'Delivered': 'badge-success',
      'Canceled': 'badge-danger'
    };
    return statusMap[this.status] || 'badge-secondary';
  }

  get displayText(): string {
    return this.text || this.status;
  }
}
