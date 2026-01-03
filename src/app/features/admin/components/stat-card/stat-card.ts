import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardStats } from '../../../../core/models/DashboardStats';


@Component({
  selector: 'app-stat-card',
  imports: [CommonModule],
  templateUrl: './stat-card.html',
  styleUrl: './stat-card.css',
})
export class StatCard {
@Input() stat!: DashboardStats;

  get colorClass(): string {
    return `stat-${this.stat.color}`;
  }

  get isPositiveTrend(): boolean {
    return this.stat.trend.includes('+');
  }
}
