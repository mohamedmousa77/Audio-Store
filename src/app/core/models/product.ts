export interface Product {
    id: string;
    name: string;
    description?:string;
    specs?: string;
    brand: string;
    sku: string;
    category: string;
    price: number;
    stock: number;
    status: 'Available' | 'Low Stock' | 'Unavailable';
    image?: string;
    gallery?: string[];
    isFeatured?: boolean;
    isNew?: boolean;

}
