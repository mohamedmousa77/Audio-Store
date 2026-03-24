import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import {
  PromoCodeValidationResult,
  ValidatePromoCodeRequest,
  PromoCodeResponse,
  CreatePromoCodeRequest,
  CreateAndAssignPromoCodeRequest
} from '../../models/promo-code';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PromoCodeService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/v1/PromoCode`;

  // ── User endpoint ─────────────────────────────────────────────────────────
  async validate(
    code: string, subtotal: number
  ): Promise<PromoCodeValidationResult> {
    const body: ValidatePromoCodeRequest = { code, subtotal };
    return firstValueFrom(
      this.http.post<PromoCodeValidationResult>(`${this.baseUrl}/validate`, body)
    );
  }

  // ── Admin endpoints ───────────────────────────────────────────────────────
  async getAll(): Promise<PromoCodeResponse[]> {
    return firstValueFrom(this.http.get<PromoCodeResponse[]>(this.baseUrl));
  }

  async create(dto: CreatePromoCodeRequest): Promise<PromoCodeResponse> {
    return firstValueFrom(
      this.http.post<PromoCodeResponse>(this.baseUrl, dto)
    );
  }

  async createAndAssign(
    dto: CreateAndAssignPromoCodeRequest
  ): Promise<PromoCodeResponse> {
    return firstValueFrom(
      this.http.post<PromoCodeResponse>(`${this.baseUrl}/create-for-user`, dto)
    );
  }

  async assignToUser(promoCodeId: number, userId: number): Promise<void> {
    await firstValueFrom(
      this.http.post(`${this.baseUrl}/${promoCodeId}/assign/${userId}`, {})
    );
  }

  async deactivate(promoCodeId: number): Promise<void> {
    await firstValueFrom(
      this.http.post(`${this.baseUrl}/${promoCodeId}/deactivate`, {})
    );
  }

  async getByUser(userId: number): Promise<PromoCodeResponse[]> {
    return firstValueFrom(
      this.http.get<PromoCodeResponse[]>(`${this.baseUrl}/user/${userId}`)
    );
  }
}