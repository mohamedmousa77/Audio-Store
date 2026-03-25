import { Injectable, inject, signal, computed } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {
  PromoCodeValidationResult,
  PromoCodeResponse,
  CreatePromoCodeRequest,
  CreateAndAssignPromoCodeRequest,
} from '../../models/promo-code';
import { PromoCodeApiService } from './promo-code-api.service';

/**
 * PromoCode Service
 * High-level service for promo code management
 *
 * ARCHITECTURE:
 * - All HTTP calls delegated to PromoCodeApiService
 * - No direct HttpClient usage — always uses PromoCodeApiService
 * - Uses Angular Signals for reactive state management
 * - Uses firstValueFrom() to convert Observable → Promise
 * - Split: User operations / Admin operations
 */
@Injectable({ providedIn: 'root' })
export class PromoCodeService {
  private promoCodeApi = inject(PromoCodeApiService);

  // ============================================
  // STATE MANAGEMENT (Signals)
  // ============================================
  private _promoCodes       = signal<PromoCodeResponse[]>([]);
  private _userPromoCodes   = signal<PromoCodeResponse[]>([]);
  private _validationResult = signal<PromoCodeValidationResult | null>(null);

  loadingSignal  = signal<boolean>(false);
  errorSignal    = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  // ============================================
  // COMPUTED
  // ============================================
  promoCodes        = computed(() => this._promoCodes());
  userPromoCodes    = computed(() => this._userPromoCodes());
  validationResult  = computed(() => this._validationResult());
  activePromoCodes  = computed(() =>
    this._promoCodes().filter(p => p.isActive)
  );
  isDiscountApplied = computed(() =>
    this._validationResult()?.isValid === true
  );
  discountAmount    = computed(() =>
    this._validationResult()?.discountAmount ?? 0
  );
  finalAmount       = computed(() =>
    this._validationResult()?.finalAmount ?? 0
  );

  // ============================================
  // USER OPERATIONS
  // ============================================

  /**
   * Validate a promo code at checkout
   * POST api/v1/PromoCode/validate
   * @param code  Promo code string entered by user
   * @param subtotal  Current cart subtotal
   */
  async validate(
    code: string,
    subtotal: number
  ): Promise<PromoCodeValidationResult | null> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this._validationResult.set(null);
    try {
      const result = await firstValueFrom(
        this.promoCodeApi.validateCode({ code, subtotal })
      );
      this._validationResult.set(result);
      if (!result.isValid) {
        this.errorSignal.set(result.message);
      } else {
        console.log(
          `✅ Promo code "${code}" valid — discount: ${result.discountAmount}`
        );
      }
      return result;
    } catch (error: any) {
      console.error('Failed to validate promo code:', error);
      const msg =
        error?.error?.message ||
        error?.message ||
        'Invalid or expired promo code';
      this.errorSignal.set(msg);
      return null;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  /**
   * Load promo codes assigned to a specific user
   * GET api/v1/PromoCode/user/{userId}
   * @param userId  ID of the authenticated user
   */
  async loadUserPromoCodes(userId: number): Promise<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    try {
      const codes = await firstValueFrom(
        this.promoCodeApi.getByUser(userId)
      );
      this._userPromoCodes.set(codes ?? []);
      console.log(
        `✅ Loaded ${codes?.length ?? 0} promo codes for user ${userId}`
      );
    } catch (error) {
      console.error('Failed to load user promo codes:', error);
      this.errorSignal.set('Failed to load promo codes');
      this._userPromoCodes.set([]);
    } finally {
      this.loadingSignal.set(false);
    }
  }

  /**
   * Clear current validation result
   * Called when cart changes or user removes the promo code
   */
  clearValidation(): void {
    this._validationResult.set(null);
    this.errorSignal.set(null);
    this.successMessage.set(null);
  }

  // ============================================
  // ADMIN OPERATIONS
  // ============================================

  /**
   * Load all promo codes (Admin only)
   * GET api/v1/PromoCode
   */
  async loadAllPromoCodes(): Promise<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    try {
      const codes = await firstValueFrom(this.promoCodeApi.getAll());
      this._promoCodes.set(codes ?? []);
      console.log(`✅ Loaded ${codes?.length ?? 0} promo codes (admin)`);
    } catch (error) {
      console.error('Failed to load all promo codes:', error);
      this.errorSignal.set('Failed to load promo codes');
      this._promoCodes.set([]);
    } finally {
      this.loadingSignal.set(false);
    }
  }

  /**
   * Create a new promo code (Admin only)
   * POST api/v1/PromoCode
   * @param dto  Promo code creation data
   */
  async create(
    dto: CreatePromoCodeRequest
  ): Promise<PromoCodeResponse | undefined> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.successMessage.set(null);
    try {
      const created = await firstValueFrom(
        this.promoCodeApi.create(dto)
      );
      // Optimistic local update — no full reload needed
      this._promoCodes.update(codes => [created, ...codes]);
      this.successMessage.set(
        `Promo code "${created.code}" created successfully`
      );
      console.log(`✅ PromoCode created: ${created.code}`);
      return created;
    } catch (error: any) {
      console.error('Failed to create promo code:', error);
      const msg =
        error?.error?.message ||
        error?.message ||
        'Failed to create promo code';
      this.errorSignal.set(msg);
      return undefined;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  /**
   * Create and directly assign a promo code to a user (Admin only)
   * POST api/v1/PromoCode/create-for-user
   * @param dto  Promo code data + userId
   */
  async createAndAssign(
    dto: CreateAndAssignPromoCodeRequest
  ): Promise<PromoCodeResponse | undefined> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.successMessage.set(null);
    try {
      const created = await firstValueFrom(
        this.promoCodeApi.createAndAssign(dto)
      );
      this._promoCodes.update(codes => [created, ...codes]);
      this.successMessage.set(
        `Promo code "${created.code}" created and assigned to user ${dto.userId}`
      );
      console.log(
        `✅ PromoCode created & assigned to user ${dto.userId}: ${created.code}`
      );
      return created;
    } catch (error: any) {
      console.error('Failed to create and assign promo code:', error);
      const msg =
        error?.error?.message ||
        error?.message ||
        'Failed to create and assign promo code';
      this.errorSignal.set(msg);
      return undefined;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  /**
   * Assign an existing promo code to a user (Admin only)
   * POST api/v1/PromoCode/{id}/assign/{userId}
   * @param promoCodeId  ID of the promo code
   * @param userId       ID of the target user
   */
  async assignToUser(promoCodeId: number, userId: number): Promise<boolean> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.successMessage.set(null);
    try {
      await firstValueFrom(
        this.promoCodeApi.assignToUser(promoCodeId, userId)
      );
      this.successMessage.set('Promo code assigned successfully');
      console.log(
        `✅ PromoCode ${promoCodeId} assigned to user ${userId}`
      );
      return true;
    } catch (error: any) {
      console.error('Failed to assign promo code:', error);
      const msg =
        error?.error?.message ||
        error?.message ||
        'Failed to assign promo code';
      this.errorSignal.set(msg);
      return false;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  /**
   * Deactivate a promo code (Admin only)
   * POST api/v1/PromoCode/{id}/deactivate
   * @param promoCodeId  ID of the promo code to deactivate
   */
  async deactivate(promoCodeId: number): Promise<boolean> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.successMessage.set(null);
    try {
      await firstValueFrom(
        this.promoCodeApi.deactivate(promoCodeId)
      );
      // Optimistic update — set isActive: false without full reload
      this._promoCodes.update(codes =>
        codes.map(c =>
          c.id === promoCodeId ? { ...c, isActive: false } : c
        )
      );
      this.successMessage.set('Promo code deactivated successfully');
      console.log(`✅ PromoCode ${promoCodeId} deactivated`);
      return true;
    } catch (error: any) {
      console.error('Failed to deactivate promo code:', error);
      const msg =
        error?.error?.message ||
        error?.message ||
        'Failed to deactivate promo code';
      this.errorSignal.set(msg);
      return false;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  // ============================================
  // HELPERS
  // ============================================

  /**
   * Clear all state — called on logout
   */
  clearAll(): void {
    this._promoCodes.set([]);
    this._userPromoCodes.set([]);
    this._validationResult.set(null);
    this.errorSignal.set(null);
    this.successMessage.set(null);
  }
}