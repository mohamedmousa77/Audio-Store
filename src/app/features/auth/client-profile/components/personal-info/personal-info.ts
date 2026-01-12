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
import { AuthServices } from '../../../../../core/services/auth/auth-services';
import { User } from '../../../../../core/models/user';
@Component({
  selector: 'app-personal-info',
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  standalone: true,
  providers: [
    AuthServices,
  ],
  templateUrl: './personal-info.html',
  styleUrl: './personal-info.css',
})
export class PersonalInfo implements OnInit, OnDestroy{


  personalForm!: FormGroup;
  currentUser: User | null = null;
  isEditing = false;
  isSaving = false;
  saveSuccess = false;
  saveError: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthServices
  ) {
    this.personalForm = this.createForm();
  }

  ngOnInit(): void {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        if (user) {
          this.currentUser = user;
          this.updateFormWithUserData(user);
        }
      });
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
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, this.phoneValidator]],
    });
  }

  /**
   * Validatore custom per telefono
   */
  phoneValidator(control: any): any {
    if (!control.value) {
      return null;
    }
    const phoneRegex = /^[\d\s\-+()]{9,}$/;
    return phoneRegex.test(control.value) ? null : { invalidPhone: true };
  }

  /**
   * Aggiorna il form con dati utente
   */
  private updateFormWithUserData(user: User): void {
    this.personalForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || '',
    });
  }

  /**
   * Abilita/Disabilita la modalità edit
   */
  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    this.saveError = null;
    this.saveSuccess = false;

    if (!this.isEditing) {
      this.updateFormWithUserData(this.currentUser!);
    }
  }

  /**
   * Salva le modifiche
   */
  onSave(): void {
    if (this.personalForm.invalid) {
      console.warn('Form invalid');
      return;
    }

    this.isSaving = true;
    this.saveError = null;
    this.saveSuccess = false;

    // Simula una chiamata API
    setTimeout(() => {
      try {
        const formValue = this.personalForm.value;

        // Aggiorna il servizio (in un vero scenario faresti una chiamata API)
        const updatedUser: User = {
          ...this.currentUser!,
          ...formValue,
        };

        // Simula salvataggio
        console.log('Saving user data:', updatedUser);

        this.isSaving = false;
        this.saveSuccess = true;
        this.isEditing = false;

        // Nascondi il messaggio di successo dopo 3 secondi
        setTimeout(() => {
          this.saveSuccess = false;
        }, 3000);
      } catch (error) {
        this.isSaving = false;
        this.saveError = 'Failed to save changes. Please try again.';
      }
    }, 800);
  }

  /**
   * Getter per errore firstName
   */
  get firstNameError(): string | null {
    const control = this.personalForm.get('firstName');
    if (control?.hasError('required')) return 'First name is required';
    if (control?.hasError('minlength')) return 'Must be at least 2 characters';
    return null;
  }

  /**
   * Getter per errore lastName
   */
  get lastNameError(): string | null {
    const control = this.personalForm.get('lastName');
    if (control?.hasError('required')) return 'Last name is required';
    if (control?.hasError('minlength')) return 'Must be at least 2 characters';
    return null;
  }

  /**
   * Getter per errore email
   */
  get emailError(): string | null {
    const control = this.personalForm.get('email');
    if (control?.hasError('required')) return 'Email is required';
    if (control?.hasError('email')) return 'Enter a valid email';
    return null;
  }

  /**
   * Getter per errore phone
   */
  get phoneError(): string | null {
    const control = this.personalForm.get('phone');
    if (control?.hasError('required')) return 'Phone number is required';
    if (control?.hasError('invalidPhone')) return 'Enter a valid phone number';
    return null;
  }

}
