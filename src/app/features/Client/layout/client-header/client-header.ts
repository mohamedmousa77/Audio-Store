import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ProductServices } from '../../../../core/services/product/product-services';
import { AuthServices } from '../../../../core/services/auth/auth-services';
import { FormsModule } from '@angular/forms';
import { CartServices } from '../../../../core/services/cart/cart-services';
import { TranslationService } from '../../../../core/services/translation/translation.service';
import { Product } from '../../../../core/models/product';

@Component({
  selector: 'app-client-header',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './client-header.html',
  styleUrl: './client-header.css',
})
export class ClientHeader implements OnInit {
  private cartService = inject(CartServices);
  private productService = inject(ProductServices);
  private authService = inject(AuthServices);
  private router = inject(Router);
  private translationService = inject(TranslationService);

  
  cartItemCount = this.cartService.totalItems;

  // Translation signals
  currentLanguage = this.translationService.currentLanguage;
  translations = this.translationService.translations;

  searchTerm = '';
  mobileMenuOpen = false;
  isLoggedIn = false;

  // Search dropdown
  searchResults = signal<Product[]>([]);
  showDropdown = false;
  isSearching = false;

  ngOnInit(): void {
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
    if (this.searchTerm.trim().toLowerCase()) {
      this.closeDropdown();
      this.productService.setSearch(this.searchTerm);
      this.router.navigate(['/category', 'all']);
    }
  }

  onSearchInput(): void {
    const term = this.searchTerm.trim();

    if (term.length < 2) {
      this.searchResults.set([]);
      this.showDropdown = false;
      return;
    }

    this.isSearching = true;
    this.showDropdown = true;

    // Filter products based on search term
    const allProducts = this.productService.products();
    const filtered = allProducts.filter(product =>
      product.name.toLowerCase().includes(term.toLowerCase()) ||
      product.description?.toLowerCase().includes(term.toLowerCase()) ||
      product.categoryName?.toLowerCase().includes(term.toLowerCase())
    ).slice(0, 5);

    this.searchResults.set(filtered);
    this.isSearching = false;
  }

  navigateToProduct(productId: number): void {
    this.closeDropdown();
    this.searchTerm = '';
    this.router.navigate(['/client/product', productId]);
  }

  closeDropdown(): void {
    this.showDropdown = false;
    this.searchResults.set([]);
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  toggleLanguage(): void {
    this.translationService.toggleLanguage();
  }

  translate(key: string): string {
    return this.translationService.translate(key);
  }

  getLanguageCode(): string {
    return this.translationService.getLanguageCode();
  }
}
