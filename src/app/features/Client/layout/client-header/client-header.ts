import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductServices } from '../../../../core/services/product/product-services';
import { AuthServices } from '../../../../core/services/auth/auth-services';

@Component({
  selector: 'app-client-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './client-header.html',
  styleUrl: './client-header.css',
})
export class ClientHeader {
  private productService = inject(ProductServices);
  private authService = inject(AuthServices);

  // Signals reattivi dal Core
  categories = this.productService.categories;
  isLoggedIn = signal(this.authService.isLoggedIn); // Placeholder per logica auth
  
  // Esempio count carrello (da collegare a CartService in futuro)
  cartCount = signal(0);
  
  isMobileMenuOpen = signal(false);

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(v => !v);
  }

}
