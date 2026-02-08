import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartServices } from '../../../../core/services/cart/cart-services';
import { ClientHeader } from '../../layout/client-header/client-header';
import { ClientFooter } from '../../layout/client-footer/client-footer';
import { TranslationService } from '../../../../core/services/translation/translation.service';

@Component({
  selector: 'app-cart-page',
  imports: [CommonModule, FormsModule, ClientHeader, ClientFooter],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.css',
})
export class CartPage implements OnInit {
  private cartService = inject(CartServices);
  private router = inject(Router);
  private translationService = inject(TranslationService);

  // Use Signals from CartServices
  cart = this.cartService.cart;
  items = this.cartService.items;
  totalItems = this.cartService.totalItems;
  totalAmount = this.cartService.totalAmount;
  subtotal = this.cartService.subtotal;
  tax = this.cartService.tax;
  shippingCost = this.cartService.shippingCost;
  isEmpty = this.cartService.isEmpty;

  // Translations
  translations = this.translationService.translations;

  loading = this.cartService.loadingSignal;
  error = this.cartService.errorSignal;

  ngOnInit(): void {
    // Scroll to top when cart page loads
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    // Load cart data
    this.loadCart();
  }

  /**
   * Load cart from API
   */
  async loadCart(): Promise<void> {
    await this.cartService.loadCart();
    console.log('Cart loaded:', this.cart(), 'Total Items:', this.totalItems(), 'Total Amount:', this.totalAmount(), 'Subtotal:', this.subtotal(), 'Tax:', this.tax(), 'Shipping Cost:', this.shippingCost());
  }

  /**
   * Update item quantity
   * @param itemId Cart item ID (number)
   * @param newQuantity New quantity
   */
  async updateQuantity(itemId: number, newQuantity: number): Promise<void> {
    if (newQuantity < 1) {
      // If quantity is 0 or less, remove item
      await this.removeItem(itemId);
      return;
    }

    await this.cartService.updateQuantity(itemId, newQuantity);
  }

  /**
   * Remove item from cart
   * @param itemId Cart item ID (number)
   */
  async removeItem(itemId: number): Promise<void> {
    const confirmed = confirm('Vuoi rimuovere questo prodotto dal carrello?');
    if (confirmed) {
      await this.cartService.removeFromCart(itemId);
    }
  }

  /**
   * Clear entire cart
   */
  async clearCart(): Promise<void> {
    const confirmed = confirm('Vuoi svuotare completamente il carrello?');
    if (confirmed) {
      await this.cartService.clearCart();
    }
  }

  /**
   * Navigate to home page
   */
  continueShopping(): void {
    this.router.navigate(['/client/home']);
  }

  /**
   * Navigate to checkout
   */
  proceedToCheckout(): void {
    if (!this.isEmpty()) {
      this.router.navigate(['/client/checkout']);
    }
  }
}
