import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  // Dati mock per popolare la vista (li sostituiremo poi con i Models)
  stats = [
    { label: 'Total Sales', value: '$48,250', change: '+12.5%', icon: 'payments', color: 'green' },
    { label: 'Total Orders', value: '1,245', change: '+5.2%', icon: 'shopping_bag', color: 'blue' },
    { label: 'Active Customers', value: '892', change: '0.0%', icon: 'group', color: 'gray' },
    { label: 'Pending Reviews', value: '14', change: '+3 New', icon: 'reviews', color: 'orange' }
  ];

  topProducts = [
    { name: 'Sony WH-1000XM5', category: 'Headphones', price: 349.00, sales: 124, status: 'In Stock', img: '🎧' },
    { name: 'Yeti Blue Mic', category: 'Microphones', price: 129.99, sales: 89, status: 'Low Stock', img: '🎙️' },
    { name: 'JBL Flip 6', category: 'Speakers', price: 99.95, sales: 76, status: 'In Stock', img: '🔊' },
  ];
}