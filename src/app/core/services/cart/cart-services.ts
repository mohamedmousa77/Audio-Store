import { Injectable, inject, signal, computed } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Cart, CartItem, AddToCartRequest } from '../../models/cart';
import { CartApiService } from './cart-api.service';
import { AuthServices } from '../auth/auth-services';
import { SessionManager } from '../session/session-manager.service';
import { Product } from '../../models/product';

/**
 * Cart Services
 * High-level service for cart management
 * 
 * ARCHITECTURE:
 * - Guest users: Cart saved in DATABASE with SessionId
 * - Authenticated users: Cart saved in DATABASE with UserId
 * - Automatic merge: Guest cart merges with user cart on login
 */
@Injectable({
  providedIn: 'root',
})
export class CartServices {
  private cartApi = inject(CartApiService);
  private authService = inject(AuthServices);
  private sessionManager = inject(SessionManager);

  // ============================================
  // STATE MANAGEMENT (Signals)
  // ============================================

  private cartSignal = signal<Cart>({
    items: [],
    totalItems: 0,
    subtotal: 0,
    shippingCost: 0,
    tax: 0,
    totalAmount: 0
  });

  loadingSignal = signal<boolean>(false);
  errorSignal = signal<string | null>(null);

  // Computed values
  cart = computed(() => this.cartSignal());
  items = computed(() => this.cartSignal().items);
  totalItems = computed(() => this.cartSignal().totalItems);
  totalAmount = computed(() => this.cartSignal().totalAmount);
  subtotal = computed(() => this.cartSignal().subtotal);
  tax = computed(() => this.cartSignal().tax);
  shippingCost = computed(() => this.cartSignal().shippingCost);
  isEmpty = computed(() => this.cartSignal().items.length === 0);

  // ============================================
  // INITIALIZATION
  // ============================================

  constructor() {
    this.initializeCart();
  }

  /**
   * Initialize cart from backend
   */
  private async initializeCart(): Promise<void> {
    await this.loadCart();
  }

  /**
   * Load cart from backend
   * Backend automatically determines cart based on:
   * - JWT token (authenticated) → userId
   * - X-Session-Id header (guest) → sessionId
   */
  async loadCart(): Promise<void> {
    this.loadingSignal.set(true);
    try {
      const cart = await firstValueFrom(this.cartApi.getCart());

      // Diagnostic logging
      console.log('🔍 Raw cart data from BE:', cart);

      // Ensure cart is never null to prevent computed properties from crashing
      this.cartSignal.set(cart
        || {
        items: [],
        totalItems: 0,
        subtotal: 0,
        shippingCost: 0,
        tax: 0,
        totalAmount: 0
      });

      if (cart?.items?.length > 0) {
        console.log('🔍 First cart item:', cart.items[0]);
        console.log('🔍 Image URL:', cart.items[0].productImage);
      }
      console.log('🔍 Cart pricing:', {
        "Subtotal": this.subtotal(),
        "Tax": this.tax(),
        "ShippingCost": this.shippingCost(),
        "TotalAmount": this.totalAmount()
      });


      console.log('✅ Cart loaded successfully');
      this.errorSignal.set(null);
    } catch (error) {
      console.error('Failed to load cart:', error);
      this.errorSignal.set('Failed to load cart');
      // Reset to empty cart on error
      this.cartSignal.set({
        items: [],
        totalItems: 0,
        subtotal: 0,
        shippingCost: 0,
        tax: 0,
        totalAmount: 0
      });
    } finally {
      this.loadingSignal.set(false);
    }
  }

  // ============================================
  // CART OPERATIONS
  // ============================================

  /**
   * Add product to cart
   * @param product Product to add
   * @param quantity Quantity to add (default: 1)
   */
  async addToCart(product: Product, quantity: number = 1): Promise<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    try {
      const request: AddToCartRequest = {
        productId: product.id,
        quantity
      };

      const response = await firstValueFrom(this.cartApi.addItem(request));

      // ✅ FIX: Backend returns CartDTO directly
      const cartData = (response as any).cart || response;
      this.cartSignal.set(cartData as Cart);

      console.log(`✅ Added ${product.name} to cart (quantity: ${quantity})`);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      this.errorSignal.set('Failed to add item to cart');
      throw error;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  /**
   * Update cart item quantity
   * @param itemId Cart item ID
   * @param quantity New quantity
   */
  async updateQuantity(itemId: number, quantity: number): Promise<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    try {
      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        await this.removeFromCart(itemId);
        return;
      }

      console.log('🔄 Updating quantity:', { itemId, quantity });

      const response = await firstValueFrom(
        this.cartApi.updateItemQuantity(itemId, { Quantity: quantity, CartItemId: itemId })
      );

      // 🔍 DEBUG: Log the response
      console.log('📦 Backend response:', response);
      console.log('📦 Response type:', typeof response);

      // ✅ FIX: Backend returns CartDTO directly, not wrapped in { cart: CartDTO }
      // Check if response has 'cart' property (CartResponse) or is CartDTO directly
      const cartData = (response as any).cart || response;

      console.log('📦 Cart data:', cartData);

      if (cartData && Array.isArray(cartData.items)) {
        this.cartSignal.set(cartData as Cart);
        console.log(`✅ Updated cart item ${itemId} to quantity ${quantity}`);
      } else {
        console.error('❌ Invalid cart data:', cartData);
        // Reload cart as fallback
        await this.loadCart();
      }
    } catch (error) {
      console.error('Failed to update quantity:', error);
      this.errorSignal.set('Failed to update quantity');
      throw error;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  /**
   * Remove item from cart
   * @param itemId Cart item ID
   */
  async removeFromCart(itemId: number): Promise<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    try {
      console.log('🗑️ Removing item:', itemId);
      console.log('📦 Cart BEFORE removal:', this.cartSignal());

      const response = await firstValueFrom(this.cartApi.removeItem(itemId));

      // ✅ FIX: Backend returns CartDTO directly
      const cartData = (response as any).cart || response;

      console.log('📦 Backend returned cart:', cartData);
      console.log('📦 Items in returned cart:', cartData?.items?.length);

      this.cartSignal.set(cartData as Cart);

      console.log('📦 Cart AFTER update:', this.cartSignal());
      console.log('📦 Items signal:', this.items());
      console.log(`✅ Removed cart item ${itemId}`);
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      this.errorSignal.set('Failed to remove item');
      throw error;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  /**
   * Clear entire cart
   */
  async clearCart(): Promise<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    try {
      await firstValueFrom(this.cartApi.clearCart());

      // Reset cart state
      this.cartSignal.set({
        items: [],
        totalItems: 0,
        subtotal: 0,
        shippingCost: 0,
        tax: 0,
        totalAmount: 0
      });

      console.log('✅ Cart cleared');
    } catch (error) {
      console.error('Failed to clear cart:', error);
      this.errorSignal.set('Failed to clear cart');
      throw error;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  // ============================================
  // GUEST CART MERGE (After Login)
  // ============================================

  /**
   * Merge guest cart with user cart after login
   * Called automatically after successful login
   * 
   * Flow:
   * 1. Get SessionId from localStorage
   * 2. Send to backend to merge guest cart with user cart
   * 3. Backend merges items (sums quantities for duplicates)
   * 4. Clear SessionId (no longer needed)
   * 5. Update UI with merged cart
   */
  async mergeGuestCart(): Promise<void> {
    const sessionId = this.sessionManager.getSessionId();

    if (!sessionId) {
      // No guest cart to merge, just load user cart
      console.log('No guest session to merge');
      await this.loadCart();
      return;
    }

    this.loadingSignal.set(true);
    try {
      console.log('🔄 Merging guest cart with user cart...', sessionId);

      const response = await firstValueFrom(
        this.cartApi.mergeGuestCart(sessionId)
      );

      // ✅ FIX: Backend returns CartDTO directly
      const cartData = (response as any).cart || response;
      this.cartSignal.set(cartData as Cart);

      // Clear SessionId after successful merge
      this.sessionManager.clearSessionId();

      console.log('✅ Guest cart merged successfully');
    } catch (error) {
      console.error('Failed to merge guest cart:', error);
      this.errorSignal.set('Failed to merge cart');

      // Fallback: just load user cart
      await this.loadCart();
    } finally {
      this.loadingSignal.set(false);
    }
  }

  // ============================================
  // HELPER METHODS
  // ============================================

  /**
   * Get cart item by product ID
   */
  getItemByProductId(productId: number): CartItem | undefined {
    return this.cartSignal().items.find(item => item.productId === productId);
  }

  /**
   * Check if product is in cart
   */
  isInCart(productId: number): boolean {
    return this.cartSignal().items.some(item => item.productId === productId);
  }

  /**
   * Get quantity of product in cart
   */
  getProductQuantity(productId: number): number {
    const item = this.getItemByProductId(productId);
    return item ? item.quantity : 0;
  }
}
