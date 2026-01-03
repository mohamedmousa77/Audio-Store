import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthApi } from '../../../auth/services/auth-api';

interface NavigationItem {
  label: string;
  icon: string;
  path: string;
}

@Component({
  selector: 'app-admin-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-sidebar.html',
  styleUrl: './admin-sidebar.css',
})
export class AdminSidebar {
    private authService = inject(AuthApi);
  private router = inject(Router);

  navigation: NavigationItem[] = [
    { label: 'Dashboard', icon: 'dashboard', path: '/admin/dashboard' },
    { label: 'Products', icon: 'inventory_2', path: '/admin/products' },
    { label: 'Orders', icon: 'shopping_cart', path: '/admin/orders' },
    { label: 'Customers', icon: 'group', path: '/admin/customers' },
    { label: 'Categories', icon: 'category', path: '/admin/categories' }
  ];

  onLogout(): void {
    if (confirm('Are you sure you want to logout?')) {
      this.authService.logout();
    }
  }
}
