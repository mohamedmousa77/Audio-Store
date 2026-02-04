/**
 * Customer Management Models
 * Used for admin customer management features
 */

/**
 * Customer List Item
 * Used in customer list view
 */
export interface Customer {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    registrationDate: string;
    totalOrders: number;
    totalSpent: number;
    status: 'Active' | 'Inactive';
}

/**
 * Customer Detail
 * Full customer information including orders and addresses
 */
export interface CustomerDetail extends Customer {
    shippingAddresses: ShippingAddress[];
    recentOrders: CustomerOrder[];
}

/**
 * Shipping Address
 */
export interface ShippingAddress {
    id: number;
    street: string;
    city: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
}

/**
 * Customer Order (simplified for customer view)
 */
export interface CustomerOrder {
    id: number;
    orderNumber: string;
    orderDate: string;
    totalAmount: number;
    status: string;
    itemCount: number;
}

/**
 * Customer Filter Parameters
 * Used for filtering/searching customers
 */
export interface CustomerFilter {
    searchTerm?: string;
    status?: 'Active' | 'Inactive' | '';
    page?: number;
    pageSize?: number;
}

/**
 * Customer Summary
 * Dashboard statistics
 */
export interface CustomerSummary {
    totalCustomers: number;
    activeCustomers: number;
    inactiveCustomers: number;
    newThisMonth: number;
    totalRevenue: number;
    averageOrderValue: number;
}

/**
 * Paginated Result
 * Generic pagination wrapper
 */
export interface PaginatedCustomerResult {
    items: Customer[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
}
