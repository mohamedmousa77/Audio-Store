import { Component, inject, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TranslationService } from '../../../../core/services/translation/translation.service';
import { AuthServices } from '../../../../core/services/auth/auth-services';

@Component({
  selector: 'app-admin-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-sidebar.html',
  styleUrl: './admin-sidebar.css',
})
export class AdminSidebar {
   adminName = 'Admin User';
   adminEmail = 'admin@audiostore.com';
  private translationService = inject(TranslationService);
  private authService = inject(AuthServices);
  private router = inject(Router);

  currentLanguage = this.translationService.currentLanguage;
  translations = this.translationService.translations;

  constructor() {
    effect(() => {
    // depend on the signal
    this.translationService.currentLanguage(); 
  });
  }

  navigation = computed(() => [
    { label: this.translations().admin.dashboard, icon: 'dashboard', path: '/admin/dashboard' },
    { label: this.translations().admin.products, icon: 'inventory_2', path: '/admin/products' },
    { label: this.translations().admin.orders, icon: 'shopping_cart', path: '/admin/orders' },
    { label: this.translations().admin.customers, icon: 'group', path: '/admin/customers' },
    { label: this.translations().admin.categories, icon: 'category', path: '/admin/categories' }
  ]);

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
