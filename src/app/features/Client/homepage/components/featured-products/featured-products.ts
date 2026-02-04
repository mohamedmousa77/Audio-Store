import { Component, Input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ProductCard } from '../../../layout/product-card/product-card';
import { Product } from '../../../../../core/models/product';

/**
 * Featured Products Component
 * Updated to accept products via @Input() from parent
 * 
 * Breaking Changes:
 * - Now accepts products via @Input() (not from service)
 * - Product ID is number (not string)
 */
@Component({
  selector: 'app-featured-products',
  imports: [CommonModule, RouterModule, ProductCard],
  templateUrl: './featured-products.html',
  styleUrl: './featured-products.css',
})
export class FeaturedProducts {
  private router = inject(Router);
  // Loading is managed by the parent HomePage; start as not loading here
  loading = signal<boolean>(false);

  /**
   * Featured products to display
   * Passed from parent Homepage component
   */
  @Input() products: Product[] = [];

  /**
   * Navigate to product details page
   * @param productId Product ID (number)
   */
  goToProduct(productId: number): void {
    this.router.navigate(['/client/product', productId]);
  }
}
