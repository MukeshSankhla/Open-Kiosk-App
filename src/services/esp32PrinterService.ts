
import { CartItem } from '@/types/product';
import { StoreSettings } from '@/types/store';

interface PrinterResponse {
  success: boolean;
  message: string;
}

export class ESP32PrinterService {
  private port: SerialPort | null = null;
  private writer: WritableStreamDefaultWriter<Uint8Array> | null = null;
  private reader: ReadableStreamDefaultReader<Uint8Array> | null = null;

  async connectToComPort(comPortName: string): Promise<boolean> {
    try {
      // Check if Web Serial API is supported
      if (!('serial' in navigator)) {
        throw new Error('Web Serial API not supported in this browser');
      }

      // Get all available ports
      const ports = await navigator.serial.getPorts();
      
      // Try to find a port that matches or request a new one
      let targetPort = null;
      
      // If we have existing ports, try to connect to them
      for (const port of ports) {
        try {
          if (!port.readable) {
            await port.open({ baudRate: 9600 });
          }
          targetPort = port;
          break;
        } catch (error) {
          console.log('Failed to connect to existing port, trying next...');
          continue;
        }
      }
      
      // If no existing port worked, request a new one
      if (!targetPort) {
        targetPort = await navigator.serial.requestPort();
        await targetPort.open({ baudRate: 9600 });
      }
      
      this.port = targetPort;
      
      // Set up reader and writer
      this.writer = this.port.writable?.getWriter() || null;
      this.reader = this.port.readable?.getReader() || null;
      
      console.log(`ESP32 printer connected successfully to ${comPortName}`);
      return true;
    } catch (error) {
      console.error(`Failed to connect to COM port ${comPortName}:`, error);
      return false;
    }
  }

  async disconnect(): Promise<void> {
    try {
      if (this.reader) {
        await this.reader.cancel();
        this.reader.releaseLock();
        this.reader = null;
      }
      
      if (this.writer) {
        await this.writer.close();
        this.writer = null;
      }
      
      if (this.port) {
        await this.port.close();
        this.port = null;
      }
      
      console.log('ESP32 printer disconnected');
    } catch (error) {
      console.error('Error disconnecting from ESP32 printer:', error);
    }
  }

  isConnected(): boolean {
    return this.port !== null && this.writer !== null && this.reader !== null;
  }

  generatePrintData(cartItems: CartItem[], settings: StoreSettings, orderNumber: string) {
    const currentDate = new Date().toLocaleDateString('en-GB');
    const currentTime = new Date().toLocaleTimeString('en-US', { 
      hour12: true, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    const total = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    
    return {
      store: {
        name: settings.name,
        gst: settings.taxId
      },
      receipt: {
        bill_no: orderNumber,
        date: currentDate,
        time: currentTime
      },
      items: cartItems.map(item => ({
        name: item.product.title,
        quantity: `${item.quantity}`,
        price: item.product.price * item.quantity
      })),
      total: Math.round(total * (1 + settings.taxPercentage / 100)),
      footer: "Thank you! Visit Again!"
    };
  }

  async sendPrintData(printData: any): Promise<PrinterResponse> {
    try {
      if (!this.writer) {
        throw new Error('ESP32 printer not connected');
      }
      const jsonString = JSON.stringify(printData);
      const data = new TextEncoder().encode(jsonString + '\n');
      await this.writer.write(data);
      return { success: true, message: 'Print sent successfully.' };
    } catch (error) {
      console.error('Error sending print data:', error);
      return { success: false, message: error instanceof Error ? error.message : 'Unknown print error' };
    }
  }

  async printReceipt(cartItems: CartItem[], settings: StoreSettings, orderNumber: string): Promise<PrinterResponse> {
    try {
      // If not connected and we have a COM port setting, try to connect
      if (!this.isConnected() && settings.comPort) {
        const connected = await this.connectToComPort(settings.comPort);
        if (!connected) {
          throw new Error(`Failed to connect to COM port ${settings.comPort}`);
        }
      } else if (!this.isConnected()) {
        throw new Error('No COM port configured in settings');
      }
      
      const printData = this.generatePrintData(cartItems, settings, orderNumber);
      return await this.sendPrintData(printData);
    } catch (error) {
      console.error('Print failed:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }
}

// Create a singleton instance
export const esp32Printer = new ESP32PrinterService();
