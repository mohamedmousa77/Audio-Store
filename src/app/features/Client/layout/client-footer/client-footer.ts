import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslationService } from '../../../../core/services/translation/translation.service';

interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

@Component({
  selector: 'app-client-footer',
  imports: [CommonModule, RouterModule],
  templateUrl: './client-footer.html',
  styleUrl: './client-footer.css',
})
export class ClientFooter {
  private translationService = inject(TranslationService);

  translations = this.translationService.translations;
  currentYear = new Date().getFullYear();

  socialLinks = [
    { icon: 'facebook', label: 'Facebook', href: '#' },
    { icon: 'twitter', label: 'Twitter', href: '#' },
    { icon: 'instagram', label: 'Instagram', href: '#' }
  ];

  get footerSections(): FooterSection[] {
    const t = this.translations();
    return [
      {
        title: 'Shop',
        links: [
          { label: 'All Headphones', href: '/category/Headphones' },
          { label: 'Wireless Speakers', href: '/category/Speakers' },
          { label: 'In-Ear Monitors', href: '/category/Microphones' },
          { label: 'Accessories', href: '/category/Cables & Accessories' }
        ]
      },
      {
        title: t.footer.contactUs,
        links: [
          { label: 'Contact Us', href: '/contact' },
          { label: 'Shipping Policy', href: '/shipping' },
          { label: 'Returns & Exchanges', href: '/returns' },
          { label: 'FAQ', href: '/faq' }
        ]
      },
      {
        title: 'Contact',
        links: [
          { label: '123 Audio Ave, Sound City, SC 90210', href: '#' },
          { label: '+1 (555) 123-4567', href: 'tel:+15551234567' },
          { label: 'hello@audiostore.com', href: 'mailto:hello@audiostore.com' }
        ]
      }
    ];
  }
}
