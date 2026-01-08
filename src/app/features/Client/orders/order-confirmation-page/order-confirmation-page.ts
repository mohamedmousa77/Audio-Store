import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderServices } from '../../../../core/services/order/order-services';
import { Order } from '../../../../core/models/order';


@Component({
  selector: 'app-order-confirmation-page',
  imports: [CommonModule],
  templateUrl: './order-confirmation-page.html',
  styleUrl: './order-confirmation-page.css',
})
export class OrderConfirmationPage implements OnInit {
  order: Order | null = null;
  orderId: string = '';
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderServices
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.orderId = params['id'];
      this.loadOrder();
    });
  }

  private loadOrder(): void {
    // Simulate loading delay
    setTimeout(() => {
      const order = this.orderService.getOrderById(this.orderId);
      if (order) {
        this.order = order;
        this.loading = false;
      } else {
        this.loading = false;
        // Redirect to home if order not found
        this.router.navigate(['/client/home']);
      }
    }, 1500);
  }

  getTaxAmount(): number {
    return this.order?.tax || 0;
  }

  getTotalAmount(): number {
    if (!this.order) return 0;
    return this.order.subtotal! + this.order.shipping! + this.order.tax!;
  }

  downloadInvoice(): void {
    if (!this.order) return;
    
    const invoiceContent = `
INVOICE
Order Number: ${this.order.orderNumber}
Date: ${new Date(this.order.date!).toLocaleDateString('it-IT')}

SHIPPING ADDRESS
${this.order.shippingAddress!.firstName} ${this.order.shippingAddress!.lastName}
${this.order.shippingAddress!.address}
${this.order.shippingAddress!.zipCode} ${this.order.shippingAddress!.city}
${this.order.shippingAddress!.country}

ITEMS ORDERED
${this.order.items!.map(item => `${item.name} (x${item.quantity}) - €${(item.price * item.quantity).toFixed(2)}`).join('\n')}

PAYMENT SUMMARY
Subtotal: €${this.order.subtotal!.toFixed(2)}
Shipping: €${this.order.shipping!.toFixed(2)}
Tax: €${this.order.tax!.toFixed(2)}
Total: €${this.getTotalAmount().toFixed(2)}

Thank you for your order!
    `;

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(invoiceContent));
    element.setAttribute('download', `Invoice_${this.order.orderNumber}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  continueShopping(): void {
    this.router.navigate(['/client/home']);
  }

  viewOrders(): void {
    this.router.navigate(['/client/orders']);
  }

}
