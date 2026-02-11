import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProfileApiService, AddressResponse, SaveAddressRequest } from '../../../../../core/services/profile/profile-api.service';
import { TranslationService } from '../../../../../core/services/translation/translation.service';

@Component({
  selector: 'app-personal-address',
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './personal-address.html',
  styleUrl: './personal-address.css',
})
export class PersonalAddress implements OnInit, OnDestroy {
  private profileApi = inject(ProfileApiService);
  private translationService = inject(TranslationService);
  private formBuilder = inject(FormBuilder);

  addressForm!: FormGroup;
  addresses: AddressResponse[] = [];
  isAdding = false;
  editingAddressId: number | null = null;
  isSaving = false;
  isLoading = false;
  saveSuccess = false;
  saveError: string | null = null;

  private destroy$ = new Subject<void>();

  // Translations
  translations = this.translationService.translations;

  constructor() {
    this.addressForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadAddresses();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Crea il form
   */
  private createForm(): FormGroup {
    return this.formBuilder.group({
      street: ['', [Validators.required, Validators.minLength(5)]],
      city: ['', [Validators.required, Validators.minLength(2)]],
      postalCode: ['', [Validators.required, Validators.pattern(/^\d{5,}$/)]],
      country: ['', Validators.required],
      setAsDefault: [false]
    });
  }

  /**
   * Carica gli indirizzi dall'API
   */
  private loadAddresses(): void {
    this.isLoading = true;
    this.saveError = null; // Clear previous errors

    this.profileApi.getAddresses()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (addresses) => {
          console.log('✅ Addresses loaded:', addresses);
          this.addresses = addresses || []; // Handle null/undefined
          this.isLoading = false;
        },
        error: (error) => {
          console.error('❌ Failed to load addresses:', error);
          this.isLoading = false;
          this.addresses = []; // Set empty array on error
          // Don't show error dialog for empty results
          if (error.status !== 404) {
            this.saveError = this.translations().profile.addressSection.errors.loadFailed;
          }
        }
      });
  }

  /**
   * Abilita la modalità di aggiunta
   */
  startAdding(): void {
    this.isAdding = true;
    this.editingAddressId = null;
    this.addressForm.reset({ setAsDefault: false });
  }

  /**
   * Abilita la modalità di modifica
   */
  startEditing(address: AddressResponse): void {
    this.isAdding = true;
    this.editingAddressId = address.addressId;
    this.addressForm.patchValue({
      street: address.street,
      city: address.city,
      postalCode: address.postalCode,
      country: address.country,
      setAsDefault: address.isDefault
    });
  }

  /**
   * Annulla l'operazione
   */
  cancel(): void {
    this.isAdding = false;
    this.editingAddressId = null;
    this.addressForm.reset();
    this.saveError = null;
  }

  /**
   * Salva l'indirizzo
   */
  onSave(): void {
    if (this.addressForm.invalid) {
      console.warn('Form invalid');
      return;
    }

    this.isSaving = true;
    this.saveError = null;
    this.saveSuccess = false;

    const formValue = this.addressForm.value;
    const saveData: SaveAddressRequest = {
      addressId: this.editingAddressId || undefined,
      street: formValue.street,
      city: formValue.city,
      postalCode: formValue.postalCode,
      country: formValue.country,
      setAsDefault: formValue.setAsDefault || false
    };

    this.profileApi.saveAddress(saveData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (savedAddress) => {
          console.log('✅ Address saved successfully:', savedAddress);
          this.isSaving = false;
          this.saveSuccess = true;
          this.isAdding = false;
          this.editingAddressId = null;
          this.addressForm.reset();

          // Reload addresses
          this.loadAddresses();

          // Hide success message after 3 seconds
          setTimeout(() => {
            this.saveSuccess = false;
          }, 3000);
        },
        error: (error) => {
          console.error('❌ Failed to save address:', error);
          this.isSaving = false;
          this.saveError = this.translations().profile.addressSection.errors.saveFailed;
        }
      });
  }

  /**
   * Elimina un indirizzo
   */
  deleteAddress(addressId: number): void {
    const confirmMessage = this.translations().profile.addressSection.confirmDelete
    if (confirm(confirmMessage)) {
      this.profileApi.deleteAddress(addressId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            console.log('✅ Address deleted successfully');
            this.saveSuccess = true;
            this.loadAddresses();

            setTimeout(() => {
              this.saveSuccess = false;
            }, 3000);
          },
          error: (error) => {
            console.error('❌ Failed to delete address:', error);
            this.saveError = this.translations().profile.addressSection.errors.deleteFailed;
          }
        });
    }
  }

  /**
   * Imposta come indirizzo predefinito
   */
  setAsDefault(addressId: number): void {
    // Find the address
    const address = this.addresses.find(a => a.addressId === addressId);
    if (!address) return;

    // Save with setAsDefault = true
    const saveData: SaveAddressRequest = {
      addressId: address.addressId,
      street: address.street,
      city: address.city,
      postalCode: address.postalCode,
      country: address.country,
      setAsDefault: true
    };

    this.profileApi.saveAddress(saveData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          console.log('✅ Default address updated');
          this.saveSuccess = true;
          this.loadAddresses();

          setTimeout(() => {
            this.saveSuccess = false;
          }, 3000);
        },
        error: (error) => {
          console.error('❌ Failed to set default address:', error);
          this.saveError = this.translations().profile.addressSection.errors.setDefaultFailed;
        }
      });
  }

  /**
   * Getters per errori
   */
  get streetError(): string | null {
    const control = this.addressForm.get('street');
    const t = this.translations().profile.addressSection.errors;
    if (control?.hasError('required')) return t.streetRequired;
    if (control?.hasError('minlength')) return t.streetMinLength;
    return null;
  }

  get cityError(): string | null {
    const control = this.addressForm.get('city');
    const t = this.translations().profile.addressSection.errors;
    if (control?.hasError('required')) return t.cityRequired;
    if (control?.hasError('minlength')) return t.cityMinLength;
    return null;
  }

  get postalCodeError(): string | null {
    const control = this.addressForm.get('postalCode');
    const t = this.translations().profile.addressSection?.errors;
    if (control?.hasError('required')) return t?.postalCodeRequired;
    if (control?.hasError('pattern')) return t?.postalCodePattern;
    return null;
  }

  get countryError(): string | null {
    const control = this.addressForm.get('country');
    const t = this.translations().profile.addressSection?.errors;
    if (control?.hasError('required')) return t?.countryRequired || 'Country is required';
    return null;
  }
}
