import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { PromoCodeService } from '../../../../../core/services/promo-code/promo-code-service';
import { PromoCodeResponse, CreatePromoCodeRequest} from '../../../../../core/models/promo-code';

@Component({
  selector: 'app-promo-codes-page',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './promo-codes-page.html',
  styleUrl: './promo-codes-page.css',
})
export class PromoCodesPage {
  private promoCodeService = inject(PromoCodeService);
  private fb               = inject(FormBuilder);

  // ── State ─────────────────────────────────────────────────────────────────
  promoCodes   = signal<PromoCodeResponse[]>([]);
  loading      = signal(false);
  submitting   = signal(false);
  errorMsg     = signal('');
  successMsg   = signal('');
  showForm     = signal(false);

  // ── Create Form ───────────────────────────────────────────────────────────
  createForm = this.fb.group({
    code:           ['', [Validators.required, Validators.minLength(3)]],
    discountType:   ['Percentage', Validators.required],
    discountValue:  [null as number | null, [Validators.required, Validators.min(1)]],
    minOrderAmount: [null as number | null],
    expiresAt:      [null as string | null],
    maxUsages:      [null as number | null, Validators.min(1)]
  });

  ngOnInit(): void {
    this.loadAll();
  }

  async loadAll(): Promise<void> {
    this.loading.set(true);
    try {
      const data = await this.promoCodeService.getAll();
      this.promoCodes.set(data);
    } catch {
      this.errorMsg.set('Failed to load promo codes.');
    } finally {
      this.loading.set(false);
    }
  }

  async create(): Promise<void> {
    if (this.createForm.invalid) return;

    this.submitting.set(true);
    this.errorMsg.set('');
    this.successMsg.set('');

    try {
      const val = this.createForm.value;
      const dto: CreatePromoCodeRequest = {
        code:           val.code!.toUpperCase(),
        discountType:   val.discountType as 'Percentage' | 'FixedAmount',
        discountValue:  val.discountValue!,
        minOrderAmount: val.minOrderAmount ?? undefined,
        expiresAt:      val.expiresAt ?? undefined,
        maxUsages:      val.maxUsages ?? undefined
      };
      await this.promoCodeService.create(dto);
      this.successMsg.set(`Promo code "${dto.code}" created successfully.`);
      this.createForm.reset({ discountType: 'Percentage' });
      this.showForm.set(false);
      await this.loadAll();
    } catch (err: any) {
      this.errorMsg.set(err?.error?.error ?? 'Failed to create promo code.');
    } finally {
      this.submitting.set(false);
    }
  }

  async deactivate(id: number, code: string): Promise<void> {
    if (!confirm(`Deactivate promo code "${code}"?`)) return;
    try {
      await this.promoCodeService.deactivate(id);
      this.successMsg.set(`"${code}" deactivated.`);
      await this.loadAll();
    } catch {
      this.errorMsg.set('Failed to deactivate.');
    }
  }

  clearMessages(): void {
    this.errorMsg.set('');
    this.successMsg.set('');
  }

}
