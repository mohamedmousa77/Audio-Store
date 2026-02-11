import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartServices } from '../../../../core/services/cart/cart-services';
import { OrderServices } from '../../../../core/services/order/order-services';
import { CreateOrderRequest } from '../../../../core/models/order';
import { ClientHeader } from "../../layout/client-header/client-header";
import { AuthServices } from '../../../../core/services/auth/auth-services';
import { TranslationService } from '../../../../core/services/translation/translation.service';
import { ProfileApiService } from '../../../../core/services/profile/profile-api.service';

/**
 * Checkout Page Component (OrderPage)
 * Updated to use new OrderServices with createOrder integration
 * 
 * Breaking Changes:
 * - Uses Signals from CartServices
 * - Uses new createOrder() method from OrderServices
 * - Converts cart → order items automatically
 * - Clears cart after successful order
 */
@Component({
  selector: 'app-order-page',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ClientHeader],
  templateUrl: './order-page.html',
  styleUrl: './order-page.css',
})
export class OrderPage implements OnInit {
  private formBuilder = inject(FormBuilder);
  private cartService = inject(CartServices);
  private orderService = inject(OrderServices);
  private authService = inject(AuthServices);
  private profileApi = inject(ProfileApiService);
  private router = inject(Router);
  private translationService = inject(TranslationService);

  // Use Signals from CartServices
  cart = this.cartService.cart;
  items = this.cartService.items;
  totalPrice = this.cartService.totalAmount;
  isEmpty = this.cartService.isEmpty;

  // Translations
  translations = this.translationService.translations;

  // Auth state
  isAuthenticated = () => this.authService.isAuthenticated();

  // Forms
  shippingForm!: FormGroup;

  // State
  currentStep: 'shipping' | 'payment' | 'review' = 'shipping';
  shippingCost = 5.99;
  taxRate = 0.10;

  // Loading/error states
  isProcessing = signal<boolean>(false);
  errorMessage = signal<string>('');

  ngOnInit(): void {
    // Redirect to cart if empty
    if (this.isEmpty()) {
      this.router.navigate(['/client/cart']);
      return;
    }

    this.initializeForms();

    // Pre-fill form with user data and default address if authenticated
    if (this.authService.isAuthenticated()) {
      const user = this.authService.getCurrentUser();
      if (user) {
        this.shippingForm.patchValue({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          phone: user.phoneNumber || ''
        });
      }

      // Load user's default address
      this.loadDefaultAddress();
    }
  }

  private initializeForms(): void {
    this.shippingForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9\-\+\s]+$/)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      city: ['', [Validators.required, Validators.minLength(2)]],
      zipCode: ['', [Validators.required, Validators.pattern(/^[0-9]{5}$/)]],
      country: ['Italy', Validators.required]
    });
  }

  /**
   * Calculate tax amount
   */
  getTaxAmount(): number {
    return this.totalPrice() * this.taxRate;
  }

  /**
   * Calculate total amount (subtotal + shipping + tax)
   */
  getTotalAmount(): number {
    return this.totalPrice() + this.shippingCost + this.getTaxAmount();
  }

  /**
   * Navigate back to shipping step
   */
  goBackToShipping(): void {
    this.currentStep = 'shipping';
  }

  /**
   * Navigate back to payment step
   */
  goBackToPayment(): void {
    this.currentStep = 'payment';
  }

  /**
   * Place order
   * Creates order via OrderServices, clears cart, and navigates to confirmation
   */
  async placeOrder(): Promise<void> {
    console.log("Placing order...");

    // Validate form
    if (!this.shippingForm.valid) {
      this.errorMessage.set('Per favore completa tutti i campi obbligatori');
      return;
    }

    // Check if cart is empty
    if (this.isEmpty()) {
      this.errorMessage.set('Il carrello è vuoto');
      this.router.navigate(['/client/cart']);
      return;
    }

    this.isProcessing.set(true);
    this.errorMessage.set('');

    try {
      const formData = this.shippingForm.value;

      // Create order request
      const orderRequest: CreateOrderRequest = {
        // Shipping address (required)
        ShippingStreet: formData.address,
        ShippingCity: formData.city,
        ShippingPostalCode: formData.zipCode,
        ShippingCountry: formData.country,

        // Order items (converted from cart)
        Items: this.orderService.convertCartToOrderItems(this.cart()),

        // Customer info (optional - backend gets from JWT if authenticated)
        CustomerFirstName: formData.firstName,
        CustomerLastName: formData.lastName,
        CustomerEmail: formData.email,
        CustomerPhone: formData.phone
      };

      console.log('📦 Creating order:', orderRequest);
      console.log('📦 Order items:', orderRequest.Items);
      console.log('📦 Cart data:', this.cart());

      // Create order via OrderServices
      const confirmation = await this.orderService.createOrder(orderRequest);

      if (confirmation) {
        console.log('✅ Order created successfully:', confirmation.orderNumber);

        // Clear cart after successful order
        await this.cartService.clearCart();

        // Navigate to order confirmation page
        this.router.navigate(['/client/order-confirmation', confirmation.orderNumber]);
      } else {
        throw new Error('Order confirmation not received');
      }
    } catch (error: any) {
      console.error('❌ Error creating order:', error);

      // Try to extract specific error message from backend
      let errorMsg = 'Si è verificato un errore durante la creazione dell\'ordine. Per favore riprova.';

      if (error?.error?.message) {
        errorMsg = error.error.message;
        console.error('Backend error message:', error.error.message);
      }

      if (error?.error?.errors) {
        console.error('Backend validation errors:', error.error.errors);
      }

      this.errorMessage.set(errorMsg);
    } finally {
      this.isProcessing.set(false);
    }
  }

  /**
   * Load user's default address and pre-fill shipping form
   */
  private loadDefaultAddress(): void {
    console.log('🔍 loadDefaultAddress() called');
    console.log('📋 Current form values:', this.shippingForm.value);

    this.profileApi.getAddresses().subscribe({
      next: (addresses) => {
        console.log('✅ Addresses received:', addresses);
        const defaultAddress = addresses.find(addr => addr.isDefault || addresses.length === 1);
        if (defaultAddress) {
          console.log('✅ Auto-filling default address:', defaultAddress);
          console.log('📝 Patching form with:', {
            address: defaultAddress.street,
            city: defaultAddress.city,
            zipCode: defaultAddress.postalCode,
            country: defaultAddress.country
          });

          this.shippingForm.patchValue({
            address: defaultAddress.street,
            city: defaultAddress.city,
            zipCode: defaultAddress.postalCode,
            country: defaultAddress.country
          });

          console.log('📋 Form values after patch:', this.shippingForm.value);
        } else {
          console.log('ℹ️ No default address found for user');
        }
      },
      error: (error) => {
        console.error('❌ Failed to load default address:', error);
        console.error('Error details:', error.status, error.message);
        // Don't show error to user - they can still fill manually
      }
    });
  }

  /**
   * Cancel checkout and return to cart
   */
  cancelCheckout(): void {
    this.router.navigate(['/client/cart']);
  }
}
