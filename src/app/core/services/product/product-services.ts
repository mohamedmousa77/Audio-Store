import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiServices } from '../api/api-services';
import { Product } from '../../models/product';
import { API_ENDPOINTS } from '../constants/api-endpoints';

@Injectable({
  providedIn: 'root',
})
export class ProductServices extends BaseApiServices {
  private readonly endpoint = API_ENDPOINTS.products;
  
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.buildUrl(this.endpoint));
  }
  
  getFeaturedProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.buildUrl(this.endpoint)}?isFeatured=true`);
  }

  // Recupera singolo prodotto con dettagli tecnici e galleria
  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.buildUrl(this.endpoint)}/${id}`);
  }

  createProduct(product: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(
      this.buildUrl(this.endpoint), 
      product, 
      { headers: this.getStandardHeaders() }
    );
  }

  updateProduct(id: string, product: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(
      `${this.buildUrl(this.endpoint)}/${id}`, 
      product, 
      { headers: this.getStandardHeaders() }
    );
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.buildUrl(this.endpoint)}/${id}`);
  }
}
