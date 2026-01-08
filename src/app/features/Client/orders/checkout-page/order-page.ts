import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Cart } from '../../../../core/models/cart';
import { CartServices } from '../../../../core/services/cart/cart-services';
import { OrderServices } from '../../../../core/services/order/order-services';
import { ShippingAddress, PaymentDetails } from '../../../../core/models/order';

@Component({
  selector: 'app-order-page',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './order-page.html',
  styleUrl: './order-page.css',
})
export class OrderPage implements OnInit {
  cart: Cart = {
    items: [],
    totalItems: 0,
    totalPrice: 0
  };

  shippingForm!: FormGroup;
  paymentForm!: FormGroup;
  
  currentStep: 'shipping' | 'payment' | 'review' = 'shipping';
  shippingCost = 5.99;
  taxRate = 0.10;

  constructor(
    private formBuilder: FormBuilder,
    private cartService: CartServices,
    private orderService: OrderServices,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForms();
    this.cartService.getCart().subscribe(cart => {
      this.cart = cart;
      if (cart.items.length === 0) {
        this.router.navigate(['/client/cart']);
      }
    });
  }

  private initializeForms(): void {
    // Shipping Form
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

    // Payment Form
    this.paymentForm = this.formBuilder.group({
      cardholderName: ['', [Validators.required, Validators.minLength(3)]],
      cardNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{16}$/)]],
      expiryDate: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^[0-9]{3}$/)]],
      billingAddressSame: [true]
    });
  }

  getTaxAmount(): number {
    return this.cart.totalPrice * this.taxRate;
  }

  getTotalAmount(): number {
    return this.cart.totalPrice + this.shippingCost + this.getTaxAmount();
  }

  goToPayment(): void {
    if (this.shippingForm.valid) {
      this.currentStep = 'payment';
    }
  }

  goToReview(): void {
    if (this.paymentForm.valid) {
      this.currentStep = 'review';
    }
  }

  goBackToShipping(): void {
    this.currentStep = 'shipping';
  }

  goBackToPayment(): void {
    this.currentStep = 'payment';
  }

  placeOrder(): void {
    if (this.shippingForm.valid && this.paymentForm.valid) {
      const shippingData = this.shippingForm.value;
      const paymentData = this.paymentForm.value;

      const shippingAddress: ShippingAddress = {
        firstName: shippingData.firstName,
        lastName: shippingData.lastName,
        email: shippingData.email,
        phone: shippingData.phone,
        address: shippingData.address,
        city: shippingData.city,
        zipCode: shippingData.zipCode,
        country: shippingData.country
      };

      const paymentDetails: PaymentDetails = {
        cardholderName: paymentData.cardholderName,
        cardNumber: `****${paymentData.cardNumber.slice(-4)}`,
        expiryDate: paymentData.expiryDate,
        cvv: paymentData.cvv,
        billingAddress: paymentData.billingAddressSame ? shippingAddress : shippingAddress
      };

      const order = this.orderService.createOrder(
        shippingAddress,
        paymentDetails,
        this.cart.items,
        this.cart.totalPrice,
        this.shippingCost,
        this.getTaxAmount()
      );

      this.cartService.clearCart();
      this.router.navigate(['/client/order-confirmation', order.id]);
    }
  }

  cancelCheckout(): void {
    this.router.navigate(['/client/cart']);
  }


}
