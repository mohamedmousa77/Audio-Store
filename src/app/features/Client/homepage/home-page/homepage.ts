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
import { TranslationService } from '../../../../core/services/translation/translation.service';

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
  private translationService = inject(TranslationService);

  // Local state for HomePage-specific data
  newProduct = signal<Product | undefined>(undefined);
  featuredProducts = signal<Product[]>([]);
  topCategories = signal<Category[]>([]);

  // Loading/error states
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  // Translations
  translations = this.translationService.translations;



  ngOnInit(): void {
    this.loadHomePageData();
  }

  /**
   * Load optimized data for HomePage
   * Loads: 1 new product + 4 featured products + all categories
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
          console.log('✅ New product loaded:', data?.name);
          console.log('🔍 New product image URL:', data?.mainImage);
        })
        .catch(error => {
          console.error('❌ Error loading new product:', error);
          // Don't set global error, just log it so other parts can show
        });

      const loadFeatured = this.productService.loadFeaturedProducts(8)
        .then(data => {
          this.featuredProducts.set(data);
          console.log(`✅ Featured products loaded (${data.length})`);
          if (data.length > 0) {
            console.log('🔍 First featured product:', data[0].name);
            console.log('🔍 First featured image:', data[0].mainImage);
          }
        })
        .catch(error => {
          console.error('❌ Error loading featured products:', error);
        });

      const loadCategories = this.categoryService.loadCategories()
        .then(() => {
          const allCategories = this.categoryService.categories();
          this.topCategories.set(allCategories);
          console.log(`✅ All categories loaded (${allCategories.length})`);
        })
        .catch(error => {
          console.error('❌ Error loading categories:', error);
        });

      // Wait for all requests to accumulate results (whether success or fail)
      await Promise.all([loadNewProduct, loadFeatured, loadCategories]);

      // Fallback: If no new product, use first featured product for hero banner
      if (!this.newProduct() && this.featuredProducts().length > 0) {
        this.newProduct.set(this.featuredProducts()[0]);
        console.log('⚠️ No new product found, using first featured product as hero');
      }

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
