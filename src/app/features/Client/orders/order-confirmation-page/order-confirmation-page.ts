import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderServices } from '../../../../core/services/order/order-services';
import { Order, OrderStatus } from '../../../../core/models/order';
import { ClientHeader } from '../../layout/client-header/client-header';
import { ClientFooter } from '../../layout/client-footer/client-footer';
import { jsPDF } from 'jspdf';
import { TranslationService } from '../../../../core/services/translation/translation.service';

/**
 * Order Confirmation Page Component
 * Updated to use Signals and order number (string) instead of ID
 * 
 * Breaking Changes:
 * - Uses order number (string) from URL, not ID
 * - Uses Signals from OrderServices
 * - OrderStatus is enum (not string)
 */
@Component({
  selector: 'app-order-confirmation-page',
  imports: [CommonModule, ClientHeader, ClientFooter],
  templateUrl: './order-confirmation-page.html',
  styleUrl: './order-confirmation-page.css',
})
export class OrderConfirmationPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private orderService = inject(OrderServices);
  private translationService = inject(TranslationService);

  // Translations
  translations = this.translationService.translations;

  // State
  order = signal<Order | null>(null);
  orderNumber = signal<string>('');
  loading = signal<boolean>(true);
  error = signal<boolean>(false);

  // Expose OrderStatus enum to template
  OrderStatus = OrderStatus;

  ngOnInit(): void {
    // Get order number from URL params
    const orderNumberParam = this.route.snapshot.paramMap.get('id');

    if (orderNumberParam) {
      this.orderNumber.set(orderNumberParam);
      this.loadOrder(orderNumberParam);
    } else {
      console.warn('No order number provided in URL');
      this.loading.set(false);
      this.error.set(true);
    }
  }

  /**
   * Load order by order number
   * @param orderNumber Order number (e.g., "ORD-2024-001")
   */
  async loadOrder(orderNumber: string): Promise<void> {
    this.loading.set(true);
    this.error.set(false);

    console.log('Loading order:', orderNumber);

    try {
      const orderData = await this.orderService.getOrderByNumber(orderNumber);

      // 🔍 DEBUG: Log the full order data
      console.log('📦 Full order data received:', orderData);
      console.log('💰 Financial details:', {
        subtotal: orderData?.subtotal,
        shippingCost: orderData?.shippingCost,
        tax: orderData?.tax,
        totalAmount: orderData?.totalAmount
      });

      if (orderData && orderData.items && orderData.items.length > 0) {
        console.log('✅ Order loaded successfully:', orderData);
        this.order.set(orderData);
      } else {
        console.warn('⚠️ Order data is incomplete or missing items');
        this.error.set(true);
      }
    } catch (err) {
      console.error('❌ Error loading order:', err);
      this.error.set(true);
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Calculate total amount
   */
  getTotalAmount(): number {
    const currentOrder = this.order();
    if (!currentOrder) return 0;

    return (currentOrder.subtotal || 0) +
      (currentOrder.shippingCost || 0) +
      (currentOrder.tax || 0);
  }

  /**
   * Get tax amount
   */
  getTaxAmount(): number {
    return this.order()?.tax || 0;
  }

  /**
   * Navigate to home page
   */
  continueShopping(): void {
    this.router.navigate(['/client/home']);
  }

  /**
   * Navigate to orders page
   */
  viewOrders(): void {
    this.router.navigate(['/client/orders']);
  }

  /**
   * Get status CSS class
   */
  getStatusClass(status: OrderStatus): string {
    const statusMap: { [key: number]: string } = {
      [OrderStatus.Pending]: 'status-pending',
      [OrderStatus.Processing]: 'status-processing',
      [OrderStatus.Shipped]: 'status-shipped',
      [OrderStatus.Delivered]: 'status-delivered',
      [OrderStatus.Cancelled]: 'status-cancelled'
    };
    return statusMap[status] || 'status-pending';
  }

  /**
   * Get status text in Italian
   */
  getStatusText(status: OrderStatus): string {
    const statusMap: { [key: number]: string } = {
      [OrderStatus.Pending]: 'In Sospeso',
      [OrderStatus.Processing]: 'In Elaborazione',
      [OrderStatus.Shipped]: 'Spedito',
      [OrderStatus.Delivered]: 'Consegnato',
      [OrderStatus.Cancelled]: 'Annullato'
    };
    return statusMap[status] || 'Sconosciuto';
  }

  /**
   * Download invoice as PDF
   */
  downloadInvoice(): void {
    const currentOrder = this.order();
    if (!currentOrder) {
      console.warn('Cannot download invoice: order is null');
      return;
    }

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let yPosition = 15;
      const margin = 15;

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
      addText(`Order Number: ${currentOrder.orderNumber}`);
      addText(`Date: ${new Date(currentOrder.orderDate).toLocaleDateString('it-IT')}`);
      yPosition += 5;

      // Customer Info
      addSection('CUSTOMER INFORMATION');
      addText(`Name: ${currentOrder.customerFirstName} ${currentOrder.customerLastName}`);
      addText(`Email: ${currentOrder.customerEmail}`);
      addText(`Phone: ${currentOrder.customerPhone}`);
      yPosition += 5;

      // Shipping Address
      addSection('SHIPPING ADDRESS');
      addText(`${currentOrder.shippingStreet}`);
      addText(`${currentOrder.shippingPostalCode} ${currentOrder.shippingCity}`);
      addText(`${currentOrder.shippingCountry}`);
      yPosition += 5;

      // Order Items
      addSection('ORDER ITEMS');
      doc.setFontSize(9);
      doc.setFont('', 'bold');
      doc.text('Product', margin, yPosition);
      doc.text('Qty', margin + 100, yPosition);
      doc.text('Price', margin + 120, yPosition);
      doc.text('Total', margin + 150, yPosition);
      yPosition += 6;

      doc.setFont('', 'normal');
      currentOrder.items.forEach((item) => {
        const itemTotal = item.unitPrice * item.quantity;
        doc.text(`${item.productName}`, margin, yPosition, { maxWidth: 95 });
        doc.text(item.quantity.toString(), margin + 100, yPosition);
        doc.text(`€${item.unitPrice.toFixed(2)}`, margin + 120, yPosition);
        doc.text(`€${itemTotal.toFixed(2)}`, margin + 150, yPosition);
        yPosition += 6;
      });
      yPosition += 5;

      // Payment Summary
      addSection('PAYMENT SUMMARY');
      const summaryX = pageWidth - margin - 50;

      doc.setFontSize(10);
      doc.setFont('', 'normal');
      doc.text(`Subtotal:`, summaryX - 40, yPosition);
      doc.text(`€${currentOrder.subtotal.toFixed(2)}`, pageWidth - margin - 10, yPosition, { align: 'right' });
      yPosition += 6;

      doc.text(`Shipping:`, summaryX - 40, yPosition);
      doc.text(`€${currentOrder.shippingCost.toFixed(2)}`, pageWidth - margin - 10, yPosition, { align: 'right' });
      yPosition += 6;

      doc.text(`Tax:`, summaryX - 40, yPosition);
      doc.text(`€${currentOrder.tax.toFixed(2)}`, pageWidth - margin - 10, yPosition, { align: 'right' });
      yPosition += 6;

      doc.setDrawColor(180, 180, 180);
      doc.line(summaryX - 40, yPosition, pageWidth - margin, yPosition);
      yPosition += 6;

      doc.setFont('', 'bold');
      doc.setFontSize(12);
      doc.text(`TOTAL:`, summaryX - 40, yPosition);
      doc.text(`€${currentOrder.totalAmount.toFixed(2)}`, pageWidth - margin - 10, yPosition, { align: 'right' });
      yPosition += 8;

      // Payment Method
      addSection('PAYMENT METHOD');
      addText(`${currentOrder.paymentMethod || 'Cash on Delivery'}`);
      yPosition += 8;

      // Footer
      doc.setFontSize(9);
      doc.setFont('', 'italic');
      doc.text('Thank you for your order! We appreciate your business.', pageWidth / 2, pageHeight - 20, { align: 'center' });
      doc.text('For support: support@audiostore.com', pageWidth / 2, pageHeight - 15, { align: 'center' });

      // Save PDF
      doc.save(`Invoice-${currentOrder.orderNumber}.pdf`);
      console.log('✅ Invoice downloaded successfully');
    } catch (error) {
      console.error('❌ Error downloading invoice:', error);
      alert('Errore nel download della fattura. Riprova.');
    }
  }
}
