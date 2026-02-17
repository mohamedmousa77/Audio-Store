import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClientHeader } from '../../layout/client-header/client-header';
import { ClientFooter } from '../../layout/client-footer/client-footer';
import { ProductCard } from '../../layout/product-card/product-card';
import { CategoryShowcase } from '../../homepage/components/category-showcase/category-showcase';
import { ProductServices } from '../../../../core/services/product/product-services';
import { CategoryServices } from '../../../../core/services/category/category-services';
import { Product } from '../../../../core/models/product';
import { TranslationService } from '../../../../core/services/translation/translation.service';

@Component({
  selector: 'app-category-products-page',
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ClientHeader,
    ClientFooter,
    ProductCard,
    CategoryShowcase
  ],
  templateUrl: './category-products-page.html',
  styleUrl: './category-products-page.css',
})
export class CategoryProductsPage implements OnInit {
  private productService = inject(ProductServices);
  private categoryService = inject(CategoryServices);
  private route = inject(ActivatedRoute);
  private translationService = inject(TranslationService);

  // Translations
  translations = this.translationService.translations;

  // UI State
  isFiltersOpen = signal(false);
  loading = signal(true);

  // Data
  products: Product[] = [];
  private categoryProducts: Product[] = [];

  // Category Info
  categoryName = '';
  categoryDescription = signal('');
  categoryImage = signal('');

  // Filters
  searchTerm = '';
  sortBy: string = 'default';
  selectedBrand = '';
  availableBrands: string[] = [];
  otherCategories: any[] = [];

  breadcrumbs: Array<{ label: string; path: string }> = [
    { label: 'Home', path: '/' }
  ];

  ngOnInit(): void {
    this.route.params.subscribe(async params => {
      // Scroll to top on every category change
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });

      this.loading.set(true);
      const paramName = params['name'] || params['id'];
      this.categoryName = paramName;

      try {
        // Load categories first
        await this.categoryService.loadCategories();

        // Find category by name
        const categories = this.categoryService.categories();
        const category = categories.find(c => c.name.toLowerCase() === paramName.toLowerCase());

        if (category) {
          // Call API to get products for this specific category
          console.log(`🔄 Loading products for category ID: ${category.id}`);
          await this.categoryService.loadProductsByCategory(category.id);
        }

        this.initializeCategoryData(paramName);
      } catch (error) {
        console.error('Error loading category data:', error);
      } finally {
        this.loading.set(false);
      }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  initializeCategoryData(paramName: string): void {
    // 1. Find Category
    const categories = this.categoryService.categories();
    const category = categories.find(c => c.name.toLowerCase() === paramName.toLowerCase());

    if (category) {
      this.categoryName = category.name; // Normalize name
      this.categoryDescription.set(category.description || `Explore our collection of ${category.name}`);
      this.categoryImage.set(category.imageUrl || 'assets/images/placeholder-category.jpg');

      // Update breadcrumbs
      this.breadcrumbs = [
        { label: 'Home', path: '/' },
        { label: category.name, path: `/client/category/${category.name}` } // Use name for URL
      ];

      // 2. Filter Products by Category ID
      const allProducts = this.productService.products();
      if (paramName.toLowerCase() === 'all') {
        this.categoryProducts = allProducts;
        this.categoryName = 'All Products';
        this.categoryDescription.set('Browse our entire collection of premium audio gear.');
        this.categoryImage.set('https://images.unsplash.com/photo-1478737270239-2f02b77ac6d5?w=1600&q=80');
      } else {
        this.categoryProducts = allProducts.filter(p => p.categoryId === category.id);
        console.log(`📦 Found ${this.categoryProducts.length} products for category ${category.name}`);
      }

      // 3. Get other categories (exclude current)
      this.otherCategories = categories.filter(c => c.id !== category.id);

      // 4. Extract available brands from category products
      this.availableBrands = [...new Set(this.categoryProducts.map(p => p.brand))]
        .filter(brand => brand && brand.trim().length > 0)
        .sort();
    } else if (paramName.toLowerCase() === 'all') {
      // Fallback for "All" if no category entity exists
      this.categoryProducts = this.productService.products();
      this.categoryName = 'All Products';
      this.categoryDescription.set('Browse our entire collection of premium audio gear.');
      this.categoryImage.set('https://images.unsplash.com/photo-1478737270239-2f02b77ac6d5?w=1600&q=80');
    } else {
      // Category not found
      this.categoryDescription.set('Category not found.');
      this.categoryProducts = [];
    }

    // 3. Update Displayed Products
    this.applyFilters();
  }

  applyFilters(): void {
    // Start with all category products
    let result = [...this.categoryProducts];

    // Filter by brand
    if (this.selectedBrand) {
      result = result.filter(p => p.brand === this.selectedBrand);
    }

    // Sort
    this.applySortLogic(result);

    this.products = result;
  }

  applySort(): void {
    // Called by template change event
    this.applyFilters();
  }

  private applySortLogic(items: Product[]): void {
    switch (this.sortBy) {
      case 'price-low-high':
        items.sort((a, b) => a.price - b.price);
        break;
      case 'price-high-low':
        items.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        // Assuming id correlates with newness or if there's a date field
        items.sort((a, b) => b.id - a.id);
        break;
      case 'featured':
        // Assuming isFeatured boolean exists or sort by ID
        items.sort((a, b) => (b.categoryName === 'Headphones' ? 1 : -1)); // Dummy logic if no isFeatured
        break;
      default:
        // Default sort
        break;
    }
  }

  toggleFilters() {
    this.isFiltersOpen.update(v => !v);
  }

  // Method called by "Under $100" chips etc. 
  // Since template calls applyFilters() directly for these, we might need specific methods 
  // or bind them to a model. For now, we keep applyFilters generic.

  /**
   * Get icon name for category
   */
  getCategoryIcon(categoryName: string): string {
    const icons: { [key: string]: string } = {
      'Headphones': 'headphones',
      'Speakers': 'speaker',
      'Microphones': 'mic',
      'Turntables': 'album',
      'Amplifiers': 'graphic_eq',
      'Cables & Accessories': 'cable'
    };
    return icons[categoryName] || 'category';
  }
}
