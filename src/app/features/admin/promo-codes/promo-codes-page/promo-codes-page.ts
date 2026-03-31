import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, Validators } from '@angular/forms';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { PromoCodeService } from '../../../../core/services/promo-code/promo-code-service';
import { PromoCodeResponse, CreatePromoCodeRequest} from '../../../../core/models/promo-code';
import { CustomerManagementService } from '../../../../core/services/customer/customer-management-services';
import { Customer } from '../../../../core/models/customer';
import { AdminSidebar } from '../../layout/admin-sidebar/admin-sidebar';
import { AdminHeader } from '../../layout/admin-header/header';
import { ErrorDialogService } from '../../../../core/services/error/error-dialog.service';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { TranslationService } from '../../../../core/services/translation/translation.service';
import { CustomSelectComponent, SelectOption } from '../../../../shared/components/custom-select/custom-select';

@Component({
  selector: 'app-promo-codes-page',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, AdminSidebar, AdminHeader, ConfirmDialogComponent, CustomSelectComponent],
  templateUrl: './promo-codes-page.html',
  styleUrl: './promo-codes-page.css',
})
export class PromoCodesPage implements OnInit, OnDestroy {
  private promoCodeService = inject(PromoCodeService);
  private fb               = inject(FormBuilder);
  private errorDialog      = inject(ErrorDialogService);
  customerService  = inject(CustomerManagementService);
  private translationService = inject(TranslationService);

  // ── State ─────────────────────────────────────────────────────────────────
  promoCodes   = signal<PromoCodeResponse[]>([]);
  loading      = signal(false);
  submitting   = signal(false);
  showForm     = signal(false);
  searchTerm   = signal('');

  // Search debounce
  private searchSubject = new Subject<string>();
  private searchSub?: Subscription;
  translations = this.translationService.translations;


  // Dialog State
  showConfirmDialog = signal(false);
  confirmDialogData = signal<ConfirmDialogData>({ title: '', message: '' });
  confirmDialogAction = signal<(() => void) | null>(null);

  // ── Assign Form ───────────────────────────────────────────────────────────
  showAssignForm   = signal(false);
  assignPromo      = signal<PromoCodeResponse | null>(null);
  assignUserId     = signal<number | null>(null);
  assignSubmitting = signal(false);

  // Computed options for custom select
  customerOptions = computed<SelectOption[]>(() => {
    return this.customerService.customers().map(c => ({
      value: c.id,
      label: `${c.firstName} ${c.lastName} (${c.email})`
    }));
  });

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
    this.customerService.loadAllCustomers({ pageSize: 1000 });
    this.loadAll();
    this.searchSub = this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(term => {
      this.searchTerm.set(term);
      this.loadAll(term || undefined);
    });
  }

  ngOnDestroy(): void {
    this.searchSub?.unsubscribe();
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchSubject.next(value);
  }

  async loadAll(search?: string): Promise<void> {
    this.loading.set(true);
    try {
      await this.promoCodeService.loadAllPromoCodes(search);
      this.promoCodes.set(this.promoCodeService.promoCodes());
    } catch {
      this.errorDialog.showError({
        title: 'Errore',
        message: 'Impossibile caricare i codici promozionali.'
      });
    } finally {
      this.loading.set(false);
    }
  }

  async create(): Promise<void> {
    if (this.createForm.invalid) return;

    this.submitting.set(true);

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
      
      const created = await this.promoCodeService.create(dto);
      
      if (created) {
         this.confirmDialogData.set({
             title: 'Promo Code Creato',
             message: `Il codice promozionale "${dto.code}" è stato creato con successo.`,
             confirmText: 'OK'
         });
         this.showConfirmDialog.set(true);
         
         this.createForm.reset({ discountType: 'Percentage' });
         this.showForm.set(false);
         await this.loadAll();
      } else {
         const errMsg = this.promoCodeService.errorSignal() || 'Impossibile creare il codice promozionale.';
         this.errorDialog.showError({
            title: 'Creazione Fallita',
            message: errMsg
         });
      }
    } catch (err: any) {
      this.errorDialog.showError({
         title: 'Creazione Fallita',
         message: err?.error?.error || 'Impossibile creare il codice promozionale.'
      });
    } finally {
      this.submitting.set(false);
    }
  }

  deactivate(id: number, code: string): void {
    this.confirmDialogData.set({
       title: 'Disattiva Promo Code',
       message: `Vuoi disattivare il codice promozionale "${code}"?`,
       confirmText: 'Disattiva',
       cancelText: 'Annulla',
       isDangerous: true
    });
    
    this.confirmDialogAction.set(async () => {
      try {
        const ok = await this.promoCodeService.deactivate(id);
        if (ok) {
           this.confirmDialogData.set({
               title: 'Promo Code Disattivato',
               message: `Il codice promozionale "${code}" è stato disattivato.`,
               confirmText: 'OK',
               isDangerous: false,
               cancelText: undefined
           });
           this.confirmDialogAction.set(null); // Just close on next OK
           this.showConfirmDialog.set(true);
           await this.loadAll();
        } else {
           const errMsg = this.promoCodeService.errorSignal() || 'Impossibile disattivare il codice promozionale.';
           this.errorDialog.showError({
              title: 'Disattivazione Fallita',
              message: errMsg
           });
        }
      } catch {
        this.errorDialog.showError({
           title: 'Errore',
           message: 'Impossibile disattivare il codice promozionale.'
        });
      }
    });

    this.showConfirmDialog.set(true);
  }

  activateCode(id: number, code: string): void {
    this.confirmDialogData.set({
       title: 'Attiva Promo Code',
       message: `Vuoi riattivare il codice promozionale "${code}"?`,
       confirmText: 'Attiva',
       cancelText: 'Annulla',
       isDangerous: false
    });
    
    this.confirmDialogAction.set(async () => {
      try {
        const ok = await this.promoCodeService.activate(id);
        if (ok) {
           this.confirmDialogData.set({
               title: 'Promo Code Attivato',
               message: `Il codice promozionale "${code}" è stato riattivato.`,
               confirmText: 'OK',
               isDangerous: false,
               cancelText: undefined
           });
           this.confirmDialogAction.set(null);
           this.showConfirmDialog.set(true);
           await this.loadAll();
        } else {
           const errMsg = this.promoCodeService.errorSignal() || 'Impossibile attivare il codice promozionale.';
           this.errorDialog.showError({
              title: 'Attivazione Fallita',
              message: errMsg
           });
        }
      } catch {
        this.errorDialog.showError({
           title: 'Errore',
           message: 'Impossibile attivare il codice promozionale.'
        });
      }
    });

    this.showConfirmDialog.set(true);
  }

  onConfirmDialog(): void {
    const action = this.confirmDialogAction();
    if (action) {
      action();
    } else {
      this.closeConfirmDialog();
    }
  }

  closeConfirmDialog(): void {
    this.showConfirmDialog.set(false);
    this.confirmDialogAction.set(null);
  }

  // ── Assign Logic ──────────────────────────────────────────────────────────

  openAssign(promo: PromoCodeResponse): void {
    this.assignPromo.set(promo);
    this.assignUserId.set(null);
    this.showAssignForm.set(true);
  }

  closeAssign(): void {
    this.showAssignForm.set(false);
    this.assignPromo.set(null);
    this.assignUserId.set(null);
  }

  async confirmAssign(): Promise<void> {
    const promo = this.assignPromo();
    const userId = this.assignUserId();
    
    if (!promo || !userId) {
      this.errorDialog.showError({
         title: 'Errore',
         message: 'Seleziona un cliente per l\'assegnazione.'
      });
      return;
    }

    this.assignSubmitting.set(true);
    try {
      const ok = await this.promoCodeService.assignToUser(promo.id, userId);
      if (ok) {
         this.confirmDialogData.set({
             title: 'Promo Code Assegnato',
             message: `Il codice promozionale "${promo.code}" è stato assegnato con successo.`,
             confirmText: 'OK'
         });
         this.showConfirmDialog.set(true);
         this.closeAssign();
         await this.loadAll();
      } else {
         const errMsg = this.promoCodeService.errorSignal() || 'Impossibile assegnare il codice promozionale.';
         this.errorDialog.showError({
            title: 'Assegnazione Fallita',
            message: errMsg
         });
      }
    } catch {
      this.errorDialog.showError({
         title: 'Errore',
         message: 'Impossibile completare l\'assegnazione.'
      });
    } finally {
      this.assignSubmitting.set(false);
    }
  }
}
