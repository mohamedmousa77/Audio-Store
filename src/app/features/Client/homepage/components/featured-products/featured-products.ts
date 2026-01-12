import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ProductCard } from '../../../layout/product-card/product-card';
import { ProductServices } from '../../../../../core/services/product/product-services';

@Component({
  selector: 'app-featured-products',
  imports: [CommonModule, RouterModule, ProductCard],
  templateUrl: './featured-products.html',
  styleUrl: './featured-products.css',
})
export class FeaturedProducts {
  private productService = inject(ProductServices);
  private router = inject(Router);

  featuredProducts = this.productService.featured;
  loading = this.productService.isLoading;

  goToProduct(productId: string) {
    (this.router as Router).navigate(['/client/product', productId]);
  }
}
