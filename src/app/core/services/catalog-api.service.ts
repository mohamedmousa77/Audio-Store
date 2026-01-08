import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { BaseApiServices } from './api/api-services';
import { Product } from '../models/product';
import { Category } from '../models/category';
import { Order } from '../models/order';

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

private getMockOrders(): Order[] {
  return  [
  {
    id: 'ORD-001-2024',
    orderNumber: '#100001',
    customerName: 'Giovanni Rossi',
    customerEmail: 'giovanni.rossi@email.com',
    date: new Date('2024-01-15'),
    time: '14:30',
    status: 'delivered',
    trackingNumber: 'IT123456789ABC',
    estimatedDelivery: new Date('2024-01-22'),
    shippingAddress: {
      firstName: 'Giovanni',
      lastName: 'Rossi',
      email: 'giovanni.rossi@email.com',
      phone: '+39 348 1234567',
      address: 'Via Roma 123, Appartamento 5',
      city: 'Rome',
      zipCode: '00100',
      country: 'Italy'
    },
    paymentDetails: {
      cardholderName: 'Giovanni Rossi',
      cardNumber: '****1234',
      expiryDate: '12/25',
      cvv: '***',
      billingAddress: {
        firstName: 'Giovanni',
        lastName: 'Rossi',
        email: 'giovanni.rossi@email.com',
        phone: '+39 348 1234567',
        address: 'Via Roma 123, Appartamento 5',
        city: 'Rome',
        zipCode: '00100',
        country: 'Italy'
      }
    },
    items: [
      {
        id: 'ITEM-001',
        productId: 'PROD-001',
        name: 'Premium Wireless Headphones',
        price: 299.99,
        quantity: 1,
        image: 'https://via.placeholder.com/100x100?text=Headphones',
        category: 'Electronics',
        sku: 'HDN-2024-001'
      },
      {
        id: 'ITEM-002',
        productId: 'PROD-002',
        name: 'Phone Case - Black',
        price: 29.99,
        quantity: 2,
        image: 'https://via.placeholder.com/100x100?text=Case',
        category: 'Accessories',
        sku: 'CASE-2024-BLK'
      }
    ],
    subtotal: 359.97,
    shipping: 5.99,
    tax: 36.00,
    total: 401.96,
    // notes: 'Delivered on 22/01/2024 at 10:45 AM'
  },

  {
    id: 'ORD-002-2024',
    orderNumber: '#100002',
    customerName: 'Maria Bianchi',
    customerEmail: 'maria.bianchi@email.com',
    date: new Date('2024-02-03'),
    time: '10:15',
    status: 'shipped',
    trackingNumber: 'IT987654321XYZ',
    estimatedDelivery: new Date('2024-02-08'),
    shippingAddress: {
      firstName: 'Maria',
      lastName: 'Bianchi',
      email: 'maria.bianchi@email.com',
      phone: '+39 333 9876543',
      address: 'Via Milano 456',
      city: 'Milan',
      zipCode: '20100',
      country: 'Italy'
    },
    paymentDetails: {
      cardholderName: 'Maria Bianchi',
      cardNumber: '****5678',
      expiryDate: '08/26',
      cvv: '***',
      billingAddress: {
        firstName: 'Maria',
        lastName: 'Bianchi',
        email: 'maria.bianchi@email.com',
        phone: '+39 333 9876543',
        address: 'Via Milano 456',
        city: 'Milan',
        zipCode: '20100',
        country: 'Italy'
      }
    },
    items: [
      {
        id: 'ITEM-003',
        productId: 'PROD-003',
        name: 'Portable Bluetooth Speaker',
        price: 79.99,
        quantity: 1,
        image: 'https://via.placeholder.com/100x100?text=Speaker',
        category: 'Electronics',
        sku: 'SPKR-2024-001'
      },
      {
        id: 'ITEM-004',
        productId: 'PROD-004',
        name: 'USB-C Charging Cable',
        price: 19.99,
        quantity: 3,
        image: 'https://via.placeholder.com/100x100?text=Cable',
        category: 'Accessories',
        sku: 'CBL-USB-C'
      }
    ],
    subtotal: 139.96,
    shipping: 5.99,
    tax: 14.40,
    total: 160.35,
    // notes: 'In transit - Expected delivery on 08/02/2024'
  },

  {
    id: 'ORD-003-2024',
    orderNumber: '#100003',
    customerName: 'Marco Ferrari',
    customerEmail: 'marco.ferrari@email.com',
    date: new Date('2024-02-10'),
    time: '16:45',
    status: 'confirmed',
    trackingNumber: null,
    estimatedDelivery: new Date('2024-02-15'),
    shippingAddress: {
      firstName: 'Marco',
      lastName: 'Ferrari',
      email: 'marco.ferrari@email.com',
      phone: '+39 345 5555666',
      address: 'Corso Vittorio Emanuele 789, Piano 3',
      city: 'Naples',
      zipCode: '80100',
      country: 'Italy'
    },
    paymentDetails: {
      cardholderName: 'Marco Ferrari',
      cardNumber: '****9012',
      expiryDate: '06/27',
      cvv: '***',
      billingAddress: {
        firstName: 'Marco',
        lastName: 'Ferrari',
        email: 'marco.ferrari@email.com',
        phone: '+39 345 5555666',
        address: 'Corso Vittorio Emanuele 789, Piano 3',
        city: 'Naples',
        zipCode: '80100',
        country: 'Italy'
      }
    },
    items: [
      {
        id: 'ITEM-005',
        productId: 'PROD-005',
        name: 'Laptop Stand',
        price: 49.99,
        quantity: 1,
        image: 'https://via.placeholder.com/100x100?text=Stand',
        category: 'Computer Accessories',
        sku: 'STAND-2024-001'
      },
      {
        id: 'ITEM-006',
        productId: 'PROD-006',
        name: 'Wireless Mouse',
        price: 34.99,
        quantity: 1,
        image: 'https://via.placeholder.com/100x100?text=Mouse',
        category: 'Computer Accessories',
        sku: 'MOUSE-WRL-001'
      },
      {
        id: 'ITEM-007',
        productId: 'PROD-007',
        name: 'USB Hub - 7 Port',
        price: 39.99,
        quantity: 1,
        image: 'https://via.placeholder.com/100x100?text=Hub',
        category: 'Computer Accessories',
        sku: 'HUB-USB-7PORT'
      }
    ],
    subtotal: 124.97,
    shipping: 5.99,
    tax: 13.00,
    total: 143.96,
    // notes: 'Payment confirmed - Processing for shipment'
  },

  {
    id: 'ORD-004-2024',
    orderNumber: '#100004',
    customerName: 'Laura Conti',
    customerEmail: 'laura.conti@email.com',
    date: new Date('2024-02-15'),
    time: '09:30',
    status: 'pending',
    trackingNumber: null,
    estimatedDelivery: new Date('2024-02-20'),
    shippingAddress: {
      firstName: 'Laura',
      lastName: 'Conti',
      email: 'laura.conti@email.com',
      phone: '+39 320 7777888',
      address: 'Via Torino 321',
      city: 'Turin',
      zipCode: '10100',
      country: 'Italy'
    },
    paymentDetails: {
      cardholderName: 'Laura Conti',
      cardNumber: '****3456',
      expiryDate: '03/25',
      cvv: '***',
      billingAddress: {
        firstName: 'Laura',
        lastName: 'Conti',
        email: 'laura.conti@email.com',
        phone: '+39 320 7777888',
        address: 'Via Torino 321',
        city: 'Turin',
        zipCode: '10100',
        country: 'Italy'
      }
    },
    items: [
      {
        id: 'ITEM-008',
        productId: 'PROD-008',
        name: 'Smart Watch - Silver',
        price: 199.99,
        quantity: 1,
        image: 'https://via.placeholder.com/100x100?text=Watch',
        category: 'Wearables',
        sku: 'WATCH-SMART-SLV'
      },
      {
        id: 'ITEM-009',
        productId: 'PROD-009',
        name: 'Watch Band Replacement',
        price: 29.99,
        quantity: 2,
        image: 'https://via.placeholder.com/100x100?text=Band',
        category: 'Wearables',
        sku: 'BAND-WATCH-001'
      }
    ],
    subtotal: 259.97,
    shipping: 5.99,
    tax: 26.60,
    total: 292.56,
    // notes: 'Order received - Awaiting payment confirmation'
  },

  {
    id: 'ORD-005-2024',
    orderNumber: '#100005',
    customerName: 'Alessandro De Luca',
    customerEmail: 'alex.deluca@email.com',
    date: new Date('2024-01-20'),
    time: '13:20',
    status: 'canceled',
    trackingNumber: null,
    estimatedDelivery: null,
    shippingAddress: {
      firstName: 'Alessandro',
      lastName: 'De Luca',
      email: 'alex.deluca@email.com',
      phone: '+39 371 1111222',
      address: 'Via Venezia 654',
      city: 'Venice',
      zipCode: '30100',
      country: 'Italy'
    },
    paymentDetails: {
      cardholderName: 'Alessandro De Luca',
      cardNumber: '****7890',
      expiryDate: '11/24',
      cvv: '***',
      billingAddress: {
        firstName: 'Alessandro',
        lastName: 'De Luca',
        email: 'alex.deluca@email.com',
        phone: '+39 371 1111222',
        address: 'Via Venezia 654',
        city: 'Venice',
        zipCode: '30100',
        country: 'Italy'
      }
    },
    items: [
      {
        id: 'ITEM-010',
        productId: 'PROD-010',
        name: '4K Webcam',
        price: 129.99,
        quantity: 1,
        image: 'https://via.placeholder.com/100x100?text=Webcam',
        category: 'Electronics',
        sku: 'CAM-4K-001'
      }
    ],
    subtotal: 129.99,
    shipping: 5.99,
    tax: 13.60,
    total: 149.58,
    // notes: 'Canceled on 21/01/2024 by customer request - Refund processed'
  },
];
}



  // private getMockOrders(): Order[] {
  //   return 

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

export const MOCK_ORDERS: Order[] = 
[
  {
    id: 'ORD-001-2024',
    orderNumber: '#100001',
    customerName: 'Giovanni Rossi',
    customerEmail: 'giovanni.rossi@email.com',
    date: new Date('2024-01-15'),
    time: '14:30',
    status: 'delivered',
    trackingNumber: 'IT123456789ABC',
    estimatedDelivery: new Date('2024-01-22'),
    shippingAddress: {
      firstName: 'Giovanni',
      lastName: 'Rossi',
      email: 'giovanni.rossi@email.com',
      phone: '+39 348 1234567',
      address: 'Via Roma 123, Appartamento 5',
      city: 'Rome',
      zipCode: '00100',
      country: 'Italy'
    },
    paymentDetails: {
      cardholderName: 'Giovanni Rossi',
      cardNumber: '****1234',
      expiryDate: '12/25',
      cvv: '***',
      billingAddress: {
        firstName: 'Giovanni',
        lastName: 'Rossi',
        email: 'giovanni.rossi@email.com',
        phone: '+39 348 1234567',
        address: 'Via Roma 123, Appartamento 5',
        city: 'Rome',
        zipCode: '00100',
        country: 'Italy'
      }
    },
    items: [
      {
        id: 'ITEM-001',
        productId: 'PROD-001',
        name: 'Premium Wireless Headphones',
        price: 299.99,
        quantity: 1,
        image: 'https://via.placeholder.com/100x100?text=Headphones',
        category: 'Electronics',
        sku: 'HDN-2024-001'
      },
      {
        id: 'ITEM-002',
        productId: 'PROD-002',
        name: 'Phone Case - Black',
        price: 29.99,
        quantity: 2,
        image: 'https://via.placeholder.com/100x100?text=Case',
        category: 'Accessories',
        sku: 'CASE-2024-BLK'
      }
    ],
    subtotal: 359.97,
    shipping: 5.99,
    tax: 36.00,
    total: 401.96,
    // notes: 'Delivered on 22/01/2024 at 10:45 AM'
  },

  {
    id: 'ORD-002-2024',
    orderNumber: '#100002',
    customerName: 'Maria Bianchi',
    customerEmail: 'maria.bianchi@email.com',
    date: new Date('2024-02-03'),
    time: '10:15',
    status: 'shipped',
    trackingNumber: 'IT987654321XYZ',
    estimatedDelivery: new Date('2024-02-08'),
    shippingAddress: {
      firstName: 'Maria',
      lastName: 'Bianchi',
      email: 'maria.bianchi@email.com',
      phone: '+39 333 9876543',
      address: 'Via Milano 456',
      city: 'Milan',
      zipCode: '20100',
      country: 'Italy'
    },
    paymentDetails: {
      cardholderName: 'Maria Bianchi',
      cardNumber: '****5678',
      expiryDate: '08/26',
      cvv: '***',
      billingAddress: {
        firstName: 'Maria',
        lastName: 'Bianchi',
        email: 'maria.bianchi@email.com',
        phone: '+39 333 9876543',
        address: 'Via Milano 456',
        city: 'Milan',
        zipCode: '20100',
        country: 'Italy'
      }
    },
    items: [
      {
        id: 'ITEM-003',
        productId: 'PROD-003',
        name: 'Portable Bluetooth Speaker',
        price: 79.99,
        quantity: 1,
        image: 'https://via.placeholder.com/100x100?text=Speaker',
        category: 'Electronics',
        sku: 'SPKR-2024-001'
      },
      {
        id: 'ITEM-004',
        productId: 'PROD-004',
        name: 'USB-C Charging Cable',
        price: 19.99,
        quantity: 3,
        image: 'https://via.placeholder.com/100x100?text=Cable',
        category: 'Accessories',
        sku: 'CBL-USB-C'
      }
    ],
    subtotal: 139.96,
    shipping: 5.99,
    tax: 14.40,
    total: 160.35,
    // notes: 'In transit - Expected delivery on 08/02/2024'
  },

  {
    id: 'ORD-003-2024',
    orderNumber: '#100003',
    customerName: 'Marco Ferrari',
    customerEmail: 'marco.ferrari@email.com',
    date: new Date('2024-02-10'),
    time: '16:45',
    status: 'confirmed',
    trackingNumber: null,
    estimatedDelivery: new Date('2024-02-15'),
    shippingAddress: {
      firstName: 'Marco',
      lastName: 'Ferrari',
      email: 'marco.ferrari@email.com',
      phone: '+39 345 5555666',
      address: 'Corso Vittorio Emanuele 789, Piano 3',
      city: 'Naples',
      zipCode: '80100',
      country: 'Italy'
    },
    paymentDetails: {
      cardholderName: 'Marco Ferrari',
      cardNumber: '****9012',
      expiryDate: '06/27',
      cvv: '***',
      billingAddress: {
        firstName: 'Marco',
        lastName: 'Ferrari',
        email: 'marco.ferrari@email.com',
        phone: '+39 345 5555666',
        address: 'Corso Vittorio Emanuele 789, Piano 3',
        city: 'Naples',
        zipCode: '80100',
        country: 'Italy'
      }
    },
    items: [
      {
        id: 'ITEM-005',
        productId: 'PROD-005',
        name: 'Laptop Stand',
        price: 49.99,
        quantity: 1,
        image: 'https://via.placeholder.com/100x100?text=Stand',
        category: 'Computer Accessories',
        sku: 'STAND-2024-001'
      },
      {
        id: 'ITEM-006',
        productId: 'PROD-006',
        name: 'Wireless Mouse',
        price: 34.99,
        quantity: 1,
        image: 'https://via.placeholder.com/100x100?text=Mouse',
        category: 'Computer Accessories',
        sku: 'MOUSE-WRL-001'
      },
      {
        id: 'ITEM-007',
        productId: 'PROD-007',
        name: 'USB Hub - 7 Port',
        price: 39.99,
        quantity: 1,
        image: 'https://via.placeholder.com/100x100?text=Hub',
        category: 'Computer Accessories',
        sku: 'HUB-USB-7PORT'
      }
    ],
    subtotal: 124.97,
    shipping: 5.99,
    tax: 13.00,
    total: 143.96,
    // notes: 'Payment confirmed - Processing for shipment'
  },

  {
    id: 'ORD-004-2024',
    orderNumber: '#100004',
    customerName: 'Laura Conti',
    customerEmail: 'laura.conti@email.com',
    date: new Date('2024-02-15'),
    time: '09:30',
    status: 'pending',
    trackingNumber: null,
    estimatedDelivery: new Date('2024-02-20'),
    shippingAddress: {
      firstName: 'Laura',
      lastName: 'Conti',
      email: 'laura.conti@email.com',
      phone: '+39 320 7777888',
      address: 'Via Torino 321',
      city: 'Turin',
      zipCode: '10100',
      country: 'Italy'
    },
    paymentDetails: {
      cardholderName: 'Laura Conti',
      cardNumber: '****3456',
      expiryDate: '03/25',
      cvv: '***',
      billingAddress: {
        firstName: 'Laura',
        lastName: 'Conti',
        email: 'laura.conti@email.com',
        phone: '+39 320 7777888',
        address: 'Via Torino 321',
        city: 'Turin',
        zipCode: '10100',
        country: 'Italy'
      }
    },
    items: [
      {
        id: 'ITEM-008',
        productId: 'PROD-008',
        name: 'Smart Watch - Silver',
        price: 199.99,
        quantity: 1,
        image: 'https://via.placeholder.com/100x100?text=Watch',
        category: 'Wearables',
        sku: 'WATCH-SMART-SLV'
      },
      {
        id: 'ITEM-009',
        productId: 'PROD-009',
        name: 'Watch Band Replacement',
        price: 29.99,
        quantity: 2,
        image: 'https://via.placeholder.com/100x100?text=Band',
        category: 'Wearables',
        sku: 'BAND-WATCH-001'
      }
    ],
    subtotal: 259.97,
    shipping: 5.99,
    tax: 26.60,
    total: 292.56,
    // notes: 'Order received - Awaiting payment confirmation'
  },

  {
    id: 'ORD-005-2024',
    orderNumber: '#100005',
    customerName: 'Alessandro De Luca',
    customerEmail: 'alex.deluca@email.com',
    date: new Date('2024-01-20'),
    time: '13:20',
    status: 'canceled',
    trackingNumber: null,
    estimatedDelivery: null,
    shippingAddress: {
      firstName: 'Alessandro',
      lastName: 'De Luca',
      email: 'alex.deluca@email.com',
      phone: '+39 371 1111222',
      address: 'Via Venezia 654',
      city: 'Venice',
      zipCode: '30100',
      country: 'Italy'
    },
    paymentDetails: {
      cardholderName: 'Alessandro De Luca',
      cardNumber: '****7890',
      expiryDate: '11/24',
      cvv: '***',
      billingAddress: {
        firstName: 'Alessandro',
        lastName: 'De Luca',
        email: 'alex.deluca@email.com',
        phone: '+39 371 1111222',
        address: 'Via Venezia 654',
        city: 'Venice',
        zipCode: '30100',
        country: 'Italy'
      }
    },
    items: [
      {
        id: 'ITEM-010',
        productId: 'PROD-010',
        name: '4K Webcam',
        price: 129.99,
        quantity: 1,
        image: 'https://via.placeholder.com/100x100?text=Webcam',
        category: 'Electronics',
        sku: 'CAM-4K-001'
      }
    ],
    subtotal: 129.99,
    shipping: 5.99,
    tax: 13.60,
    total: 149.58,
    // notes: 'Canceled on 21/01/2024 by customer request - Refund processed'
  },
];