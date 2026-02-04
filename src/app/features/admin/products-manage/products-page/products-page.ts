import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminSidebar } from '../../layout/admin-sidebar/admin-sidebar';
import { AdminHeader } from '../../layout/admin-header/header';
import { Badge } from '../../../../shared/components/badge/badge';
import { ProductForm } from '../product-form/product-form';
import { ProductServices } from '../../../../core/services/product/product-services';
import { CategoryServices } from '../../../../core/services/category/category-services';
import { Product, CreateProductRequest, UpdateProductRequest } from '../../../../core/models/product';

/**
 * Products Management Page (Admin)
 * Updated to use ProductServices with Signals and full CRUD operations
 * 
 * Breaking Changes:
 * - Uses Signals instead of hardcoded data
 * - Product model updated (id is number, not string)
 * - Reactive filtering with computed()
 * - CRUD operations integrated with backend API
 */
@Component({
  selector: 'app-products-page',
  imports: [CommonModule, FormsModule, AdminSidebar, AdminHeader, Badge, ProductForm],
  templateUrl: './products-page.html',
  styleUrl: './products-page.css',
})
export class ProductsPage implements OnInit {
  private productService = inject(ProductServices);
  private categoryService = inject(CategoryServices);

  // Use Signals from ProductServices
  products = this.productService.products;
  categories = this.categoryService.categories;
  loading = this.productService.isLoading;
  error = this.productService.error;

  // Local state
  searchTerm = signal<string>('');
  selectedCategory = signal<number | null>(null);
  selectedStatus = signal<string>('');
  isFormOpen = signal<boolean>(false);
  editingProduct = signal<Product | null>(null);

  // Computed filtered products
  filteredProducts = computed(() => {
    const allProducts = this.products();
    const search = this.searchTerm().toLowerCase();
    const categoryId = this.selectedCategory();
    const status = this.selectedStatus();

    return allProducts.filter(product => {
      // Search filter
      const matchesSearch = !search ||
        product.name.toLowerCase().includes(search) ||
        product.sku.toLowerCase().includes(search) ||
        product.brand.toLowerCase().includes(search);

      // Category filter
      const matchesCategory = !categoryId || product.categoryId === categoryId;

      // Status filter
      const matchesStatus = !status || product.status === status;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  });

  async ngOnInit(): Promise<void> {
    await this.loadData();
  }

  /**
   * Load all data
   */
  async loadData(): Promise<void> {
    await Promise.all([
      this.productService.loadCatalogData(),
      this.categoryService.loadCategories()
    ]);
  }

  /**
   * Open add product form
   */
  openAddProduct(): void {
    this.editingProduct.set(null);
    this.isFormOpen.set(true);
    this.scrollToForm();
  }

  /**
   * Edit existing product
   */
  editProduct(product: Product): void {
    this.editingProduct.set(product);
    this.isFormOpen.set(true);
    this.scrollToForm();
  }

  /**
   * Close form
   */
  closeForm(): void {
    this.isFormOpen.set(false);
    this.editingProduct.set(null);
  }

  /**
   * Save product (create or update)
   */
  async saveProduct(productData: CreateProductRequest | UpdateProductRequest): Promise<void> {
    const editing = this.editingProduct();

    if (editing) {
      // Update existing product
      const updateData: UpdateProductRequest = {
        ...productData,
        id: editing.id
      };
      const result = await this.productService.updateProduct(editing.id, updateData);
      if (result) {
        alert('Product updated successfully!');
        this.closeForm();
      } else {
        alert('Failed to update product');
      }
    } else {
      // Create new product
      const result = await this.productService.createProduct(productData as CreateProductRequest);
      if (result) {
        alert('Product created successfully!');
        this.closeForm();
      } else {
        alert('Failed to create product');
      }
    }
  }

  /**
   * Delete product
   */
  async deleteProduct(product: Product): Promise<void> {
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      const result = await this.productService.deleteProduct(product.id);
      if (result) {
        alert('Product deleted successfully!');
      } else {
        alert('Failed to delete product');
      }
    }
  }

  /**
   * Update product stock
   */
  async updateStock(product: Product, newStock: number): Promise<void> {
    if (newStock < 0) {
      alert('Stock cannot be negative');
      return;
    }

    const result = await this.productService.updateStock(product.id, newStock);
    if (result) {
      console.log(`Stock updated for ${product.name}: ${newStock}`);
    } else {
      alert('Failed to update stock');
    }
  }

  /**
   * Apply filters (reactive via computed)
   */
  applyFilters(): void {
    // Filters are automatically applied via computed signal
  }

  /**
   * Clear all filters
   */
  clearFilters(): void {
    this.searchTerm.set('');
    this.selectedCategory.set(null);
    this.selectedStatus.set('');
  }

  /**
   * Scroll to form section
   */
  private scrollToForm(): void {
    setTimeout(() => {
      const element = document.getElementById('product-form-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  /**
   * Get category name by ID
   */
  getCategoryName(categoryId: number): string {
    const category = this.categories().find(c => c.id === categoryId);
    return category?.name || 'Unknown';
  }

  /**
   * Get status badge class
   */
  getStatusClass(status: string): string {
    switch (status) {
      case 'Available':
        return 'status-available';
      case 'Low Stock':
        return 'status-low-stock';
      case 'Unavailable':
        return 'status-unavailable';
      default:
        return '';
    }
  }

  /**
   * Format price
   */
  formatPrice(price: number): string {
    return `€${price.toFixed(2)}`;
  }

  /**
   * Get total products count
   */
  getTotalProducts(): number {
    return this.products().length;
  }

  /**
   * Get low stock count
   */
  getLowStockCount(): number {
    return this.products().filter(p => p.status === 'Low Stock').length;
  }

  /**
   * Get out of stock count
   */
  getOutOfStockCount(): number {
    return this.products().filter(p => p.status === 'Unavailable').length;
  }
}
