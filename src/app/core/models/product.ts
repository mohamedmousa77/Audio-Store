/**
 * Product model matching backend ProductDto
 * Updated to use number IDs for backend compatibility
 */
export interface Product {
    id: number;
    name: string;
    description?: string;
    specs?: string;
    brand: string;
    sku: string;
    categoryId: number;
    categoryName?: string;
    price: number;
    stockQuantity: number;    // Changed from 'stock' to match backend DTO
    status: 'Available' | 'Low Stock' | 'Unavailable';
    mainImage?: string;
    gallery?: string[];
    isFeatured?: boolean;
    isNew?: boolean;
    bannerDescription?: string;
    createdAt?: string;
    updatedAt?: string;
}

/**
 * Request DTOs for Product API
 */
export interface CreateProductRequest {
    name: string;
    description?: string;
    specs?: string;
    brand: string;
    sku: string;
    categoryId: number;
    price: number;
    stock: number;
    image?: string;
    gallery?: string[];
    isFeatured?: boolean;
    isNew?: boolean;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
    id: number;
}

export interface ProductQueryParams {
    categoryId?: number;
    isFeatured?: boolean;
    isNew?: boolean;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    pageSize?: number;
    sortBy?: 'name' | 'price' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
}
