import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Badge } from '../../../../../shared/components/badge/badge';
import { Product } from '../../../../../core/models/product';

@Component({
  selector: 'app-product-card',
  imports: [CommonModule, RouterModule, Badge],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  @Input() product!: Product;

  isWishlisted = false;

  toggleWishlist(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.isWishlisted = !this.isWishlisted;
  }

  get productImageUrl(): string {
    return this.product.image || 'https://via.placeholder.com/400x400?text=No+Image';
  }
}
