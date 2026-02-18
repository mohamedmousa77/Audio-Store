import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardStats } from '../../../../core/models/DashboardStats';
import { TranslationService } from '../../../../core/services/translation/translation.service';

@Component({
  selector: 'app-stat-card',
  imports: [CommonModule],
  templateUrl: './stat-card.html',
  styleUrl: './stat-card.css',
})
export class StatCard {
  private translationService = inject(TranslationService);
  @Input() stat!: DashboardStats;

  translations = this.translationService.translations;
  get colorClass(): string {
    return `stat-${this.stat.color}`;
  }

  get isPositiveTrend(): boolean {
    return this.stat.trend.includes('+');
  }
}
