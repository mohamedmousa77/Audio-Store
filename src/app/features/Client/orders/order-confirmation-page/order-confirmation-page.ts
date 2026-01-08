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
  error: boolean = false;


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
    // Simula il delay di caricamento
    console.log('Loading order' + this.orderId);
    setTimeout(() => {
      this.orderService.getOrderById$(this.orderId).subscribe(
        order => {
          if (order) {
            this.order = order;
            this.loading = false;
            this.error = false;
          } else {
            this.loading = false;
            this.error = true;
          }
        },
        error => {
          console.error('Errore nel caricamento dell\'ordine:', error);
          this.loading = false;
          this.error = true;
        }
      );
    }, 1500);
  }

  /**
   * Calcola l'importo totale
   */
  getTotalAmount(): number {
    if (!this.order) return 0;
    return (this.order.subtotal || 0) + (this.order.shipping || 0) + (this.order.tax || 0);
  }


  getTaxAmount(): number {
    return this.order?.tax || 0;
  }

  continueShopping(): void {
    this.router.navigate(['/client/home']);
  }

  viewOrders(): void {
    this.router.navigate(['/client/orders']);
  }

  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': 'status-pending',
      'confirmed': 'status-confirmed',
      'shipped': 'status-shipped',
      'delivered': 'status-delivered',
      'canceled': 'status-canceled'
    };
    return statusMap[status] || 'status-pending';
  }

  /**
   * Ottiene il testo dello status in italiano
   */
  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': 'In Sospeso',
      'confirmed': 'Confermato',
      'shipped': 'Spedito',
      'delivered': 'Consegnato',
      'canceled': 'Annullato'
    };
    return statusMap[status] || 'Sconosciuto';
  }


  
  /**
   * Download dell'invoice
   */
  downloadInvoice(): void {
    if (!this.order) return;

    const invoiceContent = `
=====================================
INVOICE - FATTURA
=====================================
Order Number: ${this.order.orderNumber}
Date: ${this.order.date ? new Date(this.order.date).toLocaleDateString('it-IT') : 'N/A'}
Time: ${this.order.time || 'N/A'}

=====================================
CUSTOMER INFORMATION
=====================================
Name: ${this.order.customerName || 'N/A'}
Email: ${this.order.customerEmail || 'N/A'}

=====================================
SHIPPING ADDRESS
=====================================
${this.order.shippingAddress?.firstName} ${this.order.shippingAddress?.lastName}
${this.order.shippingAddress?.address}
${this.order.shippingAddress?.zipCode} ${this.order.shippingAddress?.city}
${this.order.shippingAddress?.country}
Phone: ${this.order.shippingAddress?.phone}

=====================================
ORDER ITEMS
=====================================
${this.order.items?.map(item => 
  `${item.name} (x${item.quantity}) - €${(item.price * item.quantity).toFixed(2)}`
).join('\n')}

=====================================
PAYMENT SUMMARY
=====================================
Subtotal:     €${(this.order.subtotal || 0).toFixed(2)}
Shipping:     €${(this.order.shipping || 0).toFixed(2)}
Tax (10%):    €${(this.order.tax || 0).toFixed(2)}
───────────────────────────────────
TOTAL:        €${this.getTotalAmount().toFixed(2)}

=====================================
TRACKING INFORMATION
=====================================
Tracking Number: ${this.order.trackingNumber || 'N/A'}
Status: ${this.order.status?.toUpperCase() || 'N/A'}
Estimated Delivery: ${this.order.estimatedDelivery ? new Date(this.order.estimatedDelivery).toLocaleDateString('it-IT') : 'N/A'}

=====================================
NOTES
=====================================
${'No notes'}

=====================================
Thank you for your order!
=====================================
    `;

    const element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(invoiceContent)
    );
    element.setAttribute('download', `Invoice_${this.order.orderNumber}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

}
