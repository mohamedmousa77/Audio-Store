import { Injectable, inject, signal, computed } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CustomerManagementApiService } from './customer-management-api.service';
import {
    Customer,
    CustomerDetail,
    CustomerFilter,
    CustomerSummary
} from '../../models/customer';
import { Order } from '../../models/order';

/**
 * Customer Management Service
 * State management for admin customer features using Signals
 */
@Injectable({
    providedIn: 'root'
})
export class CustomerManagementService {
    private customerApi = inject(CustomerManagementApiService);

    // ============================================
    // SIGNALS - State Management
    // ============================================

    /**
     * All customers (paginated)
     */
    customers = signal<Customer[]>([]);

    /**
     * Selected customer details
     */
    selectedCustomer = signal<CustomerDetail | null>(null);

    /**
     * Customer orders (for selected customer)
     */
    customerOrders = signal<Order[]>([]);

    /**
     * Customer summary/statistics
     */
    summary = signal<CustomerSummary | null>(null);

    /**
     * Loading state
     */
    loading = signal<boolean>(false);

    /**
     * Error state
     */
    error = signal<string | null>(null);

    /**
     * Total count (for pagination)
     */
    totalCount = signal<number>(0);

    // ============================================
    // METHODS - Data Loading
    // ============================================

    /**
     * Load customer summary/statistics
     */
    async loadCustomerSummary(): Promise<void> {
        this.loading.set(true);
        this.error.set(null);

        try {
            const summary = await firstValueFrom(this.customerApi.getCustomerSummary());
            this.summary.set(summary);
            console.log('✅ Loaded customer summary');
        } catch (error) {
            console.error('Failed to load customer summary:', error);
            this.error.set('Failed to load customer summary');
        } finally {
            this.loading.set(false);
        }
    }

    /**
     * Load all customers with optional filtering
     * @param filter Optional filter (search, status, pagination)
     */
    async loadAllCustomers(filter?: CustomerFilter): Promise<void> {
        this.loading.set(true);
        this.error.set(null);

        try {
            const result = await firstValueFrom(this.customerApi.getAllCustomers(filter));
            this.customers.set(result.items);
            this.totalCount.set(result.totalCount);
            console.log(`✅ Loaded ${result.items.length} customers`);
        } catch (error) {
            console.error('Failed to load customers:', error);
            this.error.set('Failed to load customers');
            this.customers.set([]);
        } finally {
            this.loading.set(false);
        }
    }

    /**
     * Load customer details by ID
     * @param id Customer ID
     */
    async loadCustomerDetail(id: number): Promise<void> {
        this.loading.set(true);
        this.error.set(null);

        try {
            const customer = await firstValueFrom(this.customerApi.getCustomerDetail(id));
            this.selectedCustomer.set(customer);
            console.log(`✅ Loaded customer ${id} details`);
        } catch (error) {
            console.error(`Failed to load customer ${id}:`, error);
            this.error.set('Failed to load customer details');
            this.selectedCustomer.set(null);
        } finally {
            this.loading.set(false);
        }
    }

    /**
     * Load customer order history
     * @param id Customer ID
     */
    async loadCustomerOrders(id: number): Promise<void> {
        this.loading.set(true);
        this.error.set(null);

        try {
            const orders = await firstValueFrom(this.customerApi.getCustomerOrders(id));
            this.customerOrders.set(orders);
            console.log(`✅ Loaded ${orders.length} orders for customer ${id}`);
        } catch (error) {
            console.error(`Failed to load orders for customer ${id}:`, error);
            this.error.set('Failed to load customer orders');
            this.customerOrders.set([]);
        } finally {
            this.loading.set(false);
        }
    }

    /**
     * Clear selected customer
     */
    clearSelectedCustomer(): void {
        this.selectedCustomer.set(null);
        this.customerOrders.set([]);
    }
}
