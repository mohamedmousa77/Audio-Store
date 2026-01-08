import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { BaseApiServices } from '../api/api-services';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { Order, ShippingAddress, PaymentDetails} from '../../models/order';
import { MOCK_ORDERS } from '../catalog-api.service';



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

  private useMockData = true;

  constructor() {
    this.loadOrdersFromLocalStorage();
  }

  private loadOrdersFromLocalStorage(): void {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
    try {
        const orders = JSON.parse(savedOrders);
        this.ordersSubject.next(orders);
      } catch (error) {
        console.error('Errore nel parsing degli ordini da localStorage', error);
        this.ordersSubject.next(MOCK_ORDERS);
      }
    } else {
      // Se non ci sono ordini salvati, usa i mock data
      this.ordersSubject.next(MOCK_ORDERS);
    }
  }

  private saveOrdersToLocalStorage(): void {
    localStorage.setItem('orders', JSON.stringify(this.ordersSubject.value));
  }

  createOrder(
    shippingAddress: ShippingAddress,
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
    if (this.useMockData) {
      return of(MOCK_ORDERS);
    }
    return this.orders$;
  }

  getOrderById$(id: string): Observable<Order | undefined> {
    if (this.useMockData) {
      const order = MOCK_ORDERS.find(o => o.id === id);
      return of(order);
    }
    const order = this.getOrderById(id);
    return of(order);
  }

  getOrderById(id: string): Order | undefined {
    const orders = this.ordersSubject.value;
    return orders.find(order => order.id === id);
  }

  getOrdersByUserId(userId: string): Observable<Order[]> {
    const userOrders = this.ordersSubject.value.filter(
      order => order.customerEmail?.toLowerCase().includes(userId.toLowerCase())
    );
    return of(userOrders);
  }

  /**
   * Ottiene gli ordini per email
   */
  getOrdersByEmail(email: string): Observable<Order[]> {
    const userOrders = this.ordersSubject.value.filter(
      order => order.customerEmail === email
    );
    return of(userOrders);
  }

  /**
   * Ottiene ordini per stato
   */
  getOrdersByStatus(status: Order['status']): Observable<Order[]> {
    const filteredOrders = this.ordersSubject.value.filter(
      order => order.status === status
    );
    return of(filteredOrders);
  }

  /**
   * Cancella un ordine
   */
  // cancelOrder(orderId: string): void {
  //   this.updateOrderStatus(orderId, 'canceled');
  // }

  /**
   * Calcola la data stimata di consegna (5-7 giorni lavorativi)
   */
  private calculateEstimatedDelivery(): Date {
    const date = new Date();
    date.setDate(date.getDate() + 5);
    return date;
  }
private generateTrackingNumber(): string {
    const prefix = 'IT';
    const randomNumbers = Math.floor(Math.random() * 1000000000000)
      .toString()
      .padStart(12, '0');
    const randomLetters = String.fromCharCode(
      65 + Math.floor(Math.random() * 26),
      65 + Math.floor(Math.random() * 26),
      65 + Math.floor(Math.random() * 26)
    );
    return `${prefix}${randomNumbers}${randomLetters}`;
  }

  /**
   * Svuota tutti gli ordini
   */
  clearAllOrders(): void {
    localStorage.removeItem('orders');
    this.ordersSubject.next([]);
  }

  /**
   * Ripristina i mock data
   */
  resetToMockData(): void {
    this.ordersSubject.next(MOCK_ORDERS);
    this.saveOrdersToLocalStorage();
  }


}
