import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Badge } from '../../../../shared/components/badge/badge';
import { Order } from '../../../../core/models/order';

@Component({
  selector: 'app-recent-orders',
  imports: [CommonModule, RouterModule, Badge],
  templateUrl: './recent-orders.html',
  styleUrl: './recent-orders.css',
})
export class RecentOrders {
  @Input() orders: Order[] = [];

}
