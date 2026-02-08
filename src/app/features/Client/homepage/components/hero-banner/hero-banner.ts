import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Product } from '../../../../../core/models/product';
import { CartServices } from '../../../../../core/services/cart/cart-services';
import { TranslationService } from '../../../../../core/services/translation/translation.service';

/**
 * Hero Banner Component
 * Updated to accept product via @Input() from parent
 * 
 * Breaking Changes:
 * - Now accepts product via @Input() (not hardcoded)
 * - Product ID is number (not string)
 */
@Component({
  selector: 'app-hero-banner',
  imports: [CommonModule, RouterModule],
  templateUrl: './hero-banner.html',
  styleUrl: './hero-banner.css',
})
export class HeroBanner {
  private router = inject(Router);
  private cartService = inject(CartServices);
  private translationService = inject(TranslationService);

  /**
   * Product to display in hero banner
   * Passed from parent Homepage component
   */
  @Input() product?: Product;

  translations = this.translationService.translations;

  /**
   * Navigate to product details page
   * @param productId Product ID (number)
   */
  goToPageDetails(productId: number): void {
    this.router.navigate(['/client/product', productId]);
  }

  /**
   * Add product to cart and navigate to cart page
   */
  async addToCart(): Promise<void> {
    if (!this.product) return;

    await this.cartService.addToCart(this.product, 1);

    // Navigate to cart after short delay
    setTimeout(() => {
      this.router.navigate(['/client/cart']);
    }, 500);
  }
}
