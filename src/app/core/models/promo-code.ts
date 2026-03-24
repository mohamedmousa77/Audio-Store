export interface PromoCodeValidationResult {
  isValid: boolean;
  discountAmount: number;
  finalAmount: number;
  message: string;
  promoCodeId?: number;
}

export interface ValidatePromoCodeRequest {
  code: string;
  subtotal: number;
}

export interface PromoCodeResponse {
  id: number;
  code: string;
  discountType: 'Percentage' | 'FixedAmount';
  discountValue: number;
  minOrderAmount?: number;
  expiresAt?: string;
  isActive: boolean;
  createdAt: string;
  totalAssigned: number;
  totalUsed: number;
}

export interface CreatePromoCodeRequest {
  code: string;
  discountType: 'Percentage' | 'FixedAmount';
  discountValue: number;
  minOrderAmount?: number;
  expiresAt?: string;
  maxUsages?: number;
}

export interface CreateAndAssignPromoCodeRequest extends CreatePromoCodeRequest {
  userId: number;
}