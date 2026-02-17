/**
 * Product model matching backend ProductDto
 * Updated to use number IDs for backend compatibility
 */
export interface Product {
    id: number;
    name: string;
    description?: string;
    specifications?: string;
    brand: string;
    categoryId: number;
    categoryName?: string;
    price: number;
    stockQuantity: number;
    mainImage?: string;
    galleryImages?: string[];
    isFeatured?: boolean;
    isAvailable?: boolean;
    isNew?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

/**
 * Request DTOs for Product API
 */
export interface CreateProductRequest {
    name: string;
    description?: string;
    specifications?: string;
    brand: string;
    categoryId: number;
    price: number;
    stockQuantity: number;
    mainImage?: string;
    galleryImages?: string[];
    isFeatured?: boolean;
    isAvailable?: boolean;
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
