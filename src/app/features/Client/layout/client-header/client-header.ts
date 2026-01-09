import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ProductServices } from '../../../../core/services/product/product-services';
import { AuthServices } from '../../../../core/services/auth/auth-services';
import { FormsModule } from '@angular/forms';
import { CartServices } from '../../../../core/services/cart/cart-services';
import { Cart } from '../../../../core/models/cart';

@Component({
  selector: 'app-client-header',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './client-header.html',
  styleUrl: './client-header.css',
})
export class ClientHeader {
  private cartService = inject(CartServices);
  private productService = inject(ProductServices);
  private router = inject(Router);

  cart: Cart = {
    items: [],
    totalItems: 0,
    totalPrice: 0
  };
  
  searchTerm = '';
  mobileMenuOpen = false;
  cartItemCount = 2; // Mock
  isLoggedIn = false; // Mock

  categories = [
    { name: 'Headphones', path: '/category/Headphones' },
    { name: 'Speakers', path: '/category/Speakers' },
    // { name: 'Microphones', path: '/category/Microphones' },
    { name: 'Earphones', path: '/category/Earphones' }
  ];

  ngAfterViewInit() {
    // Inizializza il widget solo quando l'HTML è pronto nel DOM
    this.initGoogleTranslate();
  }

  initGoogleTranslate() {
    // @ts-ignore
    if (window.google && window.google.translate) {
      // @ts-ignore
      new window.google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'it,en,fr,de',
        layout: 0, // 0 corrisponde a InlineLayout.SIMPLE
        autoDisplay: false
      }, 'google_translate_element');
    }
  }

  ngOnInit(): void {
    // Load categories
    this.productService.categories();
    this.cartService.getCart().subscribe(cart => {
      this.cart = cart;
    });

  }

  goToCart(): void {
    this.router.navigate(['/client/cart']);
  }

  goToHome(): void {
    this.router.navigate(['/client/home']);
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
