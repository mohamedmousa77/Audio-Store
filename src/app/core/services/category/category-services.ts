import { inject, Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { BaseApiServices } from '../api/api-services';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { Category } from '../../models/category';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryServices extends BaseApiServices {
    private httpService = inject(HttpService);



  // Recupera tutte le categorie per la navigazione e gestione
  getCategories(): Observable<Category[]> {
    return this.httpService.get<Category[]>(this.buildUrl(API_ENDPOINTS.categories.base));
  }

  
  createCategory(category: Partial<Category>): Observable<Category> {
    return this.httpService.post<Category>(this.buildUrl(API_ENDPOINTS.categories.base), category, {
      headers: this.getStandardHeaders()
    });
  }

  
  updateCategory(id: string, category: Partial<Category>): Observable<Category> {
    return this.httpService.put<Category>(`${this.buildUrl(API_ENDPOINTS.categories.base)}/${id}`, category, {
      headers: this.getStandardHeaders()
    });
  }

  
  deleteCategory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.buildUrl(this.endpoint)}/${id}`);
  }
}
