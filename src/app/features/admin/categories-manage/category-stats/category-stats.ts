import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface CategoryStat {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

@Component({
  selector: 'app-category-stats',
  imports: [CommonModule],
  templateUrl: './category-stats.html',
  styleUrl: './category-stats.css',
})
export class CategoryStats {
  @Input() categories: CategoryStat[] = [];

  hoveredCategory: CategoryStat | null = null;

  getTotalSales(): number {
    return this.categories.reduce((sum, cat) => sum + cat.value, 0);
  }

  getDashArray(percentage: number): string {
    const circum = 440;
    const part = (percentage * 4.4) - 4;
    return `${part} ${circum}`;
  }
  
  getStrokeDashOffset(index: number): number {
    const cumulativePercentage = this.categories
      .slice(0, index)
      .reduce((sum, cat) => sum + cat.percentage, 0);
    return -(cumulativePercentage * 4.4);
  }

  onHover(category: CategoryStat): void {
    this.hoveredCategory = category;
  }

  onLeave(): void {
    this.hoveredCategory = null;
  }
}
