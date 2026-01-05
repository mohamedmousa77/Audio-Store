import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminSidebar } from '../../layout/admin-sidebar/admin-sidebar';
import { AdminHeader } from '../../layout/admin-header/header';
import { Badge } from '../../../../shared/components/badge/badge';
import { Category } from '../../../../core/models/category';


@Component({
  selector: 'app-categories-page',
  imports: [
    CommonModule, 
    FormsModule, 
    AdminSidebar, 
    AdminHeader,
    // Badge
  ],
  templateUrl: './categories-page.html',
  styleUrl: './categories-page.css',
})
export class CategoriesPage implements OnInit {
categories: Category[] = [
    {
      id: '1',
      name: 'Headphones',
      description: 'Premium audio headphones and earbuds for all occasions',
      icon: 'headphones',
      productCount: 45
    },
    {
      id: '2',
      name: 'Speakers',
      description: 'High-quality speakers for home and studio use',
      icon: 'speaker',
      productCount: 28
    },
    {
      id: '3',
      name: 'Microphones',
      description: 'Professional microphones for recording and streaming',
      icon: 'mic',
      productCount: 32
    },
    {
      id: '4',
      name: 'Turntables',
      description: 'Vinyl turntables and record players',
      icon: 'album',
      productCount: 12
    },
    {
      id: '5',
      name: 'Amplifiers',
      description: 'Audio amplifiers and preamps',
      icon: 'graphic_eq',
      productCount: 18
    },
    {
      id: '6',
      name: 'Cables & Accessories',
      description: 'Audio cables, adapters, and accessories',
      icon: 'cable',
      productCount: 156
    },
    {
      id: '7',
      name: 'Mixing Consoles',
      description: 'Professional mixing boards and controllers',
      icon: 'tune',
      productCount: 8
    },
    {
      id: '8',
      name: 'Studio Monitors',
      description: 'Professional studio monitor speakers',
      icon: 'monitor',
      productCount: 22
    }
  ];

  isFormOpen = false;
  formCategory: Category = { id: '', name: '', description: '', icon: '', productCount: 0 };
  filteredCategories: Category[] = [];
  searchTerm = '';
  sortBy: 'name' | 'products' = 'name';
  sortOrder: 'asc' | 'desc' = 'asc';
  viewMode: 'grid' | 'table' = 'grid';
  showCategoryModal = false;
  editingCategory: Category | null = null;

  ngOnInit(): void {
    this.filteredCategories = [...this.categories];
    this.applySort();
  }

  applySearch(): void {
    this.filteredCategories = this.categories.filter(category => {
      const searchLower = this.searchTerm.toLowerCase();
      return (
        category.name.toLowerCase().includes(searchLower) ||
        category.description.toLowerCase().includes(searchLower)
      );
    });
    this.applySort();
  }

  applySort(): void {
    this.filteredCategories.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (this.sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          return this.sortOrder === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        case 'products':
          aValue = a.productCount;
          bValue = b.productCount;
          return this.sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
        default:
          return 0;
      }
    });
  }

  toggleSortOrder(): void {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.applySort();
  }

  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'grid' ? 'table' : 'grid';
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredCategories = [...this.categories];
    this.applySort();
  }

  openAddCategory(): void {
    this.editingCategory = null;
    this.formCategory = { id: '', name: '', description: '', icon: 'category', productCount: 0 };
    this.isFormOpen = true;
    this.scrollToForm();
  }

  editCategory(category: Category): void {
    this.editingCategory = { ...category };
    this.formCategory = { ...category };
    this.isFormOpen = true;
    this.scrollToForm();
  }

  private scrollToForm(): void {
    setTimeout(() => {
      const element = document.getElementById('category-form-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  saveCategory(): void {
      // ... logic remains same, just use this.formCategory
      if (this.formCategory.id) {
          // Update
          const index = this.categories.findIndex(c => c.id === this.formCategory.id);
          this.categories[index] = { ...this.formCategory };
      } else {
          // Add
          this.formCategory.id = Date.now().toString();
          this.categories.push({ ...this.formCategory });
      }
      this.applySearch();
      this.closeForm();
  }

  deleteCategory(category: Category): void {
    if (
      confirm(
        `Are you sure you want to delete the "${category.name}" category? This action cannot be undone.`
      )
    ) {
      this.categories = this.categories.filter(c => c.id !== category.id);
      this.applySearch();
    }
  }

  closeModal(): void {
    this.showCategoryModal = false;
    this.editingCategory = null;
  }

  closeForm(): void {
    this.isFormOpen = false;
    this.editingCategory = null;
  }

  getTotalProducts(): number {
    return this.categories.reduce((sum, cat) => sum + cat.productCount, 0);
  }

  getAverageProducts(): number {
    return this.categories.length > 0
      ? Math.round(this.getTotalProducts() / this.categories.length)
      : 0;
  }

  getTopCategory(): Category | null {
    return this.categories.length > 0
      ? this.categories.reduce((max, cat) =>
          cat.productCount > max.productCount ? cat : max
        )
      : null;
  }

}
