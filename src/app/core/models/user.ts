export interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    registrationDate: string;
    totalOrders: number;
    lastOrderDate: string;
    initials?: string;
    color?: string;
    ruole: 'Customer' | 'Admin';
}

export interface AuthResponse {
  token: string;
  user: User;
}