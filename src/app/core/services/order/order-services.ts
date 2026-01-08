import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { BaseApiServices } from '../api/api-services';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { Order, ShippingAddress, PaymentDetails} from '../../models/order';



@Injectable({
  providedIn: 'root',
})
// export class OrderServices extends BaseApiServices {
//   private readonly endpoint = API_ENDPOINTS.orders;

//   // Recupera la lista completa degli ordini per l'amministratore
//   getOrders(): Observable<Order[]> {
//     return this.http.get<Order[]>(this.buildUrl(this.endpoint));
//   }

//   // Visualizzazione del dettaglio di un singolo ordine
//   getOrderById(id: string): Observable<Order> {
//     return this.http.get<Order>(`${this.buildUrl(this.endpoint)}/${id}`);
//   }

//   // Modifica dello stato di un ordine tra i valori ammessi
//   updateOrderStatus(id: string, status: 'Processing' | 'Shipped' | 'Delivered' | 'Canceled'): Observable<Order> {
//     return this.http.patch<Order>(`${this.buildUrl(this.endpoint)}/${id}/status`, { status }, {
//       headers: this.getStandardHeaders()
//     });
//   }

//   // Recupera ordini specifici di un utente (per l'interfaccia Cliente)
//   getOrdersByUserId(userId: string): Observable<Order[]> {
//     return this.http.get<Order[]>(`${this.buildUrl(this.endpoint)}?userId=${userId}`);
//   }
// }

export class OrderServices {
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  public orders$ = this.ordersSubject.asObservable();
  
  private currentOrderSubject = new BehaviorSubject<Order | null>(null);
  public currentOrder$ = this.currentOrderSubject.asObservable();

  constructor() {
    this.loadOrdersFromLocalStorage();
  }

  private loadOrdersFromLocalStorage(): void {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      this.ordersSubject.next(JSON.parse(savedOrders));
    }
  }

  private saveOrdersToLocalStorage(): void {
    localStorage.setItem('orders', JSON.stringify(this.ordersSubject.value));
  }

  createOrder(
    shippingAddress: ShippingAddress,
    paymentDetails: PaymentDetails,
    items: any[],
    subtotal: number,
    shipping: number,
    tax: number
  ): Order {
    const order: Order = {
      id: `ORD-${Date.now()}`,
      orderNumber: `#${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date(),
      shippingAddress,
      paymentDetails,
      items,
      subtotal,
      shipping,
      tax,
      total: subtotal + shipping + tax,
      status: 'confirmed'
    };

    const currentOrders = this.ordersSubject.value;
    currentOrders.push(order);
    this.ordersSubject.next(currentOrders);
    this.currentOrderSubject.next(order);
    this.saveOrdersToLocalStorage();

    return order;
  }

  setCurrentOrder(order: Order): void {
    this.currentOrderSubject.next(order);
  }

  getCurrentOrder(): Observable<Order | null> {
    return this.currentOrder$;
  }

  getOrders(): Observable<Order[]> {
    return this.orders$;
  }

  getOrderById(id: string): Order | undefined {
    return this.ordersSubject.value.find(order => order.id === id);
  }

}
