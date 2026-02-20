import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminSidebar } from '../../layout/admin-sidebar/admin-sidebar';
import { AdminHeader } from '../../layout/admin-header/header';
import { AdminNotificationService } from '../../layout/admin-notification/admin-notification.service';
import { CategoryServices } from '../../../../core/services/category/category-services';
import { ProductServices } from '../../../../core/services/product/product-services';
import { Category } from '../../../../core/models/category';
import { TranslationService } from '../../../../core/services/translation/translation.service';
import { CustomSelectComponent, SelectOption } from '../../../../shared/components/custom-select/custom-select';
/**
 * Categories Management Page (Admin)
 * Full CRUD with image upload, notifications, and product count navigation
 */
@Component({
  selector: 'app-categories-page',
  imports: [
    CommonModule,
    FormsModule,
    AdminSidebar,
    AdminHeader,
    CustomSelectComponent
  ],
  templateUrl: './categories-page.html',
  styleUrl: './categories-page.css',
})
export class CategoriesPage implements OnInit {
  private categoryService = inject(CategoryServices);
  private productService = inject(ProductServices);
  private notification = inject(AdminNotificationService);
  private router = inject(Router);
  private translationService = inject(TranslationService);

  // Expose translations
  translations = this.translationService.translations;


  // Signals from CategoryServices
  categories = this.categoryService.categories;
  loading = this.categoryService.isLoading;
  error = this.categoryService.error;

  // Local state
  searchTerm = signal<string>('');
  sortBy = signal<'name' | 'products'>('name');
  sortOrder = signal<'asc' | 'desc'>('asc');
  viewMode = signal<'grid' | 'table'>('grid');
  isFormOpen = signal<boolean>(false);
  editingCategory = signal<Category | null>(null);
  formCategory = signal<Partial<Category>>({});
  saving = signal<boolean>(false);

  // Dropdown options for custom-select
  sortOptions = computed<SelectOption[]>(() => {
    const t = this.translations().categoriesManagement.controls.sort;
    return [
      { value: 'name', label: t.name },
      { value: 'products', label: t.products }
    ];
  });

  // Track which category's product count should flash red
  flashCategoryId = signal<number | null>(null);

  // Computed filtered and sorted categories
  filteredCategories = computed(() => {
    const allCategories = this.categories();
    const search = this.searchTerm().toLowerCase();
    const sort = this.sortBy();
    const order = this.sortOrder();

    let filtered = allCategories.filter(category => {
      if (!search) return true;
      return (
        category.name.toLowerCase().includes(search) ||
        (category.description?.toLowerCase().includes(search) || false)
      );
    });

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

  async loadData(): Promise<void> {
    await Promise.all([
      this.categoryService.loadCategories(),
      this.productService.loadCatalogData()
    ]);
  }

  openAddCategory(): void {
    this.editingCategory.set(null);
    this.formCategory.set({ name: '', description: '', imageUrl: '' });
    this.isFormOpen.set(true);
    this.scrollToForm();
  }

  editCategory(category: Category): void {
    this.editingCategory.set(category);
    this.formCategory.set({ ...category });
    this.isFormOpen.set(true);
    this.scrollToForm();
  }

  closeForm(): void {
    this.isFormOpen.set(false);
    this.editingCategory.set(null);
    this.formCategory.set({});
  }

  /**
   * Save category (create or update) with AdminNotificationService
   */
  async saveCategory(): Promise<void> {
    const editing = this.editingCategory();
    const formData = this.formCategory();

    if (!formData.name) {
      this.notification.showWarning('Campo Obbligatorio', 'Il nome della categoria è obbligatorio.');
      return;
    }

    this.saving.set(true);

    const categoryData: Category = {
      id: editing?.id || 0,
      name: formData.name,
      description: formData.description || '',
      imageUrl: formData.imageUrl || '',
      productCount: formData.productCount || 0
    };

    try {
      if (editing) {
        const result = await this.categoryService.updateCategory(editing.id, categoryData);
        if (result) {
          this.notification.showSuccess(
            'Categoria Aggiornata',
            `La categoria "${result.name}" è stata aggiornata con successo.`
          );
          this.closeForm();
        } else {
          this.notification.showError(
            'Errore Aggiornamento',
            'Impossibile aggiornare la categoria. Riprova.'
          );
        }
      } else {
        const result = await this.categoryService.createCategory(categoryData);
        if (result) {
          this.notification.showSuccess(
            'Categoria Creata',
            `La categoria "${result.name}" è stata creata con successo.`
          );
          this.closeForm();
        } else {
          this.notification.showError(
            'Errore Creazione',
            'Impossibile creare la categoria. Controlla i dati e riprova.'
          );
        }
      }
    } catch (err: any) {
      const errorMsg = err?.error?.error || err?.message || 'Errore sconosciuto dal server.';
      this.notification.showError(
        'Errore',
        errorMsg
      );
    } finally {
      this.saving.set(false);
    }
  }

  /**
   * Delete category with error dialog for categories with products
   */
  async deleteCategory(category: Category): Promise<void> {
    const productCount = this.getProductCount(category.id);

    if (productCount > 0) {
      // Show error notification
      this.notification.showError(
        'Impossibile Eliminare',
        `La categoria "${category.name}" contiene ${productCount} prodotti. Riassegna o elimina i prodotti prima di eliminare la categoria.`
      );

      // Flash the product count in red for 3 seconds
      this.flashCategoryId.set(category.id);
      setTimeout(() => {
        this.flashCategoryId.set(null);
      }, 3000);
      return;
    }

    if (confirm(`Sei sicuro di voler eliminare la categoria "${category.name}"? Questa azione è irreversibile.`)) {
      try {
        const result = await this.categoryService.deleteCategory(category.id);
        if (result) {
          this.notification.showSuccess(
            'Categoria Eliminata',
            `La categoria "${category.name}" è stata eliminata con successo.`
          );
        } else {
          this.notification.showError(
            'Errore Eliminazione',
            'Impossibile eliminare la categoria. Riprova.'
          );
        }
      } catch (err: any) {
        const errorMsg = err?.error?.error || err?.message || 'Errore sconosciuto dal server.';
        this.notification.showError('Errore Eliminazione', errorMsg);
      }
    }
  }

  /**
   * Navigate to products page filtered by category
   */
  navigateToProducts(categoryId: number, categoryName: string): void {
    this.router.navigate(['/admin/products'], {
      queryParams: { categoryId, categoryName }
    });
  }

  toggleSortOrder(): void {
    this.sortOrder.set(this.sortOrder() === 'asc' ? 'desc' : 'asc');
  }

  toggleViewMode(): void {
    this.viewMode.set(this.viewMode() === 'grid' ? 'table' : 'grid');
  }

  clearSearch(): void {
    this.searchTerm.set('');
  }

  private scrollToForm(): void {
    setTimeout(() => {
      const element = document.getElementById('category-form-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  getProductCount(categoryId: number): number {
    return this.categoryService.getProductCountForCategory(categoryId);
  }

  getTotalProducts(): number {
    return this.categories().reduce((sum, cat) => sum + this.getProductCount(cat.id), 0);
  }

  getAverageProducts(): number {
    const cats = this.categories();
    return cats.length > 0
      ? Math.round(this.getTotalProducts() / cats.length)
      : 0;
  }

  getTopCategory(): Category | null {
    const cats = this.categories();
    if (cats.length === 0) return null;
    return cats.reduce((max, cat) =>
      this.getProductCount(cat.id) > this.getProductCount(max.id) ? cat : max
    );
  }

  updateFormName(name: string): void {
    this.formCategory.set({ ...this.formCategory(), name });
  }

  updateFormDescription(description: string): void {
    this.formCategory.set({ ...this.formCategory(), description });
  }

  /**
   * Handle image file selection with compression
   */
  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.compressImage(input.files[0], 600).then(compressed => {
        this.formCategory.set({ ...this.formCategory(), imageUrl: compressed });
      });
    }
  }

  /**
   * Remove selected image
   */
  removeImage(): void {
    this.formCategory.set({ ...this.formCategory(), imageUrl: '' });
  }

  /**
   * Compress and resize an image file using Canvas API.
   * Outputs JPEG at 0.7 quality, resized to fit within maxSize x maxSize.
   */
  private compressImage(file: File, maxSize: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxSize || height > maxSize) {
            if (width > height) {
              height = Math.round((height * maxSize) / width);
              width = maxSize;
            } else {
              width = Math.round((width * maxSize) / height);
              height = maxSize;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d')!;
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}
