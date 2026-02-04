import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Category } from '../../../../../core/models/category';

/**
 * Category Showcase Component
 * Updated to accept categories via @Input() from parent
 * 
 * Breaking Changes:
 * - Now accepts categories via @Input() (not from service)
 * - Category ID is number (not string)
 */
@Component({
  selector: 'app-category-showcase',
  imports: [CommonModule, RouterModule],
  templateUrl: './category-showcase.html',
  styleUrl: './category-showcase.css',
})
export class CategoryShowcase {
    loading = signal<boolean>(true);

  /**
   * Categories to display
   * Passed from parent Homepage component
   */
  @Input() categories: Category[] = [];

  /**
   * Category images mapping
   * Fallback images for categories without images
   */
  categoryImages: { [key: string]: string } = {
    'Headphones': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop',
    'Speakers': 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=400&fit=crop',
    'Microphones': 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&h=400&fit=crop',
    'Turntables': 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&h=400&fit=crop',
    'Amplifiers': 'https://images.unsplash.com/photo-1616527166262-4b60a36b4d33?w=600&h=400&fit=crop',
    'Cables & Accessories': 'https://images.unsplash.com/photo-1611339555312-e607c25352ba?w=600&h=400&fit=crop'
  };

  /**
   * Get category image
   * Uses category.image if available, otherwise fallback to categoryImages
   * @param category Category object
   */
  getCategoryImage(category: Category): string {
    // Use category image if available
    if (category.icon) {
      return category.icon;
    }

    // Fallback to predefined images
    return this.categoryImages[category.name] || this.categoryImages['Headphones'];
  }
}
