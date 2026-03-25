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
      'api/v1/PromoCode/validate',
      request
    );
  }

  /** GET api/v1/PromoCode/user/{userId} */
  getByUser(userId: number): Observable<PromoCodeResponse[]> {
    return this.http.get<PromoCodeResponse[]>(`api/v1/PromoCode/user/${userId}`);
  }

  // ── ADMIN ENDPOINTS ────────────────────────────────────────────────────

  /** GET api/v1/PromoCode */
  getAll(): Observable<PromoCodeResponse[]> {
    return this.http.get<PromoCodeResponse[]>('api/v1/PromoCode');
  }

  /** POST api/v1/PromoCode */
  create(dto: CreatePromoCodeRequest): Observable<PromoCodeResponse> {
    return this.http.post<PromoCodeResponse>('api/v1/PromoCode', dto);
  }

  /** POST api/v1/PromoCode/create-for-user */
  createAndAssign(dto: CreateAndAssignPromoCodeRequest): Observable<PromoCodeResponse> {
    return this.http.post<PromoCodeResponse>(
      'api/v1/PromoCode/create-for-user',
      dto
    );
  }

  /** POST api/v1/PromoCode/{id}/assign/{userId} */
  assignToUser(promoCodeId: number, userId: number): Observable<void> {
    return this.http.post<void>(
      `api/v1/PromoCode/${promoCodeId}/assign/${userId}`,
      {}
    );
  }

  /** POST api/v1/PromoCode/{id}/deactivate */
  deactivate(promoCodeId: number): Observable<void> {
    return this.http.post<void>(
      `api/v1/PromoCode/${promoCodeId}/deactivate`,
      {}
    );
  }
}