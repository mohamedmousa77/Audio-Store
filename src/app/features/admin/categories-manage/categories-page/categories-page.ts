import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminSidebar } from '../../layout/admin-sidebar/admin-sidebar';
import { AdminHeader } from '../../layout/admin-header/header';
import { Badge } from '../../../../shared/components/badge/badge';
import { CategoryServices } from '../../../../core/services/category/category-services';
import { ProductServices } from '../../../../core/services/product/product-services';
import { Category } from '../../../../core/models/category';

/**
 * Categories Management Page (Admin)
 * Updated to use CategoryServices with Signals and full CRUD operations
 * 
 * Breaking Changes:
 * - Uses Signals instead of hardcoded data
 * - Category model updated (id is number, not string)
 * - Reactive filtering with computed()
 * - CRUD operations integrated with backend API
 */
@Component({
  selector: 'app-categories-page',
  imports: [
    CommonModule,
    FormsModule,
    AdminSidebar,
    AdminHeader
  ],
  templateUrl: './categories-page.html',
  styleUrl: './categories-page.css',
})
export class CategoriesPage implements OnInit {
  private categoryService = inject(CategoryServices);
  private productService = inject(ProductServices);

  // Use Signals from CategoryServices
  categories = this.categoryService.categories;
  loading = this.categoryService.isLoading;
  error = this.categoryService.error;

  // Local state
  searchTerm = signal<string>('');
  sortBy = signal<'name' | 'products'>('name');
  sortOrder = signal<'asc' | 'desc'>('asc');
  viewMode = signal<'grid' | 'table'>('table');
  isFormOpen = signal<boolean>(false);
  editingCategory = signal<Category | null>(null);
  formCategory = signal<Partial<Category>>({});

  // Computed filtered and sorted categories
  filteredCategories = computed(() => {
    const allCategories = this.categories();
    const search = this.searchTerm().toLowerCase();
    const sort = this.sortBy();
    const order = this.sortOrder();

    // Filter
    let filtered = allCategories.filter(category => {
      if (!search) return true;
      return (
        category.name.toLowerCase().includes(search) ||
        (category.description?.toLowerCase().includes(search) || false)
      );
    });

    // Sort
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sort) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          return order === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        case 'products':
          aValue = this.getProductCount(a.id);
          bValue = this.getProductCount(b.id);
          return order === 'asc' ? aValue - bValue : bValue - aValue;
        default:
          return 0;
      }
    });

    return filtered;
  });

  async ngOnInit(): Promise<void> {
    await this.loadData();
  }

  /**
   * Load all data
   */
  async loadData(): Promise<void> {
    await Promise.all([
      this.categoryService.loadCategories(),
      this.productService.loadCatalogData()
    ]);
  }

  /**
   * Open add category form
   */
  openAddCategory(): void {
    this.editingCategory.set(null);
    this.formCategory.set({ name: '', description: '', icon: 'category' });
    this.isFormOpen.set(true);
    this.scrollToForm();
  }

  /**
   * Edit existing category
   */
  editCategory(category: Category): void {
    this.editingCategory.set(category);
    this.formCategory.set({ ...category });
    this.isFormOpen.set(true);
    this.scrollToForm();
  }

  /**
   * Close form
   */
  closeForm(): void {
    this.isFormOpen.set(false);
    this.editingCategory.set(null);
    this.formCategory.set({});
  }

  /**
   * Save category (create or update)
   */
  async saveCategory(): Promise<void> {
    const editing = this.editingCategory();
    const formData = this.formCategory();

    if (!formData.name) {
      alert('Category name is required');
      return;
    }

    const categoryData: Category = {
      id: editing?.id || 0,
      name: formData.name,
      description: formData.description || '',
      icon: formData.icon || 'category',
      productCount: formData.productCount || 0
    };

    if (editing) {
      // Update existing category
      const result = await this.categoryService.updateCategory(editing.id, categoryData);
      if (result) {
        alert('Category updated successfully!');
        this.closeForm();
      } else {
        alert('Failed to update category');
      }
    } else {
      // Create new category
      const result = await this.categoryService.createCategory(categoryData);
      if (result) {
        alert('Category created successfully!');
        this.closeForm();
      } else {
        alert('Failed to create category');
      }
    }
  }

  /**
   * Delete category
   */
  async deleteCategory(category: Category): Promise<void> {
    const productCount = this.getProductCount(category.id);

    if (productCount > 0) {
      alert(`Cannot delete category "${category.name}" because it has ${productCount} products. Please reassign or delete the products first.`);
      return;
    }

    if (confirm(`Are you sure you want to delete the "${category.name}" category? This action cannot be undone.`)) {
      const result = await this.categoryService.deleteCategory(category.id);
      if (result) {
        alert('Category deleted successfully!');
      } else {
        alert('Failed to delete category');
      }
    }
  }

  /**
   * Toggle sort order
   */
  toggleSortOrder(): void {
    this.sortOrder.set(this.sortOrder() === 'asc' ? 'desc' : 'asc');
  }

  /**
   * Toggle view mode
   */
  toggleViewMode(): void {
    this.viewMode.set(this.viewMode() === 'grid' ? 'table' : 'grid');
  }

  /**
   * Clear search
   */
  clearSearch(): void {
    this.searchTerm.set('');
  }

  /**
   * Scroll to form section
   */
  private scrollToForm(): void {
    setTimeout(() => {
      const element = document.getElementById('category-form-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  /**
   * Get product count for category
   */
  getProductCount(categoryId: number): number {
    return this.categoryService.getProductCountForCategory(categoryId);
  }

  /**
   * Get total products across all categories
   */
  getTotalProducts(): number {
    return this.categories().reduce((sum, cat) => sum + this.getProductCount(cat.id), 0);
  }

  /**
   * Get average products per category
   */
  getAverageProducts(): number {
    const cats = this.categories();
    return cats.length > 0
      ? Math.round(this.getTotalProducts() / cats.length)
      : 0;
  }

  /**
   * Get top category by product count
   */
  getTopCategory(): Category | null {
    const cats = this.categories();
    if (cats.length === 0) return null;

    return cats.reduce((max, cat) =>
      this.getProductCount(cat.id) > this.getProductCount(max.id) ? cat : max
    );
  }

  /**
   * Update form category name
   */
  updateFormName(name: string): void {
    this.formCategory.set({ ...this.formCategory(), name });
  }

  /**
   * Update form category description
   */
  updateFormDescription(description: string): void {
    this.formCategory.set({ ...this.formCategory(), description });
  }

  /**
   * Update form category icon
   */
  updateFormIcon(icon: string): void {
    this.formCategory.set({ ...this.formCategory(), icon });
  }
}
