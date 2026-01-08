import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { BaseApiServices } from './api/api-services';
import { Product } from '../models/product';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class CatalogApiService extends BaseApiServices {
  private useMock = true; // CAMBIA IN 'false' QUANDO L'API È PRONTA

  constructor(protected override http: HttpClient) {
    super(http);
  }

  // --- PRODOTTI ---
  getProducts(): Observable<Product[]> {
    if (this.useMock) {
      return of(this.getMockProducts()).pipe(delay(500));
    }
    return this.http.get<Product[]>(this.buildUrl('products'));
  }

  getProductById(id: string): Observable<Product> {
    if (this.useMock) {
      const product = this.getMockProducts().find(p => p.id === id);
      return of(product!).pipe(delay(300));
    }
    return this.http.get<Product>(this.buildUrl(`products/${id}`));
  }

  // --- CATEGORIE ---
  getCategories(): Observable<Category[]> {
    if (this.useMock) {
      return of(this.getMockCategories()).pipe(delay(300));
    }
    return this.http.get<Category[]>(this.buildUrl('categories'));
  }

  // --- DATI MOCK (Spostati qui dai file originali) ---
  private  getMockProducts(): Product[] {
    return [
        {
          id: '1',
          name: 'Sony WH-1000XM5',
          brand: 'Sony',
          sku: 'SNY-XM5-BLK',
          category: 'Headphones',
          price: 348.0,
          stock: 12,
          status: 'Available',
          isFeatured: true,
          isNew: true,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
          description: 'Industry-leading noise cancelling'
        },
        {
          id: '2',
          name: 'Bose QuietComfort 45',
          brand: 'Bose',
          sku: 'BOS-QC45',
          category: 'Headphones',
          price: 329.0,
          stock: 8,
          status: 'Available',
          isFeatured: true,
          isNew: false,
          image: 'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=500&h=500&fit=crop',
          description: 'Iconic quiet, comfort, and sound'
        },
        {
          id: '3',
          name: 'Sennheiser Momentum 4',
          brand: 'Sennheiser',
          sku: 'SEN-MOM4',
          category: 'Headphones',
          price: 299.0,
          stock: 15,
          status: 'Available',
          isFeatured: false,
          isNew: false,
          image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&h=500&fit=crop',
          description: '60-hour battery life'
        },
        {
          id: '4',
          name: 'Apple AirPods Max',
          brand: 'Apple',
          sku: 'APP-AML-SLV',
          category: 'Headphones',
          price: 549.0,
          stock: 5,
          status: 'Low Stock',
          isFeatured: false,
          isNew: true,
          image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=500&h=500&fit=crop',
          description: 'High-fidelity audio'
        },
        {
          id: '5',
          name: 'KRK Rokit 5 G4',
          brand: 'KRK Systems',
          sku: 'KRK-ROK-5',
          category: 'Speakers',
          price: 189.0,
          stock: 4,
          status: 'Low Stock',
          isFeatured: true,
          isNew: false,
          image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop',
          description: 'Professional studio monitors'
        },
        {
          id: '6',
          name: 'Audio-Technica AT-LP60X',
          brand: 'Audio-Technica',
          sku: 'AT-LP60',
          category: 'Turntables',
          price: 149.0,
          stock: 20,
          status: 'Available',
          isFeatured: false,
          isNew: true,
          image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=500&h=500&fit=crop',
          description: 'Entry-level turntable'
        },
        {
          id: '7',
          name: 'Shure SM7B Microphone',
          brand: 'Shure',
          sku: 'SHR-SM7B',
          category: 'Microphones',
          price: 399.0,
          stock: 0,
          status: 'Unavailable',
          isFeatured: false,
          isNew: false,
          image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=500&h=500&fit=crop',
          description: 'Professional broadcast microphone'
        },
        {
          id: '8',
          name: 'Rode NT1 Signature',
          brand: 'Rode',
          sku: 'RODE-NT1',
          category: 'Microphones',
          price: 289.0,
          stock: 10,
          status: 'Available',
          isFeatured: true,
          isNew: false,
          image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=500&h=500&fit=crop',
          description: 'Studio condenser microphone'
        }
    ];
  }

  private getMockCategories(): Category[] {
    return [
        {
            id: '1',
            name: 'Headphones',
            description: 'Premium audio headphones and earbuds',
            icon: 'headphones',
            productCount: 45
        },
        {
            id: '2',
            name: 'Speakers',
            description: 'High-quality speakers for home and studio',
            icon: 'speaker',
            productCount: 28
        },
        {
            id: '3',
            name: 'Microphones',
            description: 'Professional recording microphones',
            icon: 'mic',
            productCount: 32
        },
        {
            id: '4',
            name: 'Turntables',
            description: 'Vinyl turntables and record players',
            icon: 'album',
            productCount: 12
        },
        {
            id: '5',
            name: 'Amplifiers',
            description: 'Audio amplifiers and preamps',
            icon: 'graphic_eq',
            productCount: 18
        },
        {
            id: '6',
            name: 'Cables & Accessories',
            description: 'Audio cables, adapters, and accessories',
            icon: 'cable',
            productCount: 156
        }
    ];
  }
}