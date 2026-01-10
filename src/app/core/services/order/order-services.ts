import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { BaseApiServices } from '../api/api-services';
import {map, switchMap, catchError} from 'rxjs/operators';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { Order, ShippingAddress} from '../../models/order';
import { MOCK_ORDERS } from '../catalog-api.service';
import { HttpClient } from '@angular/common/http';

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

// export class OrderServices {
//   private ordersSubject = new BehaviorSubject<Order[]>([]);
//   public orders$ = this.ordersSubject.asObservable();
  
//   private currentOrderSubject = new BehaviorSubject<Order | null>(null);
//   public currentOrder$ = this.currentOrderSubject.asObservable();

//   private useMockData = true;

//   constructor() {
//     this.loadOrdersFromLocalStorage();
//   }

//   private loadOrdersFromLocalStorage(): void {
//     const savedOrders = localStorage.getItem('orders');
//     if (savedOrders) {
//     try {
//         const orders = JSON.parse(savedOrders);
//         this.ordersSubject.next(orders);
//       } catch (error) {
//         console.error('Errore nel parsing degli ordini da localStorage', error);
//         this.ordersSubject.next(MOCK_ORDERS);
//       }
//     } else {
//       // Se non ci sono ordini salvati, usa i mock data
//       this.ordersSubject.next(MOCK_ORDERS);
//     }
//   }

//   private saveOrdersToLocalStorage(): void {
//     localStorage.setItem('orders', JSON.stringify(this.ordersSubject.value));
//   }

//   createOrder(
//     shippingAddress: ShippingAddress,
//     items: any[],
//     subtotal: number,
//     shipping: number,
//     tax: number
//   ): Order {
//     const order: Order = {
//       id: `ORD-${Date.now()}`,
//       orderNumber: `#${Math.floor(100000 + Math.random() * 900000)}`,
//       date: new Date(),
//       shippingAddress,
//       items,
//       subtotal,
//       shipping,
//       tax,
//       total: subtotal + shipping + tax,
//       status: 'confirmed'
//     };

//     const currentOrders = this.ordersSubject.value;
//     currentOrders.push(order);
//     this.ordersSubject.next(currentOrders);
//     this.currentOrderSubject.next(order);
//     this.saveOrdersToLocalStorage();

//     return order;
//   }

//   setCurrentOrder(order: Order): void {
//     this.currentOrderSubject.next(order);
//   }

//   getCurrentOrder(): Observable<Order | null> {
//     return this.currentOrder$;
//   }

//   getOrders(): Observable<Order[]> {
//     if (this.useMockData) {
//       return of(MOCK_ORDERS);
//     }
//     return this.orders$;
//     // return this.http.get<Order[]>(this.buildUrl(this.endpoint)).pipe(
//     //   map((orders) => {
//     //     this.ordersSubject.next(orders);
//     //     return orders;
//     //   })
//     // );
//   }

//   getOrderById$(id: string): Observable<Order | undefined> {
//     if (this.useMockData) {
//       const order = MOCK_ORDERS.find(o => o.id === id);
//       return of(order);
//     }
//     const order = this.getOrderById(id);
//     return of(order);
//   }

//   getOrderById(id: string): Order | undefined {
//     {
//       const localOrder = this.getOrderByIdFromLocalStorage(id);
//       if (localOrder) {
//         console.log('✓ Order found in localStorage:', localOrder);
//         return of(localOrder);
//       }

//       const orders = this.ordersSubject.value;
//       return orders.find(order => order.id === id);
//     }
//   }

//   getOrdersByUserId(userId: string): Observable<Order[]> {
//     const userOrders = this.ordersSubject.value.filter(
//       order => order.customerEmail?.toLowerCase().includes(userId.toLowerCase())
//     );
//     return of(userOrders);
//   }

//   /**
//    * Ottiene gli ordini per email
//    */
//   getOrdersByEmail(email: string): Observable<Order[]> {
//     const userOrders = this.ordersSubject.value.filter(
//       order => order.customerEmail === email
//     );
//     return of(userOrders);
//   }

//   /**
//    * Ottiene ordini per stato
//    */
//   getOrdersByStatus(status: Order['status']): Observable<Order[]> {
//     const filteredOrders = this.ordersSubject.value.filter(
//       order => order.status === status
//     );
//     return of(filteredOrders);
//   }

//   /**
//    * Cancella un ordine
//    */
//   // cancelOrder(orderId: string): void {
//   //   this.updateOrderStatus(orderId, 'canceled');
//   // }

//   /**
//    * Calcola la data stimata di consegna (5-7 giorni lavorativi)
//    */
//   private calculateEstimatedDelivery(): Date {
//     const date = new Date();
//     date.setDate(date.getDate() + 5);
//     return date;
//   }
  
// private generateTrackingNumber(): string {
//     const prefix = 'IT';
//     const randomNumbers = Math.floor(Math.random() * 1000000000000)
//       .toString()
//       .padStart(12, '0');
//     const randomLetters = String.fromCharCode(
//       65 + Math.floor(Math.random() * 26),
//       65 + Math.floor(Math.random() * 26),
//       65 + Math.floor(Math.random() * 26)
//     );
//     return `${prefix}${randomNumbers}${randomLetters}`;
//   }

//   /**
//    * Svuota tutti gli ordini
//    */
//   clearAllOrders(): void {
//     localStorage.removeItem('orders');
//     this.ordersSubject.next([]);
//   }

//   /**
//    * Ripristina i mock data
//    */
//   resetToMockData(): void {
//     this.ordersSubject.next(MOCK_ORDERS);
//     this.saveOrdersToLocalStorage();
//   }


// }


export class OrderServices extends BaseApiServices {
  private readonly endpoint = API_ENDPOINTS.orders;

  private ordersSubject = new BehaviorSubject<Order[]>([]);
  public orders$ = this.ordersSubject.asObservable();

  private currentOrderSubject = new BehaviorSubject<Order | null>(null);
  public currentOrder$ = this.currentOrderSubject.asObservable();

  private useMockData = true; // CAMBIA IN false QUANDO L'API È PRONTA

  constructor(http: HttpClient) {
    super(http); 
    this.loadOrdersFromLocalStorage();
  }

  /**
   * Recupera la lista completa degli ordini
   */
  getOrders(): Observable<Order[]> {
    if (this.useMockData) {
      return of(MOCK_ORDERS);
    }
    return this.http.get<Order[]>(this.buildUrl(this.endpoint)).pipe(
      map((orders) => {
        this.ordersSubject.next(orders);
        return orders;
      })
    );
  }

  /**
   * Recupera un singolo ordine per ID
   */
  getOrderById(id: string): Observable<Order | null> {
    console.log('🔍 Fetching order with ID:', id);

    if (this.useMockData) {
      // Prova localStorage FIRST
      const localOrder = this.getOrderByIdFromLocalStorage(id);
      if (localOrder) {
        console.log('✓ Order found in localStorage:', localOrder);
        return of(localOrder);
      }

      // Poi prova MOCKORDERS
      const mockOrder = MOCK_ORDERS.find((o) => o.id === id || o.orderNumber?.toString() === id);
      if (mockOrder) {
        console.log('✓ Order found in MOCKORDERS:', mockOrder);
        this.currentOrderSubject.next(mockOrder);
        return of(mockOrder);
      }

      console.warn('⚠ Order not found');
      return of(null);
    }

    // Se API è attiva, prova API poi fallback a localStorage
    return this.http.get<Order>(this.buildUrl(`${this.endpoint}/${id}`)).pipe(
      map((order) => {
        console.log('✓ Order fetched from API:', order);
        this.currentOrderSubject.next(order);
        return order;
      }),
      catchError((err) => {
        console.warn('⚠ API error, trying localStorage...');
        const localOrder = this.getOrderByIdFromLocalStorage(id);
        return of(localOrder);
      })
    );
  }

  /**
   * Carica ordine da localStorage
   */
  getOrderByIdFromLocalStorage(id: string): Order | null {
    const orders = this.ordersSubject.value;
    const order = orders.find((o) => o.id === id || o.orderNumber?.toString() === id);
    return order ?? null;
  }

  /**
   * Aggiorna lo stato dell'ordine
   */
  updateOrderStatus(
    id: string,
    status: 'Processing' | 'Shipped' | 'Delivered' | 'Canceled'
  ): Observable<Order> {
    return this.http.patch<Order>(
      this.buildUrl(`${this.endpoint}/${id}/status`),
      { status },
      { headers: this.getStandardHeaders() }
    );
  }

  /**
   * Recupera ordini per utente
   */
  getOrdersByUserId(userId: string): Observable<Order[]> {
    const userOrders = this.ordersSubject.value.filter(
      (order) => order.customerEmail?.toLowerCase().includes(userId.toLowerCase())
    );
    return of(userOrders);
  }

  /**
   * Crea nuovo ordine
   */
  createOrder(
    shippingAddress: ShippingAddress,
    items: any[],
    subtotal: number,
    shipping: number,
    tax: number
  ): Order {
    const order: Order = {
      id: `ORD-${Date.now()}`,
      orderNumber: (Math.floor(100000 + Math.random() * 900000)).toString(),
      date: new Date(),
      shippingAddress,
      items,
      subtotal,
      shipping,
      tax,
      total: subtotal + shipping + tax,
      status: 'confirmed',
      customerName: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
      customerEmail: shippingAddress.email,
      trackingNumber: this.generateTrackingNumber(),
      estimatedDelivery: this.calculateEstimatedDelivery(),
      paymentMethod: 'Cash on Delivery',
    };

    const currentOrders = this.ordersSubject.value;
    currentOrders.push(order);
    this.ordersSubject.next(currentOrders);
    this.currentOrderSubject.next(order);
    this.saveOrdersToLocalStorage();

    return order;
  }

  /**
   * Imposta ordine corrente
   */
  setCurrentOrder(order: Order): void {
    this.currentOrderSubject.next(order);
  }

  /**
   * Carica ordini da localStorage
   */
  private loadOrdersFromLocalStorage(): void {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      try {
        const orders = JSON.parse(savedOrders) as Order[];
        this.ordersSubject.next(orders);
        console.log('📂 Orders loaded from localStorage:', orders.length);
      } catch (error) {
        console.error('Error parsing orders:', error);
        this.ordersSubject.next(MOCK_ORDERS);
      }
    } else {
      this.ordersSubject.next(MOCK_ORDERS);
    }
  }

  /**
   * Salva ordini in localStorage
   */
  private saveOrdersToLocalStorage(): void {
    localStorage.setItem('orders', JSON.stringify(this.ordersSubject.value));
  }

  /**
   * Calcola data stimata consegna
   */
  private calculateEstimatedDelivery(): Date {
    const date = new Date();
    date.setDate(date.getDate() + 5);
    return date;
  }

  /**
   * Genera numero tracking
   */
  private generateTrackingNumber(): string {
    const prefix = 'IT';
    const randomNumbers = Math.floor(Math.random() * 1000000000000)
      .toString()
      .padStart(12, '0');
    const randomLetters =
      String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
      String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
      String.fromCharCode(65 + Math.floor(Math.random() * 26));
    return prefix + randomNumbers + randomLetters;
  }

  /**
   * Cancella tutto
   */
  clearAllOrders(): void {
    localStorage.removeItem('orders');
    this.ordersSubject.next([]);
  }

  /**
   * Ripristina mock data
   */
  resetToMockData(): void {
    this.ordersSubject.next(MOCK_ORDERS);
    this.saveOrdersToLocalStorage();
  }
}
