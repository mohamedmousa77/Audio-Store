import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface HeroBannerInterface {
  title: string;
  subtitle: string;
  description: string;
  primaryButtonText: string;
  secondaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonLink: string;
  backgroundImage: string;
}

@Component({
  selector: 'app-hero-banner',
  imports: [CommonModule, RouterModule],
  templateUrl: './hero-banner.html',
  styleUrl: './hero-banner.css',
})
export class HeroBanner {
   @Input() banner: HeroBannerInterface = {
    title: 'Experience Sound Like Never Before',
    subtitle: '',
    description: 'The ZX-900 Noise Cancelling Headphones offer premium audio quality for the true audiophile. Immerse yourself in pure acoustic bliss.',
    primaryButtonText: 'Shop Now',
    secondaryButtonText: 'Learn More',
    primaryButtonLink: '/category/headphones',
    secondaryButtonLink: '#featured',
    backgroundImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&h=800&fit=crop'
  };

}
