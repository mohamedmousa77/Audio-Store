import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Address } from '../../../../../core/models/user-address';

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
  addressForm!: FormGroup;
  addresses: Address[] = [];
  isAdding = false;
  editingAddressId: string | null = null;
  isSaving = false;
  saveSuccess = false;
  saveError: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(private formBuilder: FormBuilder) {
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
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      city: ['', [Validators.required, Validators.minLength(2)]],
      zipCode: ['', [Validators.required, Validators.pattern(/^\d{5,}$/)]],
      country: ['', Validators.required],
    });
  }

  /**
   * Carica gli indirizzi (simulato)
   */
  private loadAddresses(): void {
    // In un vero scenario, caricheresti da un servizio API
    this.addresses = [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        address: '1234 Sound Wave Avenue, Apt 46',
        city: 'San Francisco',
        zipCode: '94105',
        country: 'United States',
        isDefault: true,
      },
    ];
  }

  /**
   * Abilita la modalità di aggiunta
   */
  startAdding(): void {
    this.isAdding = true;
    this.editingAddressId = null;
    this.addressForm.reset();
  }

  /**
   * Abilita la modalità di modifica
   */
  startEditing(address: Address): void {
    this.isAdding = true;
    this.editingAddressId = address.id || null;
    this.addressForm.patchValue(address);
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

    // Simula una chiamata API
    setTimeout(() => {
      try {
        const formValue = this.addressForm.value;

        if (this.editingAddressId) {
          // Modifica indirizzo esistente
          const index = this.addresses.findIndex(
            (a) => a.id === this.editingAddressId
          );
          if (index !== -1) {
            this.addresses[index] = {
              ...this.addresses[index],
              ...formValue,
            };
          }
        } else {
          // Aggiungi nuovo indirizzo
          const newAddress: Address = {
            id: Date.now().toString(),
            ...formValue,
            isDefault: this.addresses.length === 0,
          };
          this.addresses.push(newAddress);
        }

        this.isSaving = false;
        this.saveSuccess = true;
        this.isAdding = false;
        this.editingAddressId = null;
        this.addressForm.reset();

        // Nascondi il messaggio di successo dopo 3 secondi
        setTimeout(() => {
          this.saveSuccess = false;
        }, 3000);
      } catch (error) {
        this.isSaving = false;
        this.saveError = 'Failed to save address. Please try again.';
      }
    }, 800);
  }

  /**
   * Elimina un indirizzo
   */
  deleteAddress(id: string | undefined): void {
    if (!id) return;

    if (confirm('Are you sure you want to delete this address?')) {
      this.addresses = this.addresses.filter((a) => a.id !== id);
      this.saveSuccess = true;

      setTimeout(() => {
        this.saveSuccess = false;
      }, 3000);
    }
  }

  /**
   * Imposta come indirizzo predefinito
   */
  setAsDefault(id: string | undefined): void {
    if (!id) return;

    this.addresses.forEach((address) => {
      address.isDefault = address.id === id;
    });

    this.saveSuccess = true;
    setTimeout(() => {
      this.saveSuccess = false;
    }, 3000);
  }

  /**
   * Getters per errori
   */
  get firstNameError(): string | null {
    const control = this.addressForm.get('firstName');
    if (control?.hasError('required')) return 'First name is required';
    if (control?.hasError('minlength')) return 'Must be at least 2 characters';
    return null;
  }

  get lastNameError(): string | null {
    const control = this.addressForm.get('lastName');
    if (control?.hasError('required')) return 'Last name is required';
    if (control?.hasError('minlength')) return 'Must be at least 2 characters';
    return null;
  }

  get addressError(): string | null {
    const control = this.addressForm.get('address');
    if (control?.hasError('required')) return 'Address is required';
    if (control?.hasError('minlength')) return 'Must be at least 5 characters';
    return null;
  }

  get cityError(): string | null {
    const control = this.addressForm.get('city');
    if (control?.hasError('required')) return 'City is required';
    if (control?.hasError('minlength')) return 'Must be at least 2 characters';
    return null;
  }

  get zipCodeError(): string | null {
    const control = this.addressForm.get('zipCode');
    if (control?.hasError('required')) return 'ZIP code is required';
    if (control?.hasError('pattern')) return 'ZIP code must contain at least 5 digits';
    return null;
  }

  get countryError(): string | null {
    const control = this.addressForm.get('country');
    if (control?.hasError('required')) return 'Country is required';
    return null;
  }

}
