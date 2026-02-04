import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ProductServices } from '../../../../core/services/product/product-services';
import { AuthServices } from '../../../../core/services/auth/auth-services';
import { CategoryServices } from '../../../../core/services/category/category-services';
import { FormsModule } from '@angular/forms';
import { CartServices } from '../../../../core/services/cart/cart-services';

@Component({
  selector: 'app-client-header',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './client-header.html',
  styleUrl: './client-header.css',
})
export class ClientHeader implements OnInit {
  private cartService = inject(CartServices);
  private productService = inject(ProductServices);
  private categoryService = inject(CategoryServices);
  private authService = inject(AuthServices);
  private router = inject(Router);

  // Use Signals from Services
  categories = this.categoryService.categories;
  // Cart item count reacts to both guest and authenticated carts
  cartItemCount = this.cartService.totalItems;

  searchTerm = '';
  mobileMenuOpen = false;
  isLoggedIn = false;

  ngOnInit(): void {
    // Load categories
    this.categoryService.loadCategories();

    // Initialize authentication state
    this.isLoggedIn = this.authService.isAuthenticated();
    this.authService.isAuthenticated$.subscribe(isAuth => {
      this.isLoggedIn = isAuth;
    });
  }

  goToCart(): void {
    this.router.navigate(['/client/cart']);
  }

  Navigate(): void {
    this.router.navigate(['/client/profile']);
  }

  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.productService.setSearch(this.searchTerm);
      this.router.navigate(['/category', 'all']);
    }
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }


}
