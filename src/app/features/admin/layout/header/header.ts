import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
@Component({
  selector: 'app-admin-header',
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class AdminHeader {
private router = inject(Router);
  
  pageTitle = 'Dashboard Overview';
  breadcrumbs: string[] = [];

  ngOnInit(): void {
    this.updatePageInfo(this.router.url);
    
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.router.url)
      )
      .subscribe(url => this.updatePageInfo(url));
  }

  private updatePageInfo(url: string): void {
    const segments = url.split('/').filter(s => s);
    this.breadcrumbs = segments.map(s => this.capitalize(s));
    this.pageTitle = this.getPageTitle(url);
  }

  private getPageTitle(url: string): string {
    if (url.includes('/dashboard')) return 'Dashboard Overview';
    if (url.includes('/products')) return 'Products Management';
    if (url.includes('/orders')) return 'Orders Management';
    if (url.includes('/customers')) return 'Customers Management';
    if (url.includes('/categories')) return 'Categories Management';
    return 'Admin Panel';
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
