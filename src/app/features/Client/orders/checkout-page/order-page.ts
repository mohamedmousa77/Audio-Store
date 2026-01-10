import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Cart } from '../../../../core/models/cart';
import { CartServices } from '../../../../core/services/cart/cart-services';
import { OrderServices } from '../../../../core/services/order/order-services';
import { ShippingAddress } from '../../../../core/models/order';
import { ClientHeader } from "../../layout/client-header/client-header";

@Component({
  selector: 'app-order-page',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ClientHeader],
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
  
  currentStep: 'shipping' | 'payment' | 'review' = 'shipping';
  shippingCost = 5.99;
  taxRate = 0.10;

  isProcessing: boolean = false;
  errorMessage: string = '';

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
  }

  getTaxAmount(): number {
    return this.cart.totalPrice * this.taxRate;
  }

  getTotalAmount(): number {
    return this.cart.totalPrice + this.shippingCost + this.getTaxAmount();
  }


  // goToReview(): void {
  //   if (this.paymentForm.valid) {
  //     this.currentStep = 'review';
  //   }
  // }

  goBackToShipping(): void {
    this.currentStep = 'shipping';
  }

  goBackToPayment(): void {
    this.currentStep = 'payment';
  }

  placeOrder(): void {
    console.log("Placing order...");
    this.shippingForm.valid
    if (!this.shippingForm.valid ) {
       this.errorMessage = 'Per favore completa tutti i campi obbligatori';
      return;
    }
      // Imposta il flag di processing
      this.isProcessing = true;
      this.errorMessage = '';

      try {
const shippingData = this.shippingForm.value;

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

      // Calcola gli importi
      const subtotal = this.cart.totalPrice;
      const shipping = this.shippingCost;
      const tax = this.getTaxAmount();

      // 
      const order = this.orderService.createOrder(
        shippingAddress,
        this.cart.items,
        subtotal,
        shipping,
        tax
      );
      console.log('✅ Ordine creato con successo:', order);

      // Reindirizza alla pagina di conferma con l'ID dell'ordine
      this.isProcessing = false;
      this.errorMessage = '';
      
      this.cartService.clearCart();
      this.router.navigate(['/client/order-confirmation', order.id]);
    } catch (error) {
      console.error('❌ Errore nella creazione dell\'ordine:', error);
      // this.errorMessage = 'Si è verificato un errore durante la creazione dell\'ordine. Per favore riprova.';
      this.errorMessage = 'An error occured while creating the order. Please try again.'
      this.isProcessing = false;
    }
      
    
  }

  cancelCheckout(): void {
    this.router.navigate(['/client/cart']);
  }


}
