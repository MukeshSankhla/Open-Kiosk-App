import { useState } from 'react';
import { getFirebaseDb } from '@/services/firebase';
import { collection, addDoc, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { CartItem } from '@/types/product';
import { useToast } from '@/hooks/use-toast';

interface SaleRecord {
  id: string;
  orderNumber: string;
  items: Array<{
    productId: string;
    title: string;
    price: number;
    quantity: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  timestamp: Date;
  date: string;
}

export const useFirebaseReports = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Generate order number in YYMMDDHHMMSS format
  const generateOrderNumber = async () => {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hour = now.getHours().toString().padStart(2, '0');
    const minute = now.getMinutes().toString().padStart(2, '0');
    const second = now.getSeconds().toString().padStart(2, '0');
    
    return `${year}${month}${day}${hour}${minute}${second}`;
  };

  const recordSale = async (cartItems: CartItem[], totalAmount: number, currency: string, orderNumber?: string) => {
    try {
      const db = getFirebaseDb();
      const finalOrderNumber = orderNumber || await generateOrderNumber();
      
      const saleData = {
        orderNumber: finalOrderNumber,
        items: cartItems.map(item => ({
          productId: item.product.id,
          title: item.product.title,
          price: item.product.price,
          quantity: item.quantity,
          total: item.product.price * item.quantity
        })),
        subtotal: cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
        tax: totalAmount - cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
        total: totalAmount,
        currency,
        timestamp: new Date(),
        date: new Date().toISOString().split('T')[0]
      };

      await addDoc(collection(db, 'sales'), saleData);
      console.log('Sale recorded successfully with order number:', finalOrderNumber);
      
      return finalOrderNumber;
    } catch (error) {
      console.error('Error recording sale:', error);
      toast({
        title: "Error",
        description: "Failed to record sale",
        variant: "destructive"
      });
      throw error;
    }
  };

  const getSalesReports = async (startDate?: string, endDate?: string): Promise<SaleRecord[]> => {
    setLoading(true);
    try {
      const db = getFirebaseDb();
      let q = query(collection(db, 'sales'), orderBy('timestamp', 'desc'));
      
      if (startDate && endDate) {
        q = query(
          collection(db, 'sales'),
          where('date', '>=', startDate),
          where('date', '<=', endDate),
          orderBy('date', 'desc')
        );
      }

      const querySnapshot = await getDocs(q);
      const sales: SaleRecord[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        sales.push({
          id: doc.id,
          ...data,
          timestamp: data.timestamp.toDate()
        } as SaleRecord);
      });

      return sales;
    } catch (error) {
      console.error('Error fetching sales reports:', error);
      toast({
        title: "Error",
        description: "Failed to fetch sales reports",
        variant: "destructive"
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    recordSale,
    getSalesReports,
    generateOrderNumber,
    loading
  };
};
