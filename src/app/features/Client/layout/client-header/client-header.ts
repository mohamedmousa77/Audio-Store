import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ProductServices } from '../../../../core/services/product/product-services';
import { AuthServices } from '../../../../core/services/auth/auth-services';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-client-header',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './client-header.html',
  styleUrl: './client-header.css',
})
export class ClientHeader {
  private productService = inject(ProductServices);
  private router = inject(Router);

  searchTerm = '';
  mobileMenuOpen = false;
  cartItemCount = 2; // Mock
  isLoggedIn = false; // Mock

  categories = [
    { name: 'Headphones', path: '/category/Headphones' },
    { name: 'Speakers', path: '/category/Speakers' },
    { name: 'Microphones', path: '/category/Microphones' },
    { name: 'Earphones', path: '/category/Earphones' }
  ];

  ngOnInit(): void {
    // Load categories
    this.productService.categories();
  }

  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.productService.setSearch(this.searchTerm);
      this.router.navigate(['/category', 'all']);
    }
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }


}
