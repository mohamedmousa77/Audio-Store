import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { HomeBanner } from '../../../../../core/models/home-banner'
import { CartServices } from '../../../../../core/services/cart/cart-services';

@Component({
  selector: 'app-hero-banner',
  imports: [CommonModule, RouterModule],
  templateUrl: './hero-banner.html',
  styleUrl: './hero-banner.css',
})
export class HeroBanner {
  private router = inject(Router);

  banner: HomeBanner = {
    title: 'Experience Sound Like Never Before',
    product: {
      id: '1',
          name: 'Sony WH-1000XM5',
          brand: 'Sony',
          sku: 'SNY-XM5-BLK',
          category: 'Headphones',
          price: 348.0,
          stock: 12,
          status: 'Available',
          isFeatured: true,
          isNew: true,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&h=800&fit=crop',
          description: 'Industry-leading noise cancelling',
          bannerDescription: 'The ZX-900 Noise Cancelling Headphones offer premium audio quality for the true audiophile. Immerse yourself in pure acoustic bliss.'
        },
  };

  constructor(private cartService: CartServices) {}

  goToPageDetails(productId: number):void{
     (this.router as Router).navigate(['/client/product', productId]);
  }

    addToCart(): void {
  //   // THE PRODUCT IS HARD CODED FOR UI IMPLEMENTATION. ONCE API DONE SHOULL SEND THE REAL BANER-PRODUCT.
    // if (!this.banner.product) return;

    this.cartService.addToCart(this.banner.product, 1);
    setTimeout(() => {
      this.router.navigate(['/client/cart']);
    }, 500);
  }

}
