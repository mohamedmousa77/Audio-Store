/**
 * Category model matching backend CategoryDTO
 * Updated to use number IDs and imageUrl for backend compatibility
 */
export interface Category {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
    productCount: number;
    createdAt?: string;
    updatedAt?: string;
}

/**
 * Request DTOs for Category API
 */
export interface CreateCategoryRequest {
    name: string;
    description: string;
    imageUrl: string;
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {
    id: number;
}
