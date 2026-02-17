import { Component, inject, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TranslationService } from '../../../../core/services/translation/translation.service';

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
   adminName = 'Admin User';
   adminEmail = 'admin@audiostore.com';
  private translationService = inject(TranslationService);

  currentLanguage = this.translationService.currentLanguage;
  translations = this.translationService.translations;

  constructor() {
    effect(() => {
    // depend on the signal
    const lang = this.translationService.currentLanguage(); 
    // update the UI text
    // this.updatePageInfo(this.router.url);
  });
  }

  // navigation: NavigationItem[] = [
  //   { label: this.translations().admin.dashboard, icon: 'dashboard', path: '/admin/dashboard' },
  //   { label:  this.translations().admin.products, icon: 'inventory_2', path: '/admin/products' },
  //   { label:  this.translations().admin.orders, icon: 'shopping_cart', path: '/admin/orders' },
  //   { label:  this.translations().admin.customers, icon: 'group', path: '/admin/customers' },
  //   { label:  this.translations().admin.categories, icon: 'category', path: '/admin/categories' }
  // ];

  navigation = computed(() => [
    { label: this.translations().admin.dashboard, icon: 'dashboard', path: '/admin/dashboard' },
    { label: this.translations().admin.products, icon: 'inventory_2', path: '/admin/products' },
    { label: this.translations().admin.orders, icon: 'shopping_cart', path: '/admin/orders' },
    { label: this.translations().admin.customers, icon: 'group', path: '/admin/customers' },
    { label: this.translations().admin.categories, icon: 'category', path: '/admin/categories' }
  ]);

  onLogout(): void {
    
  }
}
