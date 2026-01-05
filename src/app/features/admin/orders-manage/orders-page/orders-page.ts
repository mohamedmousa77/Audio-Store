import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminSidebar } from '../../layout/admin-sidebar/admin-sidebar';
import { AdminHeader } from '../../layout/admin-header/header';
import { Badge } from '../../../../shared/components/badge/badge';
import { Order } from '../../../../core/models/order';

@Component({
  selector: 'app-orders-page',
  imports: [
    CommonModule,
    FormsModule,
    AdminSidebar,
    AdminHeader,
    Badge
  ],
  templateUrl: './orders-page.html',
  styleUrl: './orders-page.css',
})
export class OrdersPage implements OnInit {
orders: Order[] = [
    {
      id: '#ORD-7752',
      date: '2024-01-15',
      customerName: 'Alex Morgan',
      customerEmail: 'alex.m@example.com',
      total: '$478.95',
      status: 'Shipped',
      time: '2 mins ago'
    },
    {
      id: '#ORD-7751',
      date: '2024-01-14',
      customerName: 'Sarah Jenkins',
      customerEmail: 's.jenkins@test.com',
      total: '$129.99',
      status: 'Delivered',
      time: '1 hour ago'
    },
    {
      id: '#ORD-7750',
      date: '2024-01-14',
      customerName: 'Michael Chen',
      customerEmail: 'mchen88@gmail.com',
      total: '$1,299.00',
      status: 'Processing',
      time: '3 hours ago'
    },
    {
      id: '#ORD-7749',
      date: '2024-01-13',
      customerName: 'Emily Miller',
      customerEmail: 'emily.m@studio.com',
      total: '$59.95',
      status: 'Delivered',
      time: '5 hours ago'
    },
    {
      id: '#ORD-7748',
      date: '2024-01-13',
      customerName: 'James Wilson',
      customerEmail: 'james.w@music.com',
      total: '$899.50',
      status: 'Processing',
      time: '8 hours ago'
    },
    {
      id: '#ORD-7747',
      date: '2024-01-12',
      customerName: 'Lisa Brown',
      customerEmail: 'lisa.b@pro.com',
      total: '$249.99',
      status: 'Canceled',
      time: '1 day ago'
    }
  ];

  filteredOrders: Order[] = [];
  searchTerm = '';
  selectedStatus = '';
  selectedDateRange = '';

  ngOnInit(): void {
    this.filteredOrders = [...this.orders];
  }

  onStatusChange(order: Order, event: any): void {
    const newStatus = event.target.value;
    this.updateOrderStatus(order, newStatus);
  }
  
  getShippedCount(): number {
    return this.orders.filter(order => order.status === 'Shipped').length;
  }

  applyFilters(): void {
    this.filteredOrders = this.orders.filter(order => {
      const matchesSearch = order.id.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           order.customerName.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = !this.selectedStatus || order.status === this.selectedStatus;
      
      return matchesSearch && matchesStatus;
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = '';
    this.selectedDateRange = '';
    this.filteredOrders = [...this.orders];
  }

  updateOrderStatus(order: Order, newStatus: string): void {
    const index = this.orders.findIndex(o => o.id === order.id);
    if (index !== -1) {
      this.orders[index].status = newStatus as any;
      this.applyFilters();
    }
  }

  deleteOrder(order: Order): void {
    if (confirm(`Are you sure you want to delete order ${order.id}?`)) {
      this.orders = this.orders.filter(o => o.id !== order.id);
      this.applyFilters();
    }
  }

}
