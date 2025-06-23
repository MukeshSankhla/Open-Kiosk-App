
import { CartItem } from '@/types/product';
import { StoreSettings } from '@/types/store';

export class PDFReceiptService {
  generateReceiptPDF(cartItems: CartItem[], settings: StoreSettings, orderNumber: string): void {
    const currentDate = new Date().toLocaleDateString('en-GB');
    const currentTime = new Date().toLocaleTimeString('en-US', { 
      hour12: true, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    const total = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const taxAmount = total * (settings.taxPercentage / 100);
    const finalTotal = total + taxAmount;

    // Create a new window for the receipt
    const printWindow = window.open('', '_blank', 'width=400,height=600');
    
    if (!printWindow) {
      throw new Error('Could not open print window. Please allow popups.');
    }

    const receiptHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Receipt - ${orderNumber}</title>
        <style>
          body {
            font-family: 'Courier New', monospace;
            font-size: 12px;
            line-height: 1.4;
            margin: 20px;
            max-width: 300px;
          }
          .header {
            text-align: center;
            border-bottom: 1px dashed #000;
            padding-bottom: 10px;
            margin-bottom: 10px;
          }
          .store-name {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          .receipt-info {
            margin-bottom: 10px;
            border-bottom: 1px dashed #000;
            padding-bottom: 10px;
          }
          .items {
            margin-bottom: 10px;
          }
          .item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 3px;
          }
          .item-name {
            flex: 1;
          }
          .item-qty {
            margin: 0 10px;
          }
          .item-price {
            min-width: 60px;
            text-align: right;
          }
          .totals {
            border-top: 1px dashed #000;
            padding-top: 10px;
            margin-top: 10px;
          }
          .total-line {
            display: flex;
            justify-content: space-between;
            margin-bottom: 3px;
          }
          .final-total {
            font-weight: bold;
            border-top: 1px solid #000;
            padding-top: 5px;
            margin-top: 5px;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            padding-top: 10px;
            border-top: 1px dashed #000;
          }
          @media print {
            body { margin: 0; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="store-name">${settings.name}</div>
          ${settings.taxId ? `<div>GST: ${settings.taxId}</div>` : ''}
        </div>
        
        <div class="receipt-info">
          <div>Bill No: ${orderNumber}</div>
          <div>Date: ${currentDate}</div>
          <div>Time: ${currentTime}</div>
        </div>
        
        <div class="items">
          ${cartItems.map(item => `
            <div class="item">
              <span class="item-name">${item.product.title}</span>
              <span class="item-qty">x${item.quantity}</span>
              <span class="item-price">${settings.currency} ${(item.product.price * item.quantity).toFixed(2)}</span>
            </div>
          `).join('')}
        </div>
        
        <div class="totals">
          <div class="total-line">
            <span>Subtotal:</span>
            <span>${settings.currency} ${total.toFixed(2)}</span>
          </div>
          <div class="total-line">
            <span>Tax (${settings.taxPercentage}%):</span>
            <span>${settings.currency} ${taxAmount.toFixed(2)}</span>
          </div>
          <div class="total-line final-total">
            <span>Total:</span>
            <span>${settings.currency} ${finalTotal.toFixed(2)}</span>
          </div>
        </div>
        
        <div class="footer">
          Thank you! Visit Again!
        </div>
        
        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(receiptHTML);
    printWindow.document.close();
  }
}

export const pdfReceiptService = new PDFReceiptService();
