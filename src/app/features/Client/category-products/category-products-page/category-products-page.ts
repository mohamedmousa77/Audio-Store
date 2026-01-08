import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClientHeader } from '../../layout/client-header/client-header';
import { ClientFooter } from '../../layout/client-footer/client-footer';
import { ProductCard } from '../../layout/product-card/product-card';
import { ProductServices } from '../../../../core/services/product/product-services';


@Component({
  selector: 'app-category-products-page',
  imports: [
      CommonModule,
      RouterModule,
      FormsModule,
      ClientHeader,
      ClientFooter,
      ProductCard
    ],
  templateUrl: './category-products-page.html',
  styleUrl: './category-products-page.css',
})
export class CategoryProductsPage {
  private productService = inject(ProductServices);
  private route = inject(ActivatedRoute);

  isFiltersOpen = signal(false);
  
  products: any[] = [];
  loading = false;

  categoryName = '';
  categoryDescription = signal('Premium sound quality for your professional studio or home setup.');
  categoryImage = signal('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1600&q=80');
  filteredProducts: any[] = [];
  searchTerm = '';
  sortBy: 'featured' | 'price-low' | 'price-high' | 'newest' = 'featured';
  priceRange = { min: 0, max: 1000 };
  

  breadcrumbs: Array<{ label: string; path: string }> = [
    { label: 'Home', path: '/' }
  ];

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.categoryName = params['id'];
      this.breadcrumbs.push({
        label: this.categoryName,
        path: `/category/${this.categoryName}`
      });
      this.loadProducts();
    });
  }

  async loadProducts(): Promise<void> {
    this.loading = true;
    this.productService.loadCatalogData();
    this.productService.setCategory(this.categoryName);
    this.products = this.productService.products();
    this.applyFilters();
    this.loading = false;
  }

  applyFilters(): void {
    this.filteredProducts = this.products
      .filter(p => {
        const matchSearch = p.name
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase());
        const matchPrice = p.price >= this.priceRange.min && 
                          p.price <= this.priceRange.max;
        return matchSearch && matchPrice;
      });

    this.applySort();
  }

  applySort(): void {
    switch (this.sortBy) {
      case 'price-low':
        this.filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        this.filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        this.filteredProducts.sort((a, b) => 
          new Date(b.releaseDate || 0).getTime() - 
          new Date(a.releaseDate || 0).getTime()
        );
        break;
      case 'featured':
      default:
        this.filteredProducts.sort((a, b) => 
          (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0)
        );
    }
  }

  toggleFilters() {
    this.isFiltersOpen.update(v => !v);
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.sortBy = 'featured';
    this.priceRange = { min: 0, max: 1000 };
    this.applyFilters();
  }

}
