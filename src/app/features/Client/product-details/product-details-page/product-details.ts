import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClientHeader } from '../../layout/client-header/client-header';
import { ClientFooter } from '../../layout/client-footer/client-footer';
import { ProductCard } from '../../homepage/components/product-card/product-card';
import { Badge } from '../../../../shared/components/badge/badge';
import { ProductServices } from '../../../../core/services/product/product-services';
import { Product } from '../../../../core/models/product';

@Component({
  selector: 'app-product-detail',
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ClientHeader,
    ClientFooter,
    ProductCard
  ],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails implements OnInit {
  private productService = inject(ProductServices);
  private route = inject(ActivatedRoute);

  product: Product | null = null;
  relatedProducts: Product[] = [];
  quantity = 1;
  selectedColor: string = '';
  isWishlisted = false;
  loading = this.productService.isLoading;
  selectedImageIndex = 0;

  productImages: string[] = [];

  breadcrumbs: Array<{ label: string; path: string }> = [
    { label: 'Home', path: '/' }
  ];

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productId = params['id'];
      this.loadProduct(productId);
    });
  }

  async loadProduct(id: string): Promise<void> {
    // this.loading = true;
    this.productService.loadCatalogData();
    const allProducts = this.productService.products();
    this.product = allProducts.find(p => p.id === id) || null;

    if (this.product) {
      this.productImages = [
        this.product.image || 'https://via.placeholder.com/500x500?text=Product',
        'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&h=500&fit=crop'
      ];

      // Set breadcrumbs
      this.breadcrumbs.push(
        { label: this.product.category, path: `/category/${this.product.category}` },
        { label: this.product.name, path: `/product/${this.product.id}` }
      );

      // Load related products
      this.relatedProducts = allProducts
        .filter(p => p.category === this.product?.category && p.id !== this.product?.id)
        .slice(0, 4);
    }

    // this.loading = false;
  }

  toggleWishlist(): void {
    this.isWishlisted = !this.isWishlisted;
  }

  incrementQuantity(): void {
    if (this.product && this.quantity < this.product.stock) {
      this.quantity++;
    }
  }

  decrementQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    console.log(`Added ${this.quantity} of ${this.product?.name} to cart`);
    // Implementazione aggiunta al carrello
  }

  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }

  get currentImage(): string {
    return this.productImages[this.selectedImageIndex] || this.product?.image || '';
  }

}
