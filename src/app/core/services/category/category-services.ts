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
   * Load top categories (optimized for HomePage)
   * @param limit Number of categories to load (default: 3 for HomePage)
   */
  async loadTopCategories(limit: number = 3): Promise<Category[]> {
    this.catalogStore.loadingSignal.set(true);
    try {
      const categories = await firstValueFrom(this.catalogApi.getCategories());

      // Limit results
      const limitedCategories = categories.slice(0, limit);

      this.catalogStore.setCategories(limitedCategories);
      return limitedCategories;
    } catch (error) {
      console.error('Failed to load top categories:', error);
      this.catalogStore.errorSignal.set('Failed to load top categories');
      return [];
    } finally {
      this.catalogStore.loadingSignal.set(false);
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
  // ADMIN OPERATIONS
  // ============================================

  /**
   * Create new category (Admin only)
   * @param category Category data
   */
  async createCategory(category: Category): Promise<Category | undefined> {
    this.catalogStore.loadingSignal.set(true);
    try {
      const newCategory = await firstValueFrom(this.catalogApi.createCategory(category));

      // Add to store
      const currentCategories = this.catalogStore.categoriesSignal();
      this.catalogStore.setCategories([...currentCategories, newCategory]);

      console.log(`✅ Created category: ${newCategory.name}`);
      return newCategory;
    } catch (error) {
      console.error('Failed to create category:', error);
      this.catalogStore.errorSignal.set('Failed to create category');
      return undefined;
    } finally {
      this.catalogStore.loadingSignal.set(false);
    }
  }

  /**
   * Update existing category (Admin only)
   * @param id Category ID
   * @param category Updated category data
   */
  async updateCategory(id: number, category: Category): Promise<Category | undefined> {
    this.catalogStore.loadingSignal.set(true);
    try {
      const updatedCategory = await firstValueFrom(this.catalogApi.updateCategory(id, category));

      // Update in store
      const currentCategories = this.catalogStore.categoriesSignal();
      const updatedCategories = currentCategories.map(c =>
        c.id === id ? updatedCategory : c
      );
      this.catalogStore.setCategories(updatedCategories);

      console.log(`✅ Updated category: ${updatedCategory.name}`);
      return updatedCategory;
    } catch (error) {
      console.error(`Failed to update category ${id}:`, error);
      this.catalogStore.errorSignal.set('Failed to update category');
      return undefined;
    } finally {
      this.catalogStore.loadingSignal.set(false);
    }
  }

  /**
   * Delete category (Admin only)
   * @param id Category ID
   */
  async deleteCategory(id: number): Promise<boolean> {
    this.catalogStore.loadingSignal.set(true);
    try {
      await firstValueFrom(this.catalogApi.deleteCategory(id));

      // Remove from store
      const currentCategories = this.catalogStore.categoriesSignal();
      const filteredCategories = currentCategories.filter(c => c.id !== id);
      this.catalogStore.setCategories(filteredCategories);

      console.log(`✅ Deleted category ${id}`);
      return true;
    } catch (error) {
      console.error(`Failed to delete category ${id}:`, error);
      this.catalogStore.errorSignal.set('Failed to delete category');
      return false;
    } finally {
      this.catalogStore.loadingSignal.set(false);
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
