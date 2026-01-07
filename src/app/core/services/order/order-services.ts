import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiServices } from '../api/api-services';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { Order } from '../../models/order';
@Injectable({
  providedIn: 'root',
})
export class OrderServices extends BaseApiServices {
  private readonly endpoint = API_ENDPOINTS.orders;

  // Recupera la lista completa degli ordini per l'amministratore
  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.buildUrl(this.endpoint));
  }

  // Visualizzazione del dettaglio di un singolo ordine
  getOrderById(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.buildUrl(this.endpoint)}/${id}`);
  }

  // Modifica dello stato di un ordine tra i valori ammessi
  updateOrderStatus(id: string, status: 'Processing' | 'Shipped' | 'Delivered' | 'Canceled'): Observable<Order> {
    return this.http.patch<Order>(`${this.buildUrl(this.endpoint)}/${id}/status`, { status }, {
      headers: this.getStandardHeaders()
    });
  }

  // Recupera ordini specifici di un utente (per l'interfaccia Cliente)
  getOrdersByUserId(userId: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.buildUrl(this.endpoint)}?userId=${userId}`);
  }
}
