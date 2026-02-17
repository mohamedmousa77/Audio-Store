import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { TranslationService } from '../../../../core/services/translation/translation.service';
import { AuthServices } from '../../../../core/services/auth/auth-services';
@Component({
  selector: 'app-admin-header',
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class AdminHeader {
  private router = inject(Router);
  private translationService = inject(TranslationService);
  private authService = inject(AuthServices);

  adminName = '';
  adminEmail = '';
  pageTitle = 'Dashboard Overview';
  pageSubtitle = '';

  currentLanguage = this.translationService.currentLanguage;
  translations = this.translationService.translations;

  constructor() {
    effect(() => {
      // depend on the signal
      const lang = this.translationService.currentLanguage();
      // update the UI text
      this.updatePageInfo(this.router.url);
    });
  }

  ngOnInit(): void {
    // Load admin user data from JWT/localStorage
    const user = this.authService.getCurrentUser();
    if (user) {
      this.adminName = user.name || `${user.firstName} ${user.lastName}`;
      this.adminEmail = user.email;
    }

    this.updatePageInfo(this.router.url);

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.router.url)
      )
      .subscribe(url => this.updatePageInfo(url));
  }

  private updatePageInfo(url: string): void {
    this.pageTitle = this.getPageTitle(url);
    this.pageSubtitle = this.getPageSubtitle(url);
  }

  private getPageTitle(url: string): string {
    if (url.includes('/dashboard')) return this.translations().dashboard.header.title;
    if (url.includes('/products')) return this.translations().productsManagement.header.title;
    if (url.includes('/orders')) return this.translations().ordersManagement.header.title;
    if (url.includes('/customers')) return this.translations().customersManagement.header.title;
    if (url.includes('/categories')) return this.translations().categoriesManagement.header.title;
    return this.translations().admin.headerTitle;
  }

  private getPageSubtitle(url: string): string {
    if (url.includes('/dashboard')) return this.translations().dashboard.header.subtitle;
    if (url.includes('/products')) return this.translations().productsManagement.header.subtitle;
    if (url.includes('/orders')) return this.translations().ordersManagement.header.subtitle;
    if (url.includes('/customers')) return this.translations().customersManagement.header.subtitle;
    if (url.includes('/categories')) return this.translations().categoriesManagement.header.subtitle;
    return this.translations().admin.headerTitle;
  }

  toggleLanguage(): void {
    this.translationService.toggleLanguage();
  }

  getLanguageCode(): string {
    return this.translationService.getLanguageCode();
  }

  NavigateToProfile(): void {
    this.router.navigate(['/client/profile']);
  }
}
