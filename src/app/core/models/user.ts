export interface Customer {
    id: string;
    name: string;
    email: string;
    phone?: string;
    registrationDate: string;
    totalOrders: number;
    lastOrderDate: string;
    initials?: string;
    color?: string;
}
