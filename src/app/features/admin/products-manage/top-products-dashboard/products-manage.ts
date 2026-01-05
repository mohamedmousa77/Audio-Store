import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'top-products-dashboard-manage',
  imports: [CommonModule],
  templateUrl: './products-manage.html',
  styleUrl: './products-manage.css',
})
export class TopProductsDashboardManage {
@Input() products: any[] = [];
}
