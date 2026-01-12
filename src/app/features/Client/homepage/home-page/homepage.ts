import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientFooter } from '../../layout/client-footer/client-footer';
import { ClientHeader } from '../../layout/client-header/client-header';
import { ProductServices } from '../../../../core/services/product/product-services';
import { NewsletterSignup } from '../components/newsletter-signup/newsletter-signup';
import { CategoryShowcase } from '../components/category-showcase/category-showcase';
import { HeroBanner } from '../components/hero-banner/hero-banner';
import { FeaturedProducts } from '../components/featured-products/featured-products';
@Component({
  selector: 'app-homepage',
  imports: [
    CommonModule,
    NewsletterSignup,
    CategoryShowcase,
    ClientHeader,
    ClientFooter,
    HeroBanner,
    FeaturedProducts],
  templateUrl: './homepage.html',
  styleUrl: './homepage.css',
})
export class Homepage implements OnInit {  

  private productService = inject(ProductServices);

  ngOnInit(): void {
    this.loadData();
  }

  async loadData(): Promise<void> {
    this.productService.loadCatalogData();
    // await this.productService.categories;
  }

}
