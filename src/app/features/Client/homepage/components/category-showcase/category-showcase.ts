import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductServices } from '../../../../../core/services/product/product-services';

@Component({
  selector: 'app-category-showcase',
  imports: [CommonModule, RouterModule],
  templateUrl: './category-showcase.html',
  styleUrl: './category-showcase.css',
})
export class CategoryShowcase {
  private productService = inject(ProductServices);

  categories = this.productService.categories;
  loading = this.productService.isLoading;

  categoryImages: { [key: string]: string } = {
    'Headphones': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop',
    'Speakers': 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=400&fit=crop',
    'Microphones': 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&h=400&fit=crop',
    'Turntables': 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&h=400&fit=crop',
    'Amplifiers': 'https://images.unsplash.com/photo-1616527166262-4b60a36b4d33?w=600&h=400&fit=crop',
    'Cables & Accessories': 'https://images.unsplash.com/photo-1611339555312-e607c25352ba?w=600&h=400&fit=crop'
  };

  // ngOnInit(): void {
  //   this.loadCategories();
  // }

  // async loadCategories(): Promise<void> {
  //   this.loading = true;
  //   await this.productService.loadCatalogData();
  //   this.categories = this.productService.categories;
  //   this.loading = false;
  // }

  getCategoryImage(categoryName: string): string {
    return this.categoryImages[categoryName] || this.categoryImages['Headphones'];
  }

}
