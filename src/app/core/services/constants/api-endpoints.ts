/**
 * API Endpoints Configuration
 * Base URL and versioning are configured in environment files
 */

export const API_ENDPOINTS = {
  // Authentication endpoints
  auth: {
    base: 'auth',
    login: 'auth/login',
    register: 'auth/register',
    refreshToken: 'auth/refresh-token',
    revokeToken: 'auth/revoke-token',
    logout: 'auth/logout'
  },

  // Products endpoints
  products: {
    base: 'products',
    byId: (id: number) => `products/${id}`,
    featured: 'products/featured',
    byCategory: (categoryId: number) => `products/category/${categoryId}`,
    brands: 'products/brands',
    search: 'products/search',
    updateStock: (id: number) => `products/${id}/stock`
  },

  // Categories endpoints
  categories: {
    base: 'categories',
    byId: (id: number) => `categories/${id}`
  },

  // Cart endpoints
  cart: {
    base: 'cart',
    items: 'cart/items',
    itemById: (id: number) => `cart/items/${id}`,
    clear: 'cart/clear',
    merge: 'cart/merge'
  },

  // Orders endpoints
  orders: {
    base: 'orders',
    byId: (id: number) => `orders/${id}`,
    byNumber: (orderNumber: string) => `orders/number/${orderNumber}`,
    cancel: (id: number) => `orders/${id}/cancel`,
    admin: {
      all: 'orders/admin/all',
      updateStatus: (id: number) => `orders/${id}/status`
    }
  },

  // Profile endpoints
  profile: {
    base: 'profile',
    changePassword: 'profile/change-password',
    addresses: 'profile/addresses',
    addressById: (id: number) => `profile/addresses/${id}`,
    orders: 'profile/orders'
  },

  // Admin endpoints
  admin: {
    dashboard: 'admin/dashboard',
    customersSummary: 'admin/customers/summary',
    customers: 'admin/customers',
    customerById: (id: number) => `admin/customers/${id}`,
    customerOrders: (id: number) => `admin/customers/${id}/orders`
  }
};
