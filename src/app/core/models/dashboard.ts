/**
 * Dashboard Models
 * TypeScript interfaces matching backend DashboardStatsDTO
 */

/**
 * Main dashboard statistics
 */
export interface DashboardStats {
    totalSales: number;
    totalOrders: number;
    ordersByStatus: OrdersByStatus;
    totalCustomers: number;
    topProducts: TopProduct[];
    topCategories: TopCategory[];
}

/**
 * Orders breakdown by status
 */
export interface OrdersByStatus {
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
}

/**
 * Top product with sales data
 */
export interface TopProduct {
    productId: number;
    productName: string;
    productImage: string;
    brand: string;
    categoria: string;
    stockStatus: string;
    totalQuantitySold: number;
    totalRevenue: number;
}

/**
 * Top category with sales data
 */
export interface TopCategory {
    categoryId: number;
    categoryName: string;
    totalQuantitySold: number;
    totalRevenue: number;
}
