import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthServices } from '../../../../../core/services/auth/auth-services';
import { User } from '../../../../../core/models/user';
import { TranslationService } from '../../../../../core/services/translation/translation.service';
import { ProfileApiService } from '../../../../../core/services/profile/profile-api.service';

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
export class PersonalInfo implements OnInit, OnDestroy {

  private translationService = inject(TranslationService);
  private profileApi = inject(ProfileApiService);
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

  // Translations
  translations = this.translationService.translations;

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

    const formValue = this.personalForm.value;
    const updateData = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      phoneNumber: formValue.phone || undefined
    };

    this.profileApi.updateProfile(updateData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('✅ Profile updated successfully:', response);
          this.isSaving = false;
          this.saveSuccess = true;
          this.isEditing = false;

          // Hide success message after 3 seconds
          setTimeout(() => {
            this.saveSuccess = false;
          }, 3000);
        },
        error: (error) => {
          console.error('❌ Failed to update profile:', error);
          this.isSaving = false;
          this.saveError = this.translations().profile.personalInfoSection.savePersonalInfo.errorMessage;
        }
      });
  }

  /**
   * Getter per errore firstName
   */
  get firstNameError(): string | null {
    const control = this.personalForm.get('firstName');
    const t = this.translations().profile.personalInfoSection.errors;
    if (control?.hasError('required')) return t.firstNameRequired;
    if (control?.hasError('minlength')) return t.firstNameMinLength;
    return null;
  }

  /**
   * Getter per errore lastName
   */
  get lastNameError(): string | null {
    const control = this.personalForm.get('lastName');
    const t = this.translations().profile.personalInfoSection.errors;
    if (control?.hasError('required')) return t.lastNameRequired;
    if (control?.hasError('minlength')) return t.lastNameMinLength;
    return null;
  }

  /**
   * Getter per errore email
   */
  get emailError(): string | null {
    const control = this.personalForm.get('email');
    const t = this.translations().profile.personalInfoSection.errors;
    if (control?.hasError('required')) return t.emailRequired;
    if (control?.hasError('email')) return t.emailInvalid;
    return null;
  }

  /**
   * Getter per errore phone
   */
  get phoneError(): string | null {
    const control = this.personalForm.get('phone');
    const t = this.translations().profile.personalInfoSection.errors;
    if (control?.hasError('required')) return t.phoneRequired;
    if (control?.hasError('invalidPhone')) return t.phoneInvalid;
    return null;
  }

}
