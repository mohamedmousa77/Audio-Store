export interface Product {
    id: string;
    name: string;
    brand: string;
    sku: string;
    category: string;
    price: number;
    stock: number;
    status: 'Available' | 'Low Stock' | 'Unavailable';
    image?: string;
    isFeatured?: boolean;
    isNew?: boolean;
}
