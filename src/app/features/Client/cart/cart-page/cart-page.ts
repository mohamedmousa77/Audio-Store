import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartServices } from '../../../../core/services/cart/cart-services';
import { Cart } from '../../../../core/models/cart';
import { ClientHeader } from '../../layout/client-header/client-header';
import { ClientFooter } from '../../layout/client-footer/client-footer';
@Component({
  selector: 'app-cart-page',
  imports: [CommonModule, FormsModule, ClientHeader, ClientFooter],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.css',
})
export class CartPage implements OnInit {
  cart: Cart = {
    items: [],
    totalItems: 0,
    totalPrice: 0
  };

  constructor(
    private cartService: CartServices,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Scroll to top when cart page loads
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    this.cartService.getCart().subscribe(cart => {
      this.cart = cart;
    });
  }

  updateQuantity(itemId: string, newQuantity: number): void {
    this.cartService.updateQuantity(itemId, newQuantity);
  }

  removeItem(itemId: string): void {
    this.cartService.removeFromCart(itemId);
  }

  continueShopping(): void {
    this.router.navigate(['/client/home']);
  }

  proceedToCheckout(): void {
    if (this.cart.items.length > 0) {
      this.router.navigate(['/client/checkout']);
    }
  }

  

}
