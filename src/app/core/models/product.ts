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
    categoryId: number;            // Changed from category: string to match backend
    categoryName?: string;         // Optional: for UI display (populated from join)
    price: number;
    stock: number;
    status: 'Available' | 'Low Stock' | 'Unavailable';
    mainImage?: string;       // Primary product image (matches BE ProductDTO.MainImage)
    gallery?: string[];
    isFeatured?: boolean;
    isNew?: boolean;
    bannerDescription?: string;
    createdAt?: string;            // Backend timestamp
    updatedAt?: string;            // Backend timestamp
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
