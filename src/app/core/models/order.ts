/**
 * Order Models
 * Updated to match backend DTOs
 */

/**
 * Order Status Enum
 * Matches backend AudioStore.Common.Enums.OrderStatus
 */
export enum OrderStatus {
  Pending = 0,
  Confirmed = 1,
  Shipped = 2,
  Delivered = 3,
  Canceled = 4
}

/**
 * Order - Complete order details
 * Matches backend OrderDTO
 */
export interface Order {
  id: number;
  orderNumber: string;
  orderDate: string;              // ISO date string
  userId?: number | null;         // Null for guest orders
  orderStatus: OrderStatus;

  // Customer Info
  customerFirstName: string;
  customerLastName: string;
  customerEmail: string;
  customerPhone: string;

  // Shipping Address
  shippingStreet: string;
  shippingCity: string;
  shippingPostalCode: string;
  shippingCountry: string;

  // Order Items
  items: OrderItem[];

  // Totals
  subtotal: number;
  shippingCost: number;
  tax: number;
  totalAmount: number;

  // Payment
  paymentMethod: string;
  notes?: string;
}

/**
 * Order Item - Single product in order
 * Matches backend OrderItemDTO
 */
export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

/**
 * Request DTOs for Order API
 */

/**
 * Create Order Request
 * Matches backend CreateOrderDTO
 */
export interface CreateOrderRequest {
  UserId?: number | null;         // Set by backend from JWT

  // Customer Info (optional for authenticated users)
  CustomerFirstName?: string;
  CustomerLastName?: string;
  CustomerEmail?: string;
  CustomerPhone?: string;

  // Shipping Address (required)
  ShippingStreet: string;
  ShippingCity: string;
  ShippingPostalCode: string;
  ShippingCountry: string;

  // Order Items (from cart)
  Items: CreateOrderItem[];

  // Optional notes
  Notes?: string;
}

/**
 * Create Order Item
 * Matches backend CreateOrderItemDTO
 */
export interface CreateOrderItem {
  ProductId: number;
  Quantity: number;
  UnitPrice: number;
}

/**
 * Update Order Status Request (Admin only)
 * Matches backend UpdateOrderStatusDTO
 */
export interface UpdateOrderStatusRequest {
  orderId: number;
  newStatus: OrderStatus;
}

/**
 * Response DTOs
 */

/**
 * Order Confirmation Response
 * Matches backend OrderConfirmationDTO
 */
export interface OrderConfirmation {
  orderNumber: string;
  orderDate: string;
  customerEmail: string;
  totalAmount: number;
  message: string;
  orderDetails: Order;
}

/**
 * Order Filter Parameters (Admin)
 */
export interface OrderFilterParams {
  status?: OrderStatus;
  startDate?: string;
  endDate?: string;
  searchTerm?: string;
  page?: number;
  pageSize?: number;
}

/**
 * Paginated Result
 */
export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Shipping Address (for forms)
 */
export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
}