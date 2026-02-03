import { Injectable } from '@angular/core';
import { signal, computed } from '@angular/core';
import { Category } from '../../../core/models/category';
import { Product } from '../../../core/models/product';
import { Order } from '../../../core/models/order';

@Injectable({
  providedIn: 'root',
})
// Catalog Store using Angular Signals for state management
export class CatalogStore {
  // Signals
  productsSignal = signal<Product[]>([]);
  categoriesSignal = signal<Category[]>([]);
  ordersSignal = signal<Order[]>([]);

  // Filter state - changed to number to match Product.categoryId
  selectedCategorySignal = signal<number | null>(null);
  searchTermSignal = signal<string>('');

  // UI state
  loadingSignal = signal<boolean>(false);
  errorSignal = signal<string | null>(null);

  // Computed values
  filteredProducts = computed(() => {
    const products = this.productsSignal();
    const categoryId = this.selectedCategorySignal();
    const search = this.searchTermSignal().toLowerCase();

    return products.filter(p => {
      // Match by categoryId (number) instead of category (string)
      const matchCategory = !categoryId || p.categoryId === categoryId;
      const matchSearch =
        p.name.toLowerCase().includes(search) ||
        (p.description ? p.description.toLowerCase().includes(search) : false);
      return matchCategory && matchSearch;
    });
  });

  featuredProducts = computed(() =>
    this.productsSignal().filter(p => p.isFeatured).slice(0, 6)
  );

  categories = computed(() => this.categoriesSignal());

  setOrders(orders: Order[]): void {
    this.ordersSignal.set(orders);
  }


  setProducts(products: Product[]): void {
    this.productsSignal.set(products);
  }

  setCategories(categories: Category[]): void {
    this.categoriesSignal.set(categories);
  }

  setSelectedCategory(categoryId: number | null): void {
    this.selectedCategorySignal.set(categoryId);
  }

  setSearchTerm(term: string): void {
    this.searchTermSignal.set(term);
  }

  setLoading(loading: boolean): void {
    this.loadingSignal.set(loading);
  }

  setError(error: string | null): void {
    this.errorSignal.set(error);
  }
}
