/**
 * Cart Item - Single product in cart
 */
export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  productImage: string;
  categoryId?: number;
  categoryName?: string;
  stock?: number;
}

/**
 * Cart - Complete shopping cart
 */
export interface Cart {
  id?: number;
  userId?: number;
  items: CartItem[];
  totalItems: number;
  subtotal: number;        // BE serializes as camelCase in JSON
  shippingCost: number;    // BE serializes as camelCase in JSON
  tax: number;             // BE serializes as camelCase in JSON
  totalAmount: number;     // BE serializes as camelCase in JSON
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Request DTOs for Cart API
 */

/**
 * Add item to cart request
 */
export interface AddToCartRequest {
  productId: number;
  quantity: number;
}

/**
 * Update cart item quantity request
 */
export interface UpdateCartItemRequest {
  Quantity: number;
  CartItemId: number;
}

/**
 * Merge guest cart with user cart request
 */
export interface MergeCartRequest {
  guestCartItems: CartItem[];
}

/**
 * Cart response from backend
 */
export interface CartResponse {
  cart: Cart;
  message?: string;
}