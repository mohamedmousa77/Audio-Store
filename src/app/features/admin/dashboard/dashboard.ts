import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminSidebar } from '../layout/admin-sidebar/admin-sidebar';
import { AdminHeader } from '../layout/header/header';

import { DashboardStats } from '../../../core/models/DashboardStats';
import { Order } from '../../../core/models/order';

import { StatCard } from '../components/stat-card/stat-card';
import { adminGuard } from '../../../core/guards/admin-guard';
import { RecentOrders } from '../components/recent-orders/recent-orders';
import { CategoryStats } from '../components/category-stats/category-stats';
@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    AdminSidebar,
    AdminHeader,
    StatCard,
    RecentOrders,
    CategoryStats

  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardPageComponent implements OnInit {
  // Mock data for demonstration purposes
  stats: DashboardStats[] = [
    { 
      label: 'Total Sales', 
      value: '$48,250', 
      trend: '+12.5%', 
      icon: 'payments', 
      color: 'green' 
    },
    { 
      label: 'Total Orders', 
      value: '1,245', 
      trend: '+5.2%', 
      icon: 'shopping_bag', 
      color: 'blue' 
    },
    { 
      label: 'Active Customers', 
      value: '892', 
      trend: '0.0%', 
      icon: 'group', 
      color: 'orange' 
    },
    { 
      label: 'Pending Reviews', 
      value: '14', 
      trend: '+3 New', 
      icon: 'reviews', 
      color: 'purple' 
    }
  ];

  recentOrders: Order[] = [
    { 
      id: '#ORD-7752', 
      date: 'Oct 24, 2023',
      customerName: 'Alex Morgan', 
      customerEmail: 'alex.m@example.com',
      total: '$478.95', 
      status: 'Shipped',
      time: '2 mins ago' 
    },
    { 
      id: '#ORD-7751', 
      date: 'Oct 23, 2023',
      customerName: 'Sarah Jenkins', 
      customerEmail: 's.jenkins@test.com',
      total: '$129.99', 
      status: 'Delivered',
      time: '1 hour ago' 
    },
    { 
      id: '#ORD-7750', 
      date: 'Oct 23, 2023',
      customerName: 'Michael Chen', 
      customerEmail: 'mchen88@gmail.com',
      total: '$1,299.00', 
      status: 'Processing',
      time: '3 hours ago' 
    },
    { 
      id: '#ORD-7749', 
      date: 'Oct 22, 2023',
      customerName: 'Emily Miller', 
      customerEmail: 'emily.m@studio.com',
      total: '$59.95', 
      status: 'Delivered',
      time: '5 hours ago' 
    }
  ];

  categoryStats = [
    { name: 'Headphones', value: 435, percentage: 35, color: '#f49d25' },
    { name: 'Speakers', value: 298, percentage: 24, color: '#3b82f6' },
    { name: 'Microphones', value: 186, percentage: 15, color: '#10b981' },
    { name: 'Accessories', value: 326, percentage: 26, color: '#8b5cf6' }
  ];

  ngOnInit(): void {
    // In futuro: caricare dati da API
  }


}