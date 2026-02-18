import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Badge } from '../../../../shared/components/badge/badge';
import { Product } from '../../../../core/models/product';
import { CartServices } from '../../../../core/services/cart/cart-services';
import { TranslationService } from '../../../../core/services/translation/translation.service';

@Component({
  selector: 'app-product-card',
  imports: [CommonModule, RouterModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cartService = inject(CartServices);
  private translationService = inject(TranslationService);

  @Input() product!: Product;
  @Input() clickable: boolean = false;
  @Output() productSelected = new EventEmitter<number>();

  translations = this.translationService.translations;


  // isWishlisted = false;

  // toggleWishlist(event: Event): void {
  //   event.preventDefault();
  //   event.stopPropagation();
  //   this.isWishlisted = !this.isWishlisted;
  // }

  get productImageUrl(): string {
    return this.product.mainImage || '/product-placeholder.png';
  }

  addToCart(): void {
    // console.log(`Added ${this.quantity} of ${this.product?.name} to cart`);
    // Implementazione aggiunta al carrello
    if (!this.product) return;

    this.cartService.addToCart(this.product, 1);
  }

  buyNow(event?: Event): void {
    // Stop event propagation to prevent navigation to product details
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.addToCart();
    setTimeout(() => {
      this.router.navigate(['/client/cart']);
    }, 500);
  }

  onCardClick(event: Event): void {
    if (this.clickable) {
      event.preventDefault();
      event.stopPropagation();
      this.productSelected.emit(this.product.id);
    }
  }

  getProductCardImage(): string {
    if (!this.product.mainImage) {
      return '/product-placeholder.png';
    }
    return this.product.mainImage;
  }
}
