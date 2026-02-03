import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Product } from '../../models/product';
import { CatalogStore } from '../../../features/Client/state/catalog-store';
import { CatalogApiService } from '../catalog-api.service';

/**
 * Product Services
 * High-level service for product management
 * Uses CatalogApiService for API calls and CatalogStore for state management
 */
@Injectable({
  providedIn: 'root',
})
export class ProductServices {
  constructor(
    private catalogApi: CatalogApiService,
    private catalogStore: CatalogStore
  ) { }

  /**
   * Load all catalog data (products and categories) and populate global state
   */
  async loadCatalogData(): Promise<void> {
    this.catalogStore.loadingSignal.set(true);
    try {
      // Execute both API calls in parallel for better performance
      const [products, categories] = await Promise.all([
        firstValueFrom(this.catalogApi.getProducts()),
        firstValueFrom(this.catalogApi.getCategories()),
      ]);

      this.catalogStore.setProducts(products);
      this.catalogStore.setCategories(categories);
    } catch (error) {
      console.error('Failed to load catalog data:', error);
      this.catalogStore.errorSignal.set('Failed to load catalog data');
    } finally {
      this.catalogStore.loadingSignal.set(false);
    }
  }

  /**
   * Get product details by ID
   * First checks the store, then falls back to API if not found
   * @param id Product ID
   */
  async getProductDetails(id: number): Promise<Product | undefined> {
    // 1. Check if product is already loaded in store
    const existing = this.catalogStore.productsSignal().find(p => p.id === id);
    if (existing) return existing;

    // 2. If not found (e.g., direct URL access), fetch from API
    try {
      return await firstValueFrom(this.catalogApi.getProductById(id));
    } catch (error) {
      console.error(`Failed to load product ${id}:`, error);
      return undefined;
    }
  }

  /**
   * Load newest product (for HomePage "New Product" section)
   * Loads only the most recent product
   */
  async loadNewProduct(): Promise<Product | undefined> {
    this.catalogStore.loadingSignal.set(true);
    try {
      // Get first product sorted by creation date (newest first)
      const products = await firstValueFrom(this.catalogApi.getProducts());

      if (products.length > 0) {
        return products[0]; // Return newest product
      }
      return undefined;
    } catch (error) {
      console.error('Failed to load new product:', error);
      this.catalogStore.errorSignal.set('Failed to load new product');
      return undefined;
    } finally {
      this.catalogStore.loadingSignal.set(false);
    }
  }

  /**
   * Load featured products (optimized for HomePage)
   * @param limit Number of products to load (default: 3 for HomePage)
   */
  async loadFeaturedProducts(limit?: number): Promise<Product[]> {
    this.catalogStore.loadingSignal.set(true);
    try {
      const featured = await firstValueFrom(this.catalogApi.getFeaturedProducts());

      // Limit results if specified
      const limitedFeatured = limit ? featured.slice(0, limit) : featured;

      this.catalogStore.setProducts(limitedFeatured);
      return limitedFeatured;
    } catch (error) {
      console.error('Failed to load featured products:', error);
      this.catalogStore.errorSignal.set('Failed to load featured products');
      return [];
    } finally {
      this.catalogStore.loadingSignal.set(false);
    }
  }

  /**
   * Search products
   * @param query Search term
   */
  async searchProducts(query: string): Promise<void> {
    if (!query.trim()) {
      // If empty query, reload all products
      await this.loadCatalogData();
      return;
    }

    this.catalogStore.loadingSignal.set(true);
    try {
      const products = await firstValueFrom(
        this.catalogApi.searchProducts(query)
      );
      this.catalogStore.setProducts(products);
    } catch (error) {
      console.error(`Failed to search products with query "${query}":`, error);
      this.catalogStore.errorSignal.set('Failed to search products');
    } finally {
      this.catalogStore.loadingSignal.set(false);
    }
  }

  // ============================================
  // GETTERS FOR COMPONENTS (Signals)
  // Components use these to access reactive state
  // ============================================

  get products() {
    return this.catalogStore.filteredProducts;
  }

  get featured() {
    return this.catalogStore.featuredProducts;
  }

  get categories() {
    return this.catalogStore.categories;
  }

  get isLoading() {
    return this.catalogStore.loadingSignal;
  }

  get error() {
    return this.catalogStore.errorSignal;
  }

  // ============================================
  // FILTERS
  // ============================================

  setCategory(categoryId: number | null) {
    this.catalogStore.setSelectedCategory(categoryId);
  }

  setSearch(term: string) {
    this.catalogStore.setSearchTerm(term);
  }

  clearFilters() {
    this.catalogStore.setSelectedCategory(null);
    this.catalogStore.setSearchTerm('');
  }
}
