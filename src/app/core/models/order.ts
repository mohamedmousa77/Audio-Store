export interface Order {
    id: string;
    date: string;
    customerName: string;
    customerEmail: string;
    total: string;
    status: 'Processing' | 'Shipped' | 'Delivered' | 'Canceled';
    time?: string;
}
