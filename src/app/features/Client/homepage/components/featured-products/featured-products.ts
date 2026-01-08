import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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

  featuredProducts = this.productService.featured
  loading = this.productService.isLoading;

  // ngOnInit(): void {
  //   this.loadFeaturedProducts();
  // }

  // async loadFeaturedProducts(): Promise<void> {
  //   this.loading = true;
  //   await this.productService.products;
  //   this.featuredProducts = this.productService.featured;
  //   this.loading = false;
  // }


}
