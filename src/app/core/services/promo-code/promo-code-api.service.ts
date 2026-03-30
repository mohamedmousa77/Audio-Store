import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../http/http.service';
import {
  PromoCodeValidationResult,
  ValidatePromoCodeRequest,
  PromoCodeResponse,
  CreatePromoCodeRequest,
  CreateAndAssignPromoCodeRequest,
} from '../../models/promo-code';

/**
 * PromoCode API Service
 * Layer HTTP puro — segue il pattern di notification-api.service.ts
 */
@Injectable({ providedIn: 'root' })
export class PromoCodeApiService {
  private http = inject(HttpService);

  // ── USER ENDPOINTS ────────────────────────────────────────────────────

  /** POST api/v1/PromoCode/validate */
  validateCode(request: ValidatePromoCodeRequest): Observable<PromoCodeValidationResult> {
    return this.http.post<PromoCodeValidationResult>(
      'PromoCode/validate',
      request
    );
  }

  /** GET api/v1/PromoCode/user/{userId} */
  getByUser(userId: number): Observable<PromoCodeResponse[]> {
    return this.http.get<PromoCodeResponse[]>(`PromoCode/user/${userId}`);
  }

  // ── ADMIN ENDPOINTS ────────────────────────────────────────────────────

  getAll(search?: string): Observable<PromoCodeResponse[]> {
    return this.http.get<PromoCodeResponse[]>('PromoCode', search ? { search } : undefined);
  }
  create(dto: CreatePromoCodeRequest): Observable<PromoCodeResponse> {
    return this.http.post<PromoCodeResponse>('PromoCode', dto);
  }
  createAndAssign(dto: CreateAndAssignPromoCodeRequest): Observable<PromoCodeResponse> {
    return this.http.post<PromoCodeResponse>('PromoCode/create-for-user', dto);
  }
  assignToUser(promoCodeId: number, userId: number): Observable<void> {
    return this.http.post<void>(`PromoCode/${promoCodeId}/assign/${userId}`, {});
  }
  deactivate(promoCodeId: number): Observable<void> {
    return this.http.post<void>(`PromoCode/${promoCodeId}/deactivate`, {});
  }
  activate(promoCodeId: number): Observable<void> {
    return this.http.post<void>(`PromoCode/${promoCodeId}/activate`, {});
  }
}