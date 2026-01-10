import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderServices } from '../../../../core/services/order/order-services';
import { Order } from '../../../../core/models/order';
import { ClientHeader } from '../../layout/client-header/client-header';
import { ClientFooter } from '../../layout/client-footer/client-footer';
import { Subject, takeUntil } from 'rxjs';
import { jsPDF } from 'jspdf';
@Component({
  selector: 'app-order-confirmation-page',
  imports: [CommonModule, ClientHeader, ClientFooter],
  templateUrl: './order-confirmation-page.html',
  styleUrl: './order-confirmation-page.css',
})
export class OrderConfirmationPage implements OnInit, OnDestroy {
  order: Order | null | undefined= null;
  orderId: string = '';
  loading: boolean = true;
  error: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderServices
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe((params: any) => {
        this.orderId = params['id'] ?? '';
        console.log('Order ID from URL:', this.orderId);

        if (this.orderId) {
          this.loadOrder();
        } else {
          this.loading = false;
          this.error = true;
          console.warn('No Order ID provided in URL');
        }
      });
  }

    ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

private loadOrder(): void {
    this.loading = true;
    this.error = false;
    console.log('Starting order load for ID:', this.orderId);

    this.orderService
      .getOrderById(this.orderId)
      // .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (orderData: Order | null | undefined) => {
          console.log('Order data received from service:', orderData);

          // Verifica che orderData non sia null/undefined e abbia items
          if (
            orderData &&
            orderData.items &&
            Array.isArray(orderData.items) &&
            orderData.items.length > 0
          ) {
            console.log('✓ Order successfully loaded');
            console.log('✓ Items count:', orderData.items.length);
            console.log('✓ Order items:', orderData.items);

            this.order = orderData;
            this.loading = false;
            this.error = false;
          } else {
            console.warn(
              '⚠ Order data is missing items or is incomplete',
              orderData
            );
            this.loading = false;
            this.error = true;
          }
        },
        error: (err: any) => {
          console.error('✗ Error loading order:', err);
          console.error('Error details:', {
            message: err?.message || 'Unknown error',
            status: err?.status || 'Unknown status',
            statusText: err?.statusText || 'Unknown',
          });
          this.loading = false;
          this.error = true;
        },
      });
  }


  /**
   * Calcola l'importo totale
   */
  getTotalAmount(): number {
    if (!this.order) return 0;
    const subtotal = this.order.subtotal || 0;
    const shipping = this.order.shipping || 0;
    const tax = this.order.tax || 0;
    return subtotal + shipping + tax;  
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
//   downloadInvoice(): void {
//     if (!this.order) return;

//     const invoiceContent = `
// =====================================
// INVOICE - FATTURA
// =====================================
// Order Number: ${this.order.orderNumber}
// Date: ${this.order.date ? new Date(this.order.date).toLocaleDateString('it-IT') : 'N/A'}
// Time: ${this.order.time || 'N/A'}

// =====================================
// CUSTOMER INFORMATION
// =====================================
// Name: ${this.order.customerName || 'N/A'}
// Email: ${this.order.customerEmail || 'N/A'}

// =====================================
// SHIPPING ADDRESS
// =====================================
// ${this.order.shippingAddress?.firstName} ${this.order.shippingAddress?.lastName}
// ${this.order.shippingAddress?.address}
// ${this.order.shippingAddress?.zipCode} ${this.order.shippingAddress?.city}
// ${this.order.shippingAddress?.country}
// Phone: ${this.order.shippingAddress?.phone}

// =====================================
// ORDER ITEMS
// =====================================
// ${this.order.items?.map(item => 
//   `${item.name} (x${item.quantity}) - €${(item.price * item.quantity).toFixed(2)}`
// ).join('\n')}

// =====================================
// PAYMENT SUMMARY
// =====================================
// Subtotal:     €${(this.order.subtotal || 0).toFixed(2)}
// Shipping:     €${(this.order.shipping || 0).toFixed(2)}
// Tax (10%):    €${(this.order.tax || 0).toFixed(2)}
// ───────────────────────────────────
// TOTAL:        €${this.getTotalAmount().toFixed(2)}

// =====================================
// TRACKING INFORMATION
// =====================================
// Tracking Number: ${this.order.trackingNumber || 'N/A'}
// Status: ${this.order.status?.toUpperCase() || 'N/A'}
// Estimated Delivery: ${this.order.estimatedDelivery ? new Date(this.order.estimatedDelivery).toLocaleDateString('it-IT') : 'N/A'}

// =====================================
// NOTES
// =====================================
// ${'No notes'}

// =====================================
// Thank you for your order!
// =====================================
//     `;

//     const element = document.createElement('a');
//     element.setAttribute(
//       'href',
//       'data:text/plain;charset=utf-8,' + encodeURIComponent(invoiceContent)
//     );
//     element.setAttribute('download', `Invoice_${this.order.orderNumber}.txt`);
//     element.style.display = 'none';
//     document.body.appendChild(element);
//     element.click();
//     document.body.removeChild(element);
//   }

  downloadInvoice(): void {
    if (!this.order) {
      console.warn('Cannot download invoice: order is null');
      return;
    }

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let yPosition = 15;
      const margin = 15;
      const maxWidth = pageWidth - 2 * margin;

      // Helper functions
      const addTitle = (text: string, fontSize: number = 16) => {
        doc.setFontSize(fontSize);
        doc.setFont('', 'bold');
        doc.text(text, margin, yPosition);
        yPosition += 8;
      };

      const addText = (text: string, fontSize: number = 10) => {
        doc.setFontSize(fontSize);
        doc.setFont('', 'normal');
        doc.text(text, margin, yPosition);
        yPosition += 6;
      };

      const addSection = (title: string) => {
        yPosition += 3;
        addTitle(title, 12);
        doc.setDrawColor(180, 180, 180);
        doc.line(margin, yPosition - 1, pageWidth - margin, yPosition - 1);
        yPosition += 2;
      };

      // Header
      addTitle('INVOICE - FATTURA', 18);
      yPosition += 3;

      // Order Info
      addText(`Order Number: ${this.order.orderNumber}`);
      addText(`Date: ${this.order.date ? new Date(this.order.date).toLocaleDateString('it-IT') : 'N/A'}`);
      yPosition += 5;

      // Customer Info Section
      addSection('CUSTOMER INFORMATION');
      addText(`Name: ${this.order.customerName ?? 'N/A'}`);
      addText(`Email: ${this.order.customerEmail ?? 'N/A'}`);
      yPosition += 5;

      // Shipping Address Section
      addSection('SHIPPING ADDRESS');
      addText(`${this.order.shippingAddress?.firstName ?? 'N/A'} ${this.order.shippingAddress?.lastName ?? 'N/A'}`);
      addText(`${this.order.shippingAddress?.address ?? 'N/A'}`);
      addText(`${this.order.shippingAddress?.zipCode ?? ''} ${this.order.shippingAddress?.city ?? ''}`);
      addText(`${this.order.shippingAddress?.country ?? 'N/A'}`);
      addText(`Phone: ${this.order.shippingAddress?.phone ?? 'N/A'}`);
      yPosition += 5;

      // Order Items Section
      addSection('ORDER ITEMS');
      doc.setFontSize(9);
      doc.setFont('', 'bold');
      doc.text('Product', margin, yPosition);
      doc.text('Qty', margin + 100, yPosition);
      doc.text('Price', margin + 120, yPosition);
      doc.text('Total', margin + 150, yPosition);
      yPosition += 6;

      doc.setFont('', 'normal');
      if (this.order.items) {
        this.order.items.forEach((item) => {
          const itemTotal = (item.price ?? 0) * item.quantity;
          doc.text(`${item.name} (${item.category})`, margin, yPosition, { maxWidth: 95 });
          doc.text(item.quantity.toString(), margin + 100, yPosition);
          doc.text(`€${(item.price ?? 0).toFixed(2)}`, margin + 120, yPosition);
          doc.text(`€${itemTotal.toFixed(2)}`, margin + 150, yPosition);
          yPosition += 6;
        });
      }
      yPosition += 5;

      // Payment Summary Section
      addSection('PAYMENT SUMMARY');
      doc.setFontSize(10);
      doc.setFont('', 'normal');
      
      const summaryX = pageWidth - margin - 50;
      doc.text(`Subtotal:`, summaryX - 40, yPosition);
      doc.text(`€${(this.order.subtotal ?? 0).toFixed(2)}`, pageWidth - margin - 10, yPosition, { align: 'right' });
      yPosition += 6;

      doc.text(`Shipping:`, summaryX - 40, yPosition);
      doc.text(`€${(this.order.shipping ?? 0).toFixed(2)}`, pageWidth - margin - 10, yPosition, { align: 'right' });
      yPosition += 6;

      doc.text(`Tax (Est.):`, summaryX - 40, yPosition);
      doc.text(`€${(this.order.tax ?? 0).toFixed(2)}`, pageWidth - margin - 10, yPosition, { align: 'right' });
      yPosition += 6;

      doc.setDrawColor(180, 180, 180);
      doc.line(summaryX - 40, yPosition, pageWidth - margin, yPosition);
      yPosition += 6;

      doc.setFont('', 'bold');
      doc.setFontSize(12);
      doc.text(`TOTAL:`, summaryX - 40, yPosition);
      doc.text(`€${this.getTotalAmount().toFixed(2)}`, pageWidth - margin - 10, yPosition, { align: 'right' });
      yPosition += 8;

      // Tracking Information Section
      if (yPosition > pageHeight - 40) {
        doc.addPage();
        yPosition = 15;
      }
      addSection('TRACKING INFORMATION');
      addText(`Tracking Number: ${this.order.trackingNumber ?? 'N/A'}`);
      addText(`Status: ${this.order.status?.toUpperCase() ?? 'N/A'}`);
      addText(`Estimated Delivery: ${
        this.order.estimatedDelivery
          ? new Date(this.order.estimatedDelivery).toLocaleDateString('it-IT')
          : 'N/A'
      }`);
      yPosition += 5;

      // Payment Method
      addSection('PAYMENT METHOD');
      addText('Cash on Delivery');
      yPosition += 8;

      // Footer
      doc.setFontSize(9);
      doc.setFont('', 'italic');
      doc.text('Thank you for your order! We appreciate your business.', pageWidth / 2, pageHeight - 20, { align: 'center' });
      doc.text('For support: support@audiostore.com', pageWidth / 2, pageHeight - 15, { align: 'center' });

      // Save PDF
      doc.save(`Invoice-${this.order.orderNumber}.pdf`);
      console.log('✓ Invoice (PDF) downloaded successfully');
    } catch (error) {
      console.error('✗ Error downloading invoice:', error);
      alert('Errore nel download della fattura. Riprova.');
    }
  }


}
