import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminSidebar } from '../../layout/admin-sidebar/admin-sidebar';
import { AdminHeader } from '../../layout/admin-header/header';
import { ProductForm } from '../product-form/product-form';
import { ProductServices } from '../../../../core/services/product/product-services';
import { CategoryServices } from '../../../../core/services/category/category-services';
import { AdminNotificationService } from '../../layout/admin-notification/admin-notification.service';
import { Product, CreateProductRequest } from '../../../../core/models/product';
import { TranslationService } from '../../../../core/services/translation/translation.service';
import { ActivatedRoute } from '@angular/router';
import { CustomSelectComponent, SelectOption } from '../../../../shared/components/custom-select/custom-select';
/**
 * Products Management Page (Admin)
 * With pagination, status derived from stockQuantity, and clean filters
 */
@Component({
  selector: 'app-products-page',
  imports: [CommonModule, FormsModule, AdminSidebar, AdminHeader, ProductForm, CustomSelectComponent],
  templateUrl: './products-page.html',
  styleUrl: './products-page.css',
})
export class ProductsPage implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductServices);
  private categoryService = inject(CategoryServices);
  private notification = inject(AdminNotificationService);
  private translationService = inject(TranslationService);

  translations = this.translationService.translations;
  // Use ALL products (unfiltered) for admin
  products = this.productService.allProducts;
  categories = this.categoryService.categories;
  loading = this.productService.isLoading;
  error = this.productService.error;

  // Local state
  searchTerm = signal<string>('');
  selectedCategory = signal<number | null>(null);
  selectedStatus = signal<string>('');
  isFormOpen = signal<boolean>(false);
  editingProduct = signal<Product | null>(null);
  saving = signal<boolean>(false);

  // Pagination
  currentPage = signal<number>(1);
  pageSize = signal<number>(5);

  // Dropdown options for custom-select
  categoryOptions = computed<SelectOption[]>(() => {
    const t = this.translations().productsManagement;
    const cats = this.categories();
    return [
      { value: null, label: t.categoriesSearchPlaceholder },
      ...cats.map(c => ({ value: c.id, label: c.name }))
    ];
  });

  statusOptions = computed<SelectOption[]>(() => {
    const t = this.translations().productsManagement.filterByStatus;
    return [
      { value: '', label: t.pleaseholder },
      { value: 'Available', label: t.available },
      { value: 'Low Stock', label: t.lowStock },
      { value: 'Unavailable', label: t.unavailable }
    ];
  });

  // Derive status from stockQuantity
  getProductStatus(product: Product): string {
    if (product.stockQuantity === 0) return 'Unavailable';
    if (product.stockQuantity < 10) return 'Low Stock';
    return 'Available';
  }

  // Total products count (from all loaded products)
  totalProducts = computed(() => {
    const allProducts = this.products();
    if (!Array.isArray(allProducts)) return 0;
    return allProducts.length;
  });

  // All products filtered and sorted by creation date (before pagination)
  allFilteredProducts = computed(() => {
    const allProducts = this.products();
    if (!Array.isArray(allProducts)) return [];
    const search = this.searchTerm().toLowerCase();
    const categoryId = this.selectedCategory();
    const status = this.selectedStatus();

    const filtered = allProducts.filter(product => {
      // Search filter
      const matchesSearch = !search ||
        product.name.toLowerCase().includes(search) ||
        product.brand?.toLowerCase().includes(search);

      // Category filter
      const matchesCategory = !categoryId || product.categoryId === categoryId;

      // Status filter (derived from stockQuantity)
      const productStatus = this.getProductStatus(product);
      const matchesStatus = !status || productStatus === status;

      return matchesSearch && matchesCategory && matchesStatus;
    });

    // Sort by creation date, newest first
    return filtered.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  });

  // Total pages
  totalPages = computed(() => {
    const filtered = this.allFilteredProducts().length;
    return Math.max(1, Math.ceil(filtered / this.pageSize()));
  });

  // Paginated products (what's shown in the table)
  filteredProducts = computed(() => {
    const all = this.allFilteredProducts();
    const page = this.currentPage();
    const size = this.pageSize();
    const start = (page - 1) * size;
    return all.slice(start, start + size);
  });

  async ngOnInit(): Promise<void> {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    await this.loadData();

    this.route.queryParams.subscribe(params => {
      const categoryId = params['categoryId'];
      if (categoryId) {
        this.selectedCategory.set(Number(categoryId));
      }
    });

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
    // Clone to avoid mutating store data directly
    this.editingProduct.set({ ...product });
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
  async saveProduct(productData: any): Promise<void> {
    const editing = this.editingProduct();
    this.saving.set(true);

    try {
      if (editing) {
        const result = await this.productService.updateProduct(editing.id, productData);
        if (result) {
          this.notification.showProductUpdated(result.name);
          this.closeForm();
          await this.loadData();
          this.currentPage.set(1);
        } else {
          this.notification.showOperationFailed('aggiornamento prodotto');
        }
      } else {
        const result = await this.productService.createProduct(productData as CreateProductRequest);
        if (result) {
          this.notification.showProductCreated(result.name);
          this.closeForm();
          await this.loadData();
          this.currentPage.set(1);
        } else {
          this.notification.showOperationFailed('creazione prodotto');
        }
      }
    } finally {
      this.saving.set(false);
    }
  }

  /**
   * Delete product
   */
  async deleteProduct(product: Product): Promise<void> {
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      const result = await this.productService.deleteProduct(product.id);
      if (result) {
        this.notification.showProductDeleted();
      } else {
        this.notification.showOperationFailed('eliminazione prodotto');
      }
    }
  }

  /**
   * Category filter change handler
   */
  onCategoryChange(value: any): void {
    this.selectedCategory.set(value);
    this.currentPage.set(1); // Reset to page 1 on filter change
  }

  /**
   * Clear all filters
   */
  clearFilters(): void {
    this.searchTerm.set('');
    this.selectedCategory.set(null);
    this.selectedStatus.set('');
    this.currentPage.set(1);
  }

  /**
   * Pagination: go to page
   */
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  /**
   * Get page numbers for pagination buttons
   */
  getPageNumbers(): number[] {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];

    // Show max 5 page numbers around current
    let start = Math.max(1, current - 2);
    let end = Math.min(total, start + 4);
    start = Math.max(1, end - 4);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
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
   * Get status badge CSS class
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
}
