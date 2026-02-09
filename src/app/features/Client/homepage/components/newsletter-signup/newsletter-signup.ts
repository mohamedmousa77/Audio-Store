import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../../../../../core/services/translation/translation.service';

@Component({
  selector: 'app-newsletter-signup',
  imports: [CommonModule, FormsModule],
  templateUrl: './newsletter-signup.html',
  styleUrl: './newsletter-signup.css',
})
export class NewsletterSignup {
  private translationService = inject(TranslationService);
   email = '';
  submitted = false;
  loading = false;

  translations = this.translationService.translations;



  onSubmit(): void {
    if (!this.email || !this.email.includes('@')) {
      return;
    }

    this.loading = true;
    setTimeout(() => {
      this.submitted = true;
      this.email = '';
      this.loading = false;
      setTimeout(() => {
        this.submitted = false;
      }, 3000);
    }, 1000);
  }

}
