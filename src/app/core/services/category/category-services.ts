import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Category, CreateCategoryRequest, UpdateCategoryRequest } from '../../models/category';
import { CatalogStore } from '../../../features/Client/state/catalog-store';
import { CatalogApiService } from '../catalog-api.service';

/**
 * Category Services
 * High-level service for category management
 * Uses CatalogApiService for API calls and CatalogStore for state management
 */
@Injectable({
  providedIn: 'root',
})
export class CategoryServices {
  constructor(
    private catalogApi: CatalogApiService,
    private catalogStore: CatalogStore
  ) { }

  /**
   * Load all categories and populate global state
   */
  async loadCategories(): Promise<void> {
    this.catalogStore.loadingSignal.set(true);
    try {
      const categories = await firstValueFrom(this.catalogApi.getCategories());
      this.catalogStore.setCategories(categories);
    } catch (error) {
      console.error('Failed to load categories:', error);
      this.catalogStore.errorSignal.set('Failed to load categories');
    } finally {
      this.catalogStore.loadingSignal.set(false);
    }
  }

  /**
   * Get category details by ID
   * First checks the store, then falls back to API if not found
   * @param id Category ID
   */
  async getCategoryDetails(id: number): Promise<Category | undefined> {
    // 1. Check if category is already loaded in store
    const existing = this.catalogStore.categoriesSignal().find(c => c.id === id);
    if (existing) return existing;

    // 2. If not found (e.g., direct URL access), fetch from API
    try {
      return await firstValueFrom(this.catalogApi.getCategoryById(id));
    } catch (error) {
      console.error(`Failed to load category ${id}:`, error);
      return undefined;
    }
  }

  /**
   * Get products for a specific category
   * Delegates to ProductServices via store filter
   * @param categoryId Category ID
   */
  async loadProductsByCategory(categoryId: number): Promise<void> {
    this.catalogStore.loadingSignal.set(true);
    try {
      const products = await firstValueFrom(
        this.catalogApi.getProductsByCategory(categoryId)
      );
      this.catalogStore.setProducts(products);
      // Also set the category filter in store
      this.catalogStore.setSelectedCategory(categoryId);
    } catch (error) {
      console.error(`Failed to load products for category ${categoryId}:`, error);
      this.catalogStore.errorSignal.set('Failed to load category products');
    } finally {
      this.catalogStore.loadingSignal.set(false);
    }
  }

  // ============================================
  // ADMIN OPERATIONS (CRUD)
  // These will be used by admin components
  // ============================================

  /**
   * Create a new category (Admin only)
   * Note: Requires admin authentication
   */
  async createCategory(data: CreateCategoryRequest): Promise<Category | undefined> {
    try {
      // This will be implemented when we add admin CRUD to CatalogApiService
      console.warn('createCategory: Not yet implemented in CatalogApiService');
      return undefined;
    } catch (error) {
      console.error('Failed to create category:', error);
      return undefined;
    }
  }

  /**
   * Update an existing category (Admin only)
   * Note: Requires admin authentication
   */
  async updateCategory(id: number, data: UpdateCategoryRequest): Promise<Category | undefined> {
    try {
      // This will be implemented when we add admin CRUD to CatalogApiService
      console.warn('updateCategory: Not yet implemented in CatalogApiService');
      return undefined;
    } catch (error) {
      console.error(`Failed to update category ${id}:`, error);
      return undefined;
    }
  }

  /**
   * Delete a category (Admin only)
   * Note: Requires admin authentication
   */
  async deleteCategory(id: number): Promise<boolean> {
    try {
      // This will be implemented when we add admin CRUD to CatalogApiService
      console.warn('deleteCategory: Not yet implemented in CatalogApiService');
      return false;
    } catch (error) {
      console.error(`Failed to delete category ${id}:`, error);
      return false;
    }
  }

  // ============================================
  // GETTERS FOR COMPONENTS (Signals)
  // Components use these to access reactive state
  // ============================================

  get categories() {
    return this.catalogStore.categories;
  }

  get isLoading() {
    return this.catalogStore.loadingSignal;
  }

  get error() {
    return this.catalogStore.errorSignal;
  }

  /**
   * Get category by ID from store (synchronous)
   */
  getCategoryFromStore(id: number): Category | undefined {
    return this.catalogStore.categoriesSignal().find(c => c.id === id);
  }

  /**
   * Get products count for a category from store
   */
  getProductCountForCategory(categoryId: number): number {
    return this.catalogStore.productsSignal().filter(p => p.categoryId === categoryId).length;
  }
}
