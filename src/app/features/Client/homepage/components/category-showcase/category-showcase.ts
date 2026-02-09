import { Component, Input, signal, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Category } from '../../../../../core/models/category';
import { TranslationService } from '../../../../../core/services/translation/translation.service';

/**
 * Category Showcase Component
 * Updated to accept categories via @Input() from parent
 * Implements horizontal scrolling for multiple categories
 */
@Component({
  selector: 'app-category-showcase',
  imports: [CommonModule, RouterModule],
  templateUrl: './category-showcase.html',
  styleUrl: './category-showcase.css',
})
export class CategoryShowcase {
  // Loading is managed by the parent HomePage; start as not loading here
  loading = signal<boolean>(false);
  private translationService = inject(TranslationService);

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  /**
   * Categories to display
   * Passed from parent Homepage component
   */
  @Input() categories: Category[] = [];

  translations = this.translationService.translations;


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

  scrollLeft() {
    if (this.scrollContainer?.nativeElement) {
      this.scrollContainer.nativeElement.scrollBy({ left: -350, behavior: 'smooth' });
    }
  }

  scrollRight() {
    if (this.scrollContainer?.nativeElement) {
      this.scrollContainer.nativeElement.scrollBy({ left: 350, behavior: 'smooth' });
    }
  }
}
