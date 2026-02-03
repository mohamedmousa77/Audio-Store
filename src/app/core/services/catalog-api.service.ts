import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http/http.service';
import { API_ENDPOINTS } from './constants/api-endpoints';
import { Product, ProductQueryParams } from '../models/product';
import { Category } from '../models/category';

/**
 * HomePage / Catalog API Service
 * Handles all API calls for products and categories
 * Migrated from BaseApiServices to HttpService
 */
@Injectable({
  providedIn: 'root'
})
export class CatalogApiService {
  private httpService = inject(HttpService);

  // ============================================
  // PRODUCTS API
  // ============================================

  /**
   * Get all products with optional filtering and pagination
   * @param params Query parameters for filtering, sorting, pagination
   */
  getProducts(params?: ProductQueryParams): Observable<Product[]> {
    return this.httpService.get<Product[]>(
      API_ENDPOINTS.products.base,
      params as Record<string, any>
    );
  }

  /**
   * Get a single product by ID
   * @param id Product ID (number)
   */
  getProductById(id: number): Observable<Product> {
    return this.httpService.get<Product>(
      API_ENDPOINTS.products.byId(id)
    );
  }

  /**
   * Get featured products
   */
  getFeaturedProducts(): Observable<Product[]> {
    return this.getProducts({ isFeatured: true });
  }

  /**
   * Get new products
   */
  getNewProducts(): Observable<Product[]> {
    return this.getProducts({ isNew: true });
  }

  /**
   * Get products by category
   * @param categoryId Category ID
   */
  getProductsByCategory(categoryId: number): Observable<Product[]> {
    return this.getProducts({ categoryId });
  }

  /**
   * Search products by query
   * @param query Search term
   */
  searchProducts(query: string): Observable<Product[]> {
    return this.getProducts({ search: query });
  }

  /**
   * Get products with price range filter
   * @param minPrice Minimum price
   * @param maxPrice Maximum price
   */
  getProductsByPriceRange(minPrice: number, maxPrice: number): Observable<Product[]> {
    return this.getProducts({ minPrice, maxPrice });
  }

  // ============================================
  // CATEGORIES API
  // ============================================

  /**
   * Get all categories
   */
  getCategories(): Observable<Category[]> {
    return this.httpService.get<Category[]>(
      API_ENDPOINTS.categories.base
    );
  }

  /**
   * Get a single category by ID
   * @param id Category ID (number)
   */
  getCategoryById(id: number): Observable<Category> {
    return this.httpService.get<Category>(
      API_ENDPOINTS.categories.byId(id)
    );
  }

  /**
   * Get products count for a category
   * @param id Category ID
   */
  getCategoryProductCount(id: number): Observable<number> {
    return this.httpService.get<number>(
      `${API_ENDPOINTS.categories.byId(id)}/product-count`
    );
  }
}