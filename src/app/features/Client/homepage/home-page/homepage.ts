import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientFooter } from '../../layout/client-footer/client-footer';
import { ClientHeader } from '../../layout/client-header/client-header';
import { ProductServices } from '../../../../core/services/product/product-services';
import { CategoryServices } from '../../../../core/services/category/category-services';
import { NewsletterSignup } from '../components/newsletter-signup/newsletter-signup';
import { CategoryShowcase } from '../components/category-showcase/category-showcase';
import { HeroBanner } from '../components/hero-banner/hero-banner';
import { FeaturedProducts } from '../components/featured-products/featured-products';
import { Product } from '../../../../core/models/product';
import { Category } from '../../../../core/models/category';

/**
 * Homepage Component
 * Optimized to load only necessary data:
 * - 1 new product (for hero banner)
 * - 3 featured products
 * - 3 top categories
 */
@Component({
  selector: 'app-homepage',
  imports: [
    CommonModule,
    NewsletterSignup,
    CategoryShowcase,
    ClientHeader,
    ClientFooter,
    HeroBanner,
    FeaturedProducts
  ],
  templateUrl: './homepage.html',
  styleUrl: './homepage.css',
})
export class Homepage implements OnInit {
  private productService = inject(ProductServices);
  private categoryService = inject(CategoryServices);

  // Local state for HomePage-specific data
  newProduct = signal<Product | undefined>(undefined);
  featuredProducts = signal<Product[]>([]);
  topCategories = signal<Category[]>([]);

  // Loading/error states
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  // Computed values
  hasData = computed(() =>
    this.newProduct() !== undefined ||
    this.featuredProducts().length > 0 ||
    this.topCategories().length > 0
  );

  ngOnInit(): void {
    this.loadHomePageData();
  }

  /**
   * Load optimized data for HomePage
   * Only loads: 1 new product + 3 featured products + 3 categories
   */
  async loadHomePageData(): Promise<void> {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      // Execute all API calls in parallel for better performance
      const [newProduct, featuredProducts, topCategories] = await Promise.all([
        this.productService.loadNewProduct(),           // 1 product
        this.productService.loadFeaturedProducts(3),    // 3 products
        this.categoryService.loadTopCategories(3)       // 3 categories
      ]);

      // Update local state
      this.newProduct.set(newProduct);
      this.featuredProducts.set(featuredProducts);
      this.topCategories.set(topCategories);

      console.log('✅ HomePage data loaded:', {
        newProduct: newProduct?.name,
        featuredCount: featuredProducts.length,
        categoriesCount: topCategories.length
      });
    } catch (error) {
      console.error('Failed to load HomePage data:', error);
      this.error.set('Errore nel caricamento dei dati');
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Retry loading data (called from error state in template)
   */
  retryLoad(): void {
    this.loadHomePageData();
  }
}
