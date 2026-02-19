import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminSidebar } from '../layout/admin-sidebar/admin-sidebar';
import { AdminHeader } from '../layout/admin-header/header';
import { StatCard } from '../components/stat-card/stat-card';
import { RecentOrders } from '../orders-manage/recent-orders/recent-orders';
import { CategoryStats } from '../categories-manage/category-stats/category-stats';
import { TopProductsDashboardManage } from '../../admin/products-manage/top-products-dashboard/products-manage';
import { OrderServices } from '../../../core/services/order/order-services';
import { DashboardServices } from '../../../core/services/dashboard/dashboard-services';
import { TranslationService } from '../../../core/services/translation/translation.service';
import { RouterModule } from '@angular/router';

/**
 * Admin Dashboard Component
 * Updated to use DashboardServices for real-time statistics
 * 
 * Changes:
 * - Loads dashboard stats from API via DashboardServices
 * - Loads recent orders from OrderServices
 * - Removed all hardcoded data
 * - Uses Signals for reactive state management
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
    TopProductsDashboardManage,
    RouterModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardPageComponent implements OnInit {
  private orderService = inject(OrderServices);
  private dashboardService = inject(DashboardServices);
  private translationService = inject(TranslationService);

  // Use Signals from services
  recentOrders = this.orderService.orders;
  dashboardStats = this.dashboardService.stats;
  loading = this.dashboardService.loading;
  error = this.dashboardService.error;
  ordersLoading = this.orderService.loadingSignal;
  translations = this.translationService.translations;

  // Computed stats for stat cards
  stats = computed(() => {
    const data = this.dashboardStats();
    if (!data) return [];

    return [
      {
        label: 'totalSales',
        value: `€${data.totalSales.toFixed(2)}`,
        trend: '', // Backend doesn't provide trend
        icon: 'payments',
        color: 'green'
      },
      {
        label: 'totalOrders',
        value: data.totalOrders.toString(),
        trend: '',
        icon: 'shopping_bag',
        color: 'blue'
      },
      {
        label: 'totalCustomers',
        value: data.totalCustomers.toString(),
        trend: '',
        icon: 'group',
        color: 'orange'
      }
    ];
  });

  // Computed orders status data for chart
  ordersStatusData = computed(() => {
    const data = this.dashboardStats();
    if (!data) return [];

    const total = data.ordersByStatus.pending +
      data.ordersByStatus.processing +
      data.ordersByStatus.shipped +
      data.ordersByStatus.delivered +
      data.ordersByStatus.cancelled;

    if (total === 0) return [];

    return [
      {
        label: this.translations().dashboard.orderByStatus.status.delivered,
        count: data.ordersByStatus.delivered,
        percentage: Math.round((data.ordersByStatus.delivered / total) * 100),
        color: '#10b981'
      },
      {
        label: this.translations().dashboard.orderByStatus.status.shipped,
        count: data.ordersByStatus.shipped,
        percentage: Math.round((data.ordersByStatus.shipped / total) * 100),
        color: '#3b82f6'
      },
      {
        label:this.translations().dashboard.orderByStatus.status.pending,
        count: data.ordersByStatus.pending,
        percentage: Math.round((data.ordersByStatus.pending / total) * 100),
        color: '#f49d25'
      },
      {
        label: this.translations().dashboard.orderByStatus.status.processing,
        count: data.ordersByStatus.processing,
        percentage: Math.round((data.ordersByStatus.processing / total) * 100),
        color: '#8b5cf6'
      },
      {
        label: this.translations().dashboard.orderByStatus.status.cancelled,
        count: data.ordersByStatus.cancelled,
        percentage: Math.round((data.ordersByStatus.cancelled / total) * 100),
        color: '#ef4444'
      }
    ]
  });

  // Computed category stats for chart
  categoryStats = computed(() => {
    const data = this.dashboardStats();
    if (!data || !data.topCategories.length) return [];

    const maxRevenue = Math.max(...data.topCategories.map(c => c.totalRevenue));

    return data.topCategories.map((cat, index) => ({
      name: cat.categoryName,
      value: cat.totalQuantitySold,
      percentage: maxRevenue > 0 ? Math.round((cat.totalRevenue / maxRevenue) * 100) : 0,
      color: this.getCategoryColor(index)
    }));
  });

  // Computed top products
  topProducts = computed(() => {
    const data = this.dashboardStats();
    if (!data || !data.topProducts.length) return [];

    return data.topProducts.map(product => ({
      productId: product.productId,
      productName: product.productName,
      categoria: product.categoria,
      stockStatus: product.stockStatus,
      totalRevenue: `€${product.totalRevenue}`,
      totalQuantitySold: product.totalQuantitySold,
      brand: product.brand,
      productImage: product.productImage || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    }));
  });

  async ngOnInit(): Promise<void> {
    // Load dashboard stats and recent orders in parallel
    await Promise.all([
      this.dashboardService.loadDashboardStats(),
      this.orderService.loadAllOrders({ pageSize: 5, page: 1 })
    ]);
  }

  /**
  * Get color for category chart based on index
  */
  private getCategoryColor(index: number): string {
    const colors = ['#f49d25', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444', '#06b6d4'];
    return colors[index % colors.length];
  }

}