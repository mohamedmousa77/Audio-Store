/**
 * Category model matching backend CategoryDto
 * Updated to use number IDs for backend compatibility
 */
export interface Category {
    id: number;
    name: string;
    description: string;
    icon: string;
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
    icon: string;
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {
    id: number;
}
