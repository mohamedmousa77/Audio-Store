import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClientHeader } from '../../layout/client-header/client-header';
import { ClientFooter } from '../../layout/client-footer/client-footer';
import { ProductCard } from '../../layout/product-card/product-card';
import { ProductServices } from '../../../../core/services/product/product-services';
import { CategoryServices } from '../../../../core/services/category/category-services';
import { Product } from '../../../../core/models/product';
import { CartServices } from '../../../../core/services/cart/cart-services';

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
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductServices,
    private categoryService: CategoryServices,
    private cartService: CartServices
  ) { }

  product: Product | null = null;
  relatedProducts: Product[] = [];
  quantity = 1;
  selectedColor: string = '';
  isWishlisted = false;
  loading = false;
  selectedImageIndex = 0;

  notificationMessage: string = '';
  showNotification: boolean = false;
  addedToCart: boolean = false;

  productImages: string[] = [];

  breadcrumbs: Array<{ label: string; path: string }> = [
    { label: 'Home', path: '/' }
  ];

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productId = params['id'];
      console.log('Product ID from URL:', productId);
      if (productId) {
        this.loadProduct(productId);
      }
    });
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  async loadProduct(id: string): Promise<void> {
    this.loading = true;
    console.log('Loading product with ID:', id);
    try {
      await this.productService.loadCatalogData();
      await this.categoryService.loadCategories();
      const allProducts = this.productService.products();
      console.log('All products:', allProducts);

      this.product = allProducts.find(p => p.id === +id) || null;
      console.log('Found product:', this.product);

      if (this.product) {
        this.productImages = [
          this.product.mainImage || 'https://via.placeholder.com/500x500?text=Product',
          'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=500&h=500&fit=crop',
          'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&h=500&fit=crop'
        ];

        // Get category name
        const categoryName = this.product.categoryName || this.getCategoryName(this.product.categoryId);

        // Set breadcrumbs
        this.breadcrumbs = [
          { label: 'Home', path: '/' },
          { label: categoryName, path: `/client/category/${this.product.categoryId}` },
          { label: this.product.name, path: `/client/product/${this.product.id}` }
        ];

        // Load related products
        this.relatedProducts = allProducts
          .filter(p => p.categoryId === this.product?.categoryId && p.id !== this.product?.id)
          .slice(0, 4);
      } else {
        console.error('Prodotto non trovato con ID:', id);
      }
    } catch (error) {
      console.error('Errore nel caricamento del prodotto:', error);
    } finally {
      this.loading = false;
    }
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
    if (!this.product) return;

    this.cartService.addToCart(this.product, this.quantity);
    this.addedToCart = true;
    this.showNotification = true;
    this.notificationMessage = `${this.product.name} added to cart!`;

    // Reset notification after 3 seconds
    setTimeout(() => {
      this.showNotification = false;
    }, 3000);

    // Reset button after 2 seconds
    setTimeout(() => {
      this.addedToCart = false;
    }, 2000);
  }

  buyNow(): void {
    this.addToCart();
    setTimeout(() => {
      this.router.navigate(['/client/cart']);
    }, 500);
  }

  goToRelatedProduct(productId: string): void {
    this.router.navigate(['/client/product', productId]);
    window.scrollTo(0, 0);
  }

  goToCategory(): void {
    this.router.navigate(['/client/category', this.product?.categoryId]);
  }

  /**
   * Get category name by ID
   */
  getCategoryName(categoryId: number): string {
    const category = this.categoryService.categories().find(c => c.id === categoryId);
    return category?.name || 'Unknown';
  }

  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }

  get currentImage(): string {
    return this.productImages[this.selectedImageIndex] || this.product?.mainImage || '';
  }

  onRelatedProductSelected(productId: number): void {
    this.router.navigate(['/client/product', productId]);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  }

}
