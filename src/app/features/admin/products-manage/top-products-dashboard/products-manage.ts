import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopProduct } from '../../../../core/models/dashboard';
import { TranslationService } from '../../../../core/services/translation/translation.service';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'top-products-dashboard-manage',
  imports: [CommonModule, RouterModule],
  templateUrl: './products-manage.html',
  styleUrl: './products-manage.css',
})
export class TopProductsDashboardManage {
@Input() products: TopProduct[] = [];
private translationService = inject(TranslationService);

translations = this.translationService.translations;


}
