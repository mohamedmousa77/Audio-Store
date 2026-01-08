import { Injectable } from '@angular/core';
import { delay, of, Observable, firstValueFrom } from 'rxjs';
import { BaseApiServices } from '../api/api-services';
import { Product } from '../../models/product';
import { CatalogStore } from '../../../features/Client/state/catalog-store';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { CatalogApiService } from '../catalog-api.service';


@Injectable({
  providedIn: 'root',
})
export class ProductServices {  
  // private readonly endpoint = API_ENDPOINTS.products;

  // getProducts(): Observable<Product[]> {
  //   return this.http.get<Product[]>(this.buildUrl(this.endpoint));
  // }
  
  // getFeaturedProducts(): Observable<Product[]> {
  //   return this.http.get<Product[]>(`${this.buildUrl(this.endpoint)}?isFeatured=true`);
  // }

  // // Recupera singolo prodotto con dettagli tecnici e galleria
  // getProductById(id: string): Observable<Product> {
  //   // return this.getProducts().pipe(
  //   //   delay(300)
  //   // );
  //   return this.http.get<Product>(`${this.buildUrl(this.endpoint)}/${id}`);
  // }

  // createProduct(product: Partial<Product>): Observable<Product> {
  //   return this.http.post<Product>(
  //     this.buildUrl(this.endpoint), 
  //     product, 
  //     { headers: this.getStandardHeaders() }
  //   );
  // }

  // updateProduct(id: string, product: Partial<Product>): Observable<Product> {
  //   return this.http.put<Product>(
  //     `${this.buildUrl(this.endpoint)}/${id}`, 
  //     product, 
  //     { headers: this.getStandardHeaders() }
  //   );
  // }

  // deleteProduct(id: string): Observable<void> {
  //   return this.http.delete<void>(`${this.buildUrl(this.endpoint)}/${id}`);
  // }

constructor(
    private catalogApi: CatalogApiService,
    private catalogStore: CatalogStore
  ) {}

  // Carica tutto e popola lo stato globale
  async loadCatalogData(): Promise<void> {
    this.catalogStore.loadingSignal.set(true);
    try {
      // Eseguiamo entrambi i caricamenti in parallelo per velocità
      const [products, categories] = await Promise.all([
        firstValueFrom(this.catalogApi.getProducts()),
        firstValueFrom(this.catalogApi.getCategories()),
      ]);
      
      this.catalogStore.setProducts(products);
      this.catalogStore.setCategories(categories);
    } catch (error) {
      this.catalogStore.errorSignal.set('Failed to load catalog data');
    } finally {
      this.catalogStore.loadingSignal.set(false);
    }
  }

  // Caricamento efficiente per ID: cerca prima nello stato, poi nell'API
  async getProductDetails(id: string): Promise<Product | undefined> {
    // 1. Cerca nei prodotti già caricati (Signal)
    const existing = this.catalogStore.productsSignal().find(p => p.id === id);
    if (existing) return existing;

    // 2. Se non c'è (es. accesso diretto via URL), chiedi all'API
    try {
      return await firstValueFrom(this.catalogApi.getProductById(id));
    } catch (error) {
      return undefined;
    }
  }

  // --- GETTERS PER I COMPONENTI (Signals) ---
  // I componenti useranno questi per visualizzare i dati
  get products() { return this.catalogStore.filteredProducts; }
  get featured() { return this.catalogStore.featuredProducts; }
  get categories() { return this.catalogStore.categories; }
  get isLoading() { return this.catalogStore.loadingSignal; }

  // --- FILTRARE ---
  setCategory(category: string) { this.catalogStore.setSelectedCategory(category); }
  setSearch(term: string) { this.catalogStore.setSearchTerm(term); }
}
