import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminSidebar } from '../../layout/admin-sidebar/admin-sidebar';
import { AdminHeader } from '../../layout/admin-header/header';
import { Badge } from '../../../../shared/components/badge/badge';
import { Product } from '../../../../core/models/product';
@Component({
  selector: 'app-products-page',
  imports: [CommonModule, FormsModule, AdminSidebar, AdminHeader, Badge],
  templateUrl: './products-page.html',
  styleUrl: './products-page.css',
})
export class ProductsPage {
  products: Product[] = [
    {
      id: '1',
      name: 'Sony WH-1000XM5',
      brand: 'Sony',
      sku: 'SNY-XM5-BLK',
      category: 'Headphones',
      price: 348.00,
      stock: 12,
      status: 'Available',
      isFeatured: true,
      isNew: true,
      image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&h=400&fit=crop'
    },
    {
      id: '2',
      name: 'Yeti Blue Microphone',
      brand: 'Logitech',
      sku: 'LOG-YET-SLV',
      category: 'Microphones',
      price: 120.00,
      stock: 0,
      status: 'Unavailable',
      isFeatured: false,
      isNew: false,
      image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=400&fit=crop'
    },
    {
      id: '3',
      name: 'KRK Rokit 5 G4',
      brand: 'KRK Systems',
      sku: 'KRK-ROK-5',
      category: 'Speakers',
      price: 189.00,
      stock: 4,
      status: 'Low Stock',
      isFeatured: true,
      isNew: false,
      image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop'
    },
    {
      id: '4',
      name: 'AirPods Pro 2',
      brand: 'Apple',
      sku: 'APP-PRO-2',
      category: 'Headphones',
      price: 249.00,
      stock: 85,
      status: 'Available',
      isFeatured: false,
      isNew: false,
      image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400&h=400&fit=crop'
    },
    {
      id: '5',
      name: 'AT-LP60X',
      brand: 'Audio-Technica',
      sku: 'AT-LP60',
      category: 'Turntables',
      price: 149.00,
      stock: 20,
      status: 'Available',
      isFeatured: false,
      isNew: true,
      image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=400&fit=crop'
    }
  ];

  filteredProducts: Product[] = [];
  searchTerm = '';
  selectedCategory = '';
  selectedStatus = '';
  showProductModal = false;
  editingProduct: Product | null = null;

  categories = ['Headphones', 'Speakers', 'Microphones', 'Turntables', 'Accessories'];

  ngOnInit(): void {
    this.filteredProducts = [...this.products];
  }

  applyFilters(): void {
    this.filteredProducts = this.products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           product.sku.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCategory = !this.selectedCategory || product.category === this.selectedCategory;
      const matchesStatus = !this.selectedStatus || product.status === this.selectedStatus;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.selectedStatus = '';
    this.filteredProducts = [...this.products];
  }

  openAddProduct(): void {
    this.editingProduct = null;
    this.showProductModal = true;
  }

  editProduct(product: Product): void {
    this.editingProduct = { ...product };
    this.showProductModal = true;
  }

  deleteProduct(product: Product): void {
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      this.products = this.products.filter(p => p.id !== product.id);
      this.applyFilters();
    }
  }

  closeModal(): void {
    this.showProductModal = false;
    this.editingProduct = null;
  }

  saveProduct(): void {
    // In futuro: chiamata API
    this.showProductModal = false;
    this.editingProduct = null;
  }


}
