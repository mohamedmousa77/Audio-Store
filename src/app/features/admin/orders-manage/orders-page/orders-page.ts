import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminSidebar } from '../../layout/admin-sidebar/admin-sidebar';
import { AdminHeader } from '../../layout/admin-header/header';
import { OrderForm } from '../order-form/order-form';
import { Badge } from '../../../../shared/components/badge/badge';
import { Order } from '../../../../core/models/order';

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
orders: Order[] = [
    {
      id: '#ORD-7752',
      date: '2024-01-15',
      customerName: 'Alex Morgan',
      customerEmail: 'alex.m@example.com',
      total: '$478.95',
      status: 'shipped',
      time: '2 mins ago',

    },
    {
      id: '#ORD-7751',
      date: '2024-01-14',
      customerName: 'Sarah Jenkins',
      customerEmail: 's.jenkins@test.com',
      total: '$129.99',
      status: 'delivered',
      time: '1 hour ago'
    },
    {
      id: '#ORD-7750',
      date: '2024-01-14',
      customerName: 'Michael Chen',
      customerEmail: 'mchen88@gmail.com',
      total: '$1,299.00',
      status: 'pending',
      time: '3 hours ago'
    },
    {
      id: '#ORD-7749',
      date: '2024-01-13',
      customerName: 'Emily Miller',
      customerEmail: 'emily.m@studio.com',
      total: '$59.95',
      status: 'delivered',
      time: '5 hours ago'
    },
    {
      id: '#ORD-7748',
      date: '2024-01-13',
      customerName: 'James Wilson',
      customerEmail: 'james.w@music.com',
      total: '$899.50',
      status: 'pending',
      time: '8 hours ago'
    },
    {
      id: '#ORD-7747',
      date: '2024-01-12',
      customerName: 'Lisa Brown',
      customerEmail: 'lisa.b@pro.com',
      total: '$249.99',
      status: 'canceled',
      time: '1 day ago'
    }
  ];

  showDetail = false;
  selectedOrder: any = null;
  filteredOrders: Order[] = [];
  searchTerm = '';
  selectedStatus = '';
  selectedDateRange = '';

  ngOnInit(): void {
    this.filteredOrders = [...this.orders];
    this.selectOrder(this.orders[0]);
  }

  selectOrder(order: any): void {
    this.selectedOrder = order;
    this.showDetail = true;
    this.scrollToDetail();
  }

  private scrollToDetail(): void {
    setTimeout(() => {
      const element = document.getElementById('order-detail-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  updateStatus(newStatus: string) {
    if (this.selectedOrder) {
      this.selectedOrder.status = newStatus;
      // Qui andrebbe la chiamata API per salvare
    }
  }

  onStatusChange(order: Order, event: any): void {
    const newStatus = event.target.value;
    this.updateOrderStatus(order, newStatus);
  }
  
  getShippedCount(): number {
    return this.orders.filter(order => order.status === 'shipped').length;
  }

  applyFilters(): void {
    this.filteredOrders = this.orders.filter(order => {
      const matchesSearch = order.id.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           order.customerName!.toLowerCase().includes(this.searchTerm.toLowerCase());
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

  handleCancel(): void {
    this.selectedOrder = null; // Nasconde il form
    this.showDetail = false;
    // Scorrimento fluido verso l'inizio della pagina
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

}
