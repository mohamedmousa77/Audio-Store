/**
 * Cart Item - Single product in cart
 */
export interface CartItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
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
  totalPrice: number;
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
  quantity: number;
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