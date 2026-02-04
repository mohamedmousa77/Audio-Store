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
    console.log('🔄 Starting Homepage data load...');

    try {
      // Independent requests - failures in one won't block others
      const loadNewProduct = this.productService.loadNewProduct()
        .then(data => {
          this.newProduct.set(data);
          console.log('✅ New product loaded');
        })
        .catch(error => {
          console.error('❌ Error loading new product:', error);
          // Don't set global error, just log it so other parts can show
        });

      const loadFeatured = this.productService.loadFeaturedProducts(3)
        .then(data => {
          this.featuredProducts.set(data);
          console.log(`✅ Featured products loaded (${data.length})`);
        })
        .catch(error => {
          console.error('❌ Error loading featured products:', error);
        });

      const loadCategories = this.categoryService.loadTopCategories(3)
        .then(data => {
          this.topCategories.set(data);
          console.log(`✅ Top categories loaded (${data.length})`);
        })
        .catch(error => {
          console.error('❌ Error loading top categories:', error);
        });

      // Wait for all requests to accumulate results (whether success or fail)
      await Promise.all([loadNewProduct, loadFeatured, loadCategories]);

      console.log('✅ All Homepage requests finished');

    } catch (error) {
      console.error('❌ Unexpected error in Homepage load:', error);
      this.error.set('Si è verificato un errore imprevisto. Riprova più tardi.');
    } finally {
      console.log('🏁 HomePage loading finished, setting isLoading to false');
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
