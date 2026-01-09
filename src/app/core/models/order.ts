
// export interface Order {
//     id: string;
//     date: string;
//     customerName: string;
//     customerEmail: string;
//     total: string;
//     status: 'Processing' | 'Shipped' | 'Delivered' | 'Canceled';
//     time?: string;
// }

export interface Order {
  id: string;
  orderNumber?: string;
  customerName?: string;
  customerEmail?: string;
  date?: string | Date;
  time?: string;
  estimatedDelivery?: Date | string | null;
  trackingNumber?: string | null;
  shippingAddress?: ShippingAddress;
  paymentDetails?: PaymentDetails;
  items?: any[];
  subtotal?: number;
  shipping?: number;
  tax?: number;
  total?: number | string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'canceled' |
   'Available' | 'Low Stock' | 'Unavailable' | 'Processing' | 'Shipped' | 'Delivered' | 'Canceled';
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
}

export interface PaymentDetails {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  billingAddress: ShippingAddress;
}