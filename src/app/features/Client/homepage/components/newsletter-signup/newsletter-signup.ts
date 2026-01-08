import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-newsletter-signup',
  imports: [CommonModule, FormsModule],
  templateUrl: './newsletter-signup.html',
  styleUrl: './newsletter-signup.css',
})
export class NewsletterSignup {
   email = '';
  submitted = false;
  loading = false;

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
