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
  // featuredProducts: Product[] = [];
  // newArrivals: Product[] = [];

  // constructor(private productService: ProductServices) {}

  // ngOnInit(): void {
  //   // Carica prodotti in evidenza e nuovi prodotti come da Analisi Funzionale
  //   this.productService.getProducts().subscribe(products => {
  //     this.featuredProducts = products.filter(p => p.isFeatured);
  //     this.newArrivals = products.filter(p => p.isNew);
  //   });
  // }

  private productService = inject(ProductServices);

  heroBanner = {
    title: 'Experience Sound Like Never Before',
    subtitle: '',
    description:
      'The ZX-900 Noise Cancelling Headphones offer premium audio quality for the true audiophile. Immerse yourself in pure acoustic bliss.',
    primaryButtonText: 'Shop Now',
    secondaryButtonText: 'Learn More',
    primaryButtonLink: '/category/Headphones',
    secondaryButtonLink: '#featured',
    backgroundImage:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&h=800&fit=crop'
  };

  ngOnInit(): void {
    this.loadData();
  }

  async loadData(): Promise<void> {
    this.productService.loadCatalogData();
    // await this.productService.categories;
  }

}
