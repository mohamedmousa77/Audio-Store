export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  readAt?: string;
}

export type NotificationType =
  | 'AbandonedCart'
  | 'OrderConfirmed'
  | 'OrderShipped'
  | 'OrderDelivered'
  | 'PromoCode'
  | 'StockAlert';

export interface UnreadCountResponse {
  count: number;
}