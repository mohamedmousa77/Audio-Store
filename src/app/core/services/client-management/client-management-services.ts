import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiServices } from '../api/api-services';
import { API_ENDPOINTS } from '../constants/api-endpoints';

@Injectable({
  providedIn: 'root',
})
export class ClientManagementServices extends BaseApiServices {
  private readonly endpoint = API_ENDPOINTS.customers;

  // Consultazione lista completa clienti
  getCustomers(): Observable<any[]> {
    return this.http.get<any[]>(this.buildUrl(this.endpoint));
  }

  // Dettaglio singolo cliente con anagrafica e storico
  getCustomerById(id: string): Observable<any> {
    return this.http.get<any>(`${this.buildUrl(this.endpoint)}/${id}`);
  }

  
}
