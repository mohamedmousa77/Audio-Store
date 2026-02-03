import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminSidebar } from '../layout/admin-sidebar/admin-sidebar';
import { AdminHeader } from '../layout/admin-header/header';
import { DashboardStats } from '../../../core/models/DashboardStats';
import { StatCard } from '../components/stat-card/stat-card';
import { RecentOrders } from '../orders-manage/recent-orders/recent-orders';
import { CategoryStats } from '../categories-manage/category-stats/category-stats';
import { TopProductsDashboardManage } from '../../admin/products-manage/top-products-dashboard/products-manage';
import { OrderServices } from '../../../core/services/order/order-services';

/**
 * Admin Dashboard Component
 * Updated to integrate OrderServices for recent orders
 * 
 * Changes:
 * - Loads recent orders from API (5 most recent)
 * - Passes orders to RecentOrders component
 * - Keeps hardcoded stats for now (future: DashboardApiService)
 */
@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    AdminSidebar,
    AdminHeader,
    StatCard,
    RecentOrders,
    CategoryStats,
    TopProductsDashboardManage
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardPageComponent implements OnInit {
  private orderService = inject(OrderServices);

  // Use Signals from OrderServices for recent orders
  recentOrders = this.orderService.orders;
  loading = this.orderService.loadingSignal;

  // Mock data for demonstration purposes (keep for now)
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
    }
  ];

  ordersStatusData = [
    { label: 'Delivered', percentage: 65, count: 810, color: '#10b981' },
    { label: 'Shipped', percentage: 20, count: 250, color: '#3b82f6' },
    { label: 'Pending', percentage: 10, count: 125, color: '#f49d25' },
    { label: 'Returned', percentage: 5, count: 60, color: '#ef4444' }
  ];

  categoryStats = [
    { name: 'Headphones', value: 435, percentage: 35, color: '#f49d25' },
    { name: 'Speakers', value: 298, percentage: 50, color: '#3b82f6' },
    { name: 'Microphones', value: 186, percentage: 15, color: '#10b981' },
  ];

  topProducts = [
    {
      name: 'Sony WH-1000XM5',
      category: 'Headphones',
      stockStatus: 'In Stock',
      price: '$349.00',
      sales: 124,
      icon: 'headphones',
      brand: 'Apple',
      image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop'

    },
    {
      name: 'Yeti Blue Mic',
      category: 'Microphones',
      stockStatus: 'Low Stock',
      price: '$129.99',
      sales: 89,
      icon: 'mic',
      brand: 'KRK Systems',
      image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=400&fit=crop'
    },
    {
      name: 'JBL Flip 6',
      category: 'Speakers',
      stockStatus: 'In Stock',
      price: '$99.95',
      sales: 76,
      icon: 'speaker',
      brand: 'Logitech',
      image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=400&fit=crop'
    },
    {
      name: 'AirPods Pro 2',
      category: 'Headphones',
      stockStatus: 'Out of Stock',
      price: '$249.00',
      sales: 54,
      icon: 'headphones',
      brand: 'Sony',
      image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&h=400&fit=crop'
    }
  ];

  async ngOnInit(): Promise<void> {
    // Load recent orders (5 most recent)
    await this.orderService.loadAllOrders({ pageSize: 5, page: 1 });
  }
}