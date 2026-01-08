import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Badge } from '../../../../shared/components/badge/badge';
import { Product } from '../../../../core/models/product';
import { CartServices } from '../../../../core/services/cart/cart-services';

@Component({
  selector: 'app-product-card',
  imports: [CommonModule, RouterModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
    constructor(
    private route: ActivatedRoute,
    private router: Router,
    // private productService: ProductServices,
    private cartService: CartServices
  ) {}
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

    addToCart(): void {
    // console.log(`Added ${this.quantity} of ${this.product?.name} to cart`);
    // Implementazione aggiunta al carrello
     if (!this.product) return;

    this.cartService.addToCart(this.product, 1);
  }

  buyNow(): void {
    this.addToCart();
    setTimeout(() => {
      this.router.navigate(['/client/cart']);
    }, 500);
  }
}
