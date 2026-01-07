import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiServices } from '../api/api-services';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { Category } from '../../models/category';

@Injectable({
  providedIn: 'root',
})
export class CategoryServices extends BaseApiServices {
  private readonly endpoint = API_ENDPOINTS.categories;

  // Recupera tutte le categorie per la navigazione e gestione
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.buildUrl(this.endpoint));
  }

  
  createCategory(category: Partial<Category>): Observable<Category> {
    return this.http.post<Category>(this.buildUrl(this.endpoint), category, {
      headers: this.getStandardHeaders()
    });
  }

  
  updateCategory(id: string, category: Partial<Category>): Observable<Category> {
    return this.http.put<Category>(`${this.buildUrl(this.endpoint)}/${id}`, category, {
      headers: this.getStandardHeaders()
    });
  }

  
  deleteCategory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.buildUrl(this.endpoint)}/${id}`);
  }
}
