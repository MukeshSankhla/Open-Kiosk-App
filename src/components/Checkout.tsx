import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Receipt, QrCode, Printer, Check, CreditCard, Wifi } from "lucide-react";
import { CartItem } from "@/types/product";
import { useCurrentCurrency } from "@/hooks/useSettings";
import { useStoreSettings } from "@/hooks/useStoreSettings";
import { useFirebaseProducts } from "@/hooks/useFirebaseProducts";
import { esp32Printer } from "@/services/esp32PrinterService";
import { useToast } from "@/hooks/use-toast";
import { useFirebaseReports } from "@/hooks/useFirebaseReports";
import UartPortSelector from "./UartPortSelector";
import { pdfReceiptService } from "@/services/pdfReceiptService";

interface CheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (item: CartItem, quantity: number) => void;
  onClearCart: () => void;
  onComplete: () => void;
}

const Checkout = ({ isOpen, onClose, cartItems, onUpdateQuantity, onClearCart, onComplete }: CheckoutProps) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentProcessed, setPaymentProcessed] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const currentCurrency = useCurrentCurrency();
  const { settings } = useStoreSettings();
  const { toast } = useToast();
  const { recordSale, generateOrderNumber } = useFirebaseReports();
  const { updateProduct } = useFirebaseProducts();

  // Generate order number when component mounts and keep it consistent
  useEffect(() => {
    if (isOpen && !orderNumber) {
      const fetchOrderNumber = async () => {
        try {
          const newOrderNumber = await generateOrderNumber();
          setOrderNumber(newOrderNumber);
        } catch (error) {
          console.error('Error generating order number:', error);
          // Fallback to timestamp-based order number
          const now = new Date();
          const year = now.getFullYear().toString().slice(-2);
          const month = (now.getMonth() + 1).toString().padStart(2, '0');
          const day = now.getDate().toString().padStart(2, '0');
          const hour = now.getHours().toString().padStart(2, '0');
          const minute = now.getMinutes().toString().padStart(2, '0');
          const second = now.getSeconds().toString().padStart(2, '0');
          setOrderNumber(`${year}${month}${day}${hour}${minute}${second}`);
        }
      };
      
      fetchOrderNumber();
    }
  }, [isOpen, orderNumber, generateOrderNumber]);

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTaxAmount = () => {
    return getTotalPrice() * (settings?.taxPercentage || 0) / 100;
  };

  const getFinalTotal = () => {
    return getTotalPrice() + getTaxAmount();
  };

  const handleProceedToPayment = () => {
    setShowPayment(true);
  };

  const handlePaymentComplete = async () => {
    setPaymentProcessed(true);
    
    try {
      // Record the sale first
      await recordSale(cartItems, getFinalTotal(), currentCurrency.code, orderNumber);
      console.log('Sale recorded with order number:', orderNumber);

      // Update stock for each item in the cart
      for (const item of cartItems) {
        const newStock = Math.max(0, (item.product.stock || 0) - item.quantity);
        await updateProduct(item.product.id, {
          ...item.product,
          stock: newStock,
          inStock: newStock > 0
        });
        console.log(`Updated stock for ${item.product.title}: ${newStock}`);
      }

    } catch (error) {
      console.error('Error processing order:', error);
      toast({
        title: "Error",
        description: "Failed to process order",
        variant: "destructive"
      });
      return;
    }

    // Clear the cart immediately after successful payment and stock update
    onClearCart();
    
    // Show completion screen
    setTimeout(() => {
      setIsCompleted(true);
    }, 1000);

    // Print receipt based on printer type setting
    if (settings?.useThermalPrinter && settings?.comPort) {
      await handleESP32Print();
    } else if (!settings?.useThermalPrinter) {
      await handlePDFPrint();
    }
  };

  const handleESP32Print = async () => {
    if (!settings?.comPort) {
      toast({
        title: "No COM Port Configured",
        description: "COM port is not set in settings. Configure in Admin > Settings.",
        variant: "destructive"
      });
      return;
    }
    setIsPrinting(true);
    try {
      const result = await esp32Printer.printReceipt(cartItems, settings, orderNumber);
      if (result.success) {
        toast({
          title: "Success",
          description: "Receipt printed successfully!",
        });
      } else {
        toast({
          title: "Print Error",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Print error:', error);
      toast({ title: "Print Error", description: "Failed to print receipt.", variant: "destructive" });
    } finally {
      setIsPrinting(false);
    }
  };

  const handlePDFPrint = async () => {
    setIsPrinting(true);
    try {
      pdfReceiptService.generateReceiptPDF(cartItems, settings!, orderNumber);
      toast({
        title: "Success",
        description: "PDF receipt generated successfully!",
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast({ 
        title: "PDF Error", 
        description: "Failed to generate PDF receipt.", 
        variant: "destructive" 
      });
    } finally {
      setIsPrinting(false);
    }
  };

  const resetCheckout = () => {
    setIsCompleted(false);
    setShowPayment(false);
    setPaymentProcessed(false);
    setOrderNumber("");
  };

  const handleClose = () => {
    onClose();
    resetCheckout();
  };

  useEffect(() => {
    if (!isOpen) {
      resetCheckout();
    }
  }, [isOpen]);

  if (isCompleted) {
    return (
      <Sheet open={isOpen} onOpenChange={handleClose}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              Order Completed
            </SheetTitle>
          </SheetHeader>

          <div className="flex flex-col h-full justify-center items-center text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Thank you for your purchase!</h3>
              <p className="text-gray-600">Order #{orderNumber} has been completed successfully.</p>
            </div>

            <div className="space-y-3 w-full">
              <Button onClick={() => { onComplete(); resetCheckout(); }} className="w-full">
                Start New Order
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleClose} className="p-0 h-auto">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <Receipt className="w-5 h-5" />
            {showPayment ? 'Payment' : 'Checkout'}
          </SheetTitle>
        </SheetHeader>

        {/* Allow this area to scroll if content is long */}
        <div className="flex-1 py-6 space-y-6 overflow-y-auto min-h-0">
          {/* Order Summary */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-4">Order Summary</h3>
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span>{item.product.title} x{item.quantity}</span>
                    <span>{currentCurrency.symbol}{(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({getTotalItems()} items)</span>
                    <span>{currentCurrency.symbol}{getTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax ({settings?.taxPercentage || 0}%)</span>
                    <span>{currentCurrency.symbol}{getTaxAmount().toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>{currentCurrency.symbol}{getFinalTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Section - Only show when payment is initiated */}
          {showPayment && (
            <>
              <Card>
                <CardContent className="p-4 text-center">
                  <h3 className="font-medium mb-4">Payment</h3>
                  <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <div className="text-center">
                      <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                      <p className="text-xs text-gray-500">QR Code for Payment</p>
                      <p className="text-xs text-gray-500 mt-1">{currentCurrency.symbol}{getFinalTotal().toFixed(2)}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Scan this QR code with your payment app to complete the transaction
                  </p>
                  {paymentProcessed && (
                    <div className="mt-4 p-3 bg-green-100 rounded-lg">
                      <p className="text-green-800 text-sm">Payment processing...</p>
                    </div>
                  )}
                  {settings?.comPort &&
                    <Button
                      className="w-full mt-6"
                      variant="outline"
                      onClick={handleESP32Print}
                      disabled={isPrinting}
                    >
                      <Printer className="w-4 h-4 mr-2" />
                      {isPrinting ? "Printing..." : `Print to ${settings.comPort}`}
                    </Button>
                  }
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-2">Order Details</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Order #: {orderNumber}</p>
                    <p>Date: {new Date().toLocaleDateString()}</p>
                    <p>Time: {new Date().toLocaleTimeString()}</p>
                    {settings?.useThermalPrinter && settings?.comPort && (
                      <p>Thermal Printer: {settings.comPort}</p>
                    )}
                    {!settings?.useThermalPrinter && (
                      <p>Print Mode: PDF Receipt</p>
                    )}
                  </div>
                  
                  {/* Print button based on printer type */}
                  {settings?.useThermalPrinter && settings?.comPort ? (
                    <Button
                      className="w-full mt-4"
                      variant="outline"
                      onClick={handleESP32Print}
                      disabled={isPrinting}
                    >
                      <Printer className="w-4 h-4 mr-2" />
                      {isPrinting ? "Printing..." : `Print to ${settings.comPort}`}
                    </Button>
                  ) : (
                    <Button
                      className="w-full mt-4"
                      variant="outline"
                      onClick={handlePDFPrint}
                      disabled={isPrinting}
                    >
                      <Printer className="w-4 h-4 mr-2" />
                      {isPrinting ? "Generating..." : "Generate PDF Receipt"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Action Buttons always pinned to bottom */}
        <div className="border-t pt-4 space-y-3">
          {!showPayment ? (
            <Button onClick={handleProceedToPayment} className="w-full" size="lg">
              <CreditCard className="w-4 h-4 mr-2" />
              Proceed to Payment
            </Button>
          ) : (
            <Button 
              onClick={handlePaymentComplete} 
              className="w-full" 
              size="lg"
              disabled={paymentProcessed}
            >
              <Check className="w-4 h-4 mr-2" />
              {paymentProcessed ? 'Processing...' : 'Complete Payment'}
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Checkout;
