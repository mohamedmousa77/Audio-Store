import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminSidebar } from '../layout/admin-sidebar/admin-sidebar';
@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, AdminSidebar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  // Dati mock per popolare la vista (li sostituiremo poi con i Models)
topCategories = [
    { name: 'Headphones', value: '$12k', percent: '85%', icon: 'headphones' },
    { name: 'Speakers', value: '$8.4k', percent: '65%', icon: 'speaker' },
    { name: 'Cables', value: '$3.2k', percent: '35%', icon: 'cable' },
    { name: 'Microphones', value: '$2.1k', percent: '25%', icon: 'mic' },
  ];

  topProducts = [
    { name: 'Sony WH-1000XM5', category: 'Headphones', price: 349.00, sales: 124, status: 'In Stock', icon: '🎧' },
    { name: 'Yeti Blue Mic', category: 'Microphones', price: 129.99, sales: 89, status: 'Low Stock', icon: '🎙️' },
    { name: 'JBL Flip 6', category: 'Speakers', price: 99.95, sales: 76, status: 'In Stock', icon: '🔊' },
    { name: 'AirPods Pro 2', category: 'Headphones', price: 249.00, sales: 54, status: 'Out of Stock', icon: '👂' },
  ];
}