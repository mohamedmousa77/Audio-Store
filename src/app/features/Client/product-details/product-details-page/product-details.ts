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
import { TranslationService } from '../../../../core/services/translation/translation.service';

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
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductServices);
  private categoryService = inject(CategoryServices);
  private cartService = inject(CartServices);
  private translationService = inject(TranslationService);

  // Translations
  translations = this.translationService.translations;

  product: Product | null = null;
  relatedProducts: Product[] = [];
  quantity = 1;
  selectedColor: string = '';
  loading = false;
  selectedImageIndex = 0;

  notificationMessage: string = '';
  showNotification: boolean = false;
  addedToCart: boolean = false;
  activeTab: string = 'description';

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

  async loadProduct(id: number): Promise<void> {
    this.loading = true;
    console.log('Loading product with ID:', id);
    try {
      // Load categories only if not already loaded (caching)
      if (this.categoryService.categories().length === 0) {
        await this.categoryService.loadCategories();
      }

      // Load catalog data only if not already loaded (caching)
      const allProducts = this.productService.products();
      if (allProducts.length === 0) {
        await this.productService.loadCatalogData();
      }

      // Get product details - this will check store first, then API if needed
      const product = await this.productService.getProductDetails(id);

      if (product) {
        this.product = product;
        console.log('Found product:', this.product);

        // Setup product images - mainImage first, then gallery images
        this.productImages = [];
        if (this.product.mainImage) {
          this.productImages.push(this.product.mainImage);
        }
        if (this.product.galleryImages?.length) {
          this.productImages.push(...this.product.galleryImages);
        }

        // Get category name
        const categoryName = this.product.categoryName || this.getCategoryName(this.product.categoryId);

        // Set breadcrumbs
        this.breadcrumbs = [
          { label: 'Home', path: '/' },
          { label: categoryName, path: `/client/category/${this.product.categoryId}` },
          { label: this.product.name, path: `/client/product/${this.product.id}` }
        ];

        // Load related products from already loaded catalog
        const products = this.productService.products();
        this.relatedProducts = products
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

  incrementQuantity(): void {
    if (this.product && this.quantity < this.product.stockQuantity) {
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

  /**
   * Scroll to a specific section on the page
   */
  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  /**
   * Check if product has features/specs
   */
  get hasFeatures(): boolean {
    return !!(this.product?.specifications && this.product.specifications.trim().length > 0);
  }

  /**
   * Parse specifications string into structured lines
   * Handles formats like "Key: Value" separated by newlines or periods
   */
  get specLines(): { label: string; value: string }[] {
    if (!this.product?.specifications) return [];
    return this.product.specifications
      .split(/[\n]/) // split by newlines
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => {
        const colonIndex = line.indexOf(':');
        if (colonIndex > 0) {
          return {
            label: line.substring(0, colonIndex).trim(),
            value: line.substring(colonIndex + 1).trim()
          };
        }
        return { label: '', value: line };
      });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    this.scrollToSection(tab);
  }

}
