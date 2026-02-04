import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Order Status Data interface for progress bars
 */
export interface OrderStatusData {
  label: string;
  count: number;
  percentage: number;
  color: string;
}

/**
 * Recent Orders Component (Dashboard Widget)
 * Displays order statistics by status with progress bars
 * 
 * Updated to use OrderStatusData interface
 */
@Component({
  selector: 'app-recent-orders',
  imports: [CommonModule],
  templateUrl: './recent-orders.html',
  styleUrl: './recent-orders.css',
})
export class RecentOrders {
  @Input() orders: OrderStatusData[] = [];
}
