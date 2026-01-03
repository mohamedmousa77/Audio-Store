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

  getTotalSales(): number {
    return this.categories.reduce((sum, cat) => sum + cat.value, 0);
  }

  getStrokeDashOffset(index: number): number {
    const cumulativePercentage = this.categories
      .slice(0, index)
      .reduce((sum, cat) => sum + cat.percentage * 4.4, 0);
    return -(440 - cumulativePercentage);
  }
}
