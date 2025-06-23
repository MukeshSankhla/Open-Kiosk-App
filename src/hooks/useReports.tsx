import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getFirebaseDb } from '@/services/firebase';
import { collection, query, where, getDocs, addDoc, Timestamp, orderBy } from 'firebase/firestore';

export interface SalesReport {
  period: string;
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  currency: string;
}

export interface ItemReport {
  productId: string;
  productTitle: string;
  quantitySold: number;
  totalRevenue: number;
  currency: string;
}

export interface TodayStats {
  totalSales: number;
  totalOrders: number;
  currency: string;
}

export const useReports = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getTodayStats = async (): Promise<TodayStats> => {
    try {
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

      const db = getFirebaseDb();
      const salesCollection = collection(db, 'sales');
      const q = query(
        salesCollection,
        where('timestamp', '>=', Timestamp.fromDate(startOfDay)),
        where('timestamp', '<=', Timestamp.fromDate(endOfDay))
      );

      const querySnapshot = await getDocs(q);
      const salesData = querySnapshot.docs.map(doc => doc.data());

      const totalSales = salesData.reduce((sum, sale) => sum + Number(sale.total || sale.total_amount || 0), 0);
      const totalOrders = salesData.length;
      const currency = salesData[0]?.currency || 'INR';

      return {
        totalSales,
        totalOrders,
        currency
      };
    } catch (error) {
      console.error('Error getting today stats:', error);
      return {
        totalSales: 0,
        totalOrders: 0,
        currency: 'INR'
      };
    }
  };

  const getSalesReportByDateRange = async (startDate: Date, endDate: Date): Promise<SalesReport[]> => {
    setLoading(true);
    try {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      const db = getFirebaseDb();
      const salesCollection = collection(db, 'sales');
      const q = query(
        salesCollection,
        where('timestamp', '>=', Timestamp.fromDate(start)),
        where('timestamp', '<=', Timestamp.fromDate(end)),
        orderBy('timestamp', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const salesData = querySnapshot.docs.map(doc => doc.data());

      // Group sales by date for daily breakdown
      const dailySales = new Map<string, { sales: number; orders: number; currency: string }>();
      
      salesData.forEach(sale => {
        const saleDate = sale.timestamp.toDate();
        const dateKey = saleDate.toISOString().split('T')[0]; // YYYY-MM-DD format
        const saleAmount = Number(sale.total || sale.total_amount || 0);
        
        const existing = dailySales.get(dateKey);
        if (existing) {
          existing.sales += saleAmount;
          existing.orders += 1;
        } else {
          dailySales.set(dateKey, {
            sales: saleAmount,
            orders: 1,
            currency: sale.currency || 'INR'
          });
        }
      });

      // Convert to array and sort by date
      const reports: SalesReport[] = Array.from(dailySales.entries())
        .map(([dateKey, data]) => ({
          period: new Date(dateKey).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          }),
          totalSales: data.sales,
          totalOrders: data.orders,
          averageOrderValue: data.orders > 0 ? data.sales / data.orders : 0,
          currency: data.currency
        }))
        .sort((a, b) => new Date(a.period).getTime() - new Date(b.period).getTime());

      return reports;
    } catch (error) {
      console.error('Error generating sales report:', error);
      toast({
        title: "Error",
        description: "Failed to generate sales report",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getItemReportByDateRange = async (startDate: Date, endDate: Date): Promise<ItemReport[]> => {
    setLoading(true);
    try {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      const db = getFirebaseDb();
      const salesCollection = collection(db, 'sales');
      const q = query(
        salesCollection,
        where('timestamp', '>=', Timestamp.fromDate(start)),
        where('timestamp', '<=', Timestamp.fromDate(end))
      );

      const querySnapshot = await getDocs(q);
      const salesData = querySnapshot.docs.map(doc => doc.data());

      const itemMap = new Map<string, { title: string; quantity: number; revenue: number; currency: string }>();

      salesData.forEach(sale => {
        const items = sale.items as any[];
        if (items) {
          items.forEach(item => {
            const existing = itemMap.get(item.productId);
            if (existing) {
              existing.quantity += item.quantity;
              existing.revenue += item.total;
            } else {
              itemMap.set(item.productId, {
                title: item.title,
                quantity: item.quantity,
                revenue: item.total,
                currency: sale.currency
              });
            }
          });
        }
      });

      return Array.from(itemMap.entries()).map(([productId, data]) => ({
        productId,
        productTitle: data.title,
        quantitySold: data.quantity,
        totalRevenue: data.revenue,
        currency: data.currency
      }));
    } catch (error) {
      console.error('Error generating item report:', error);
      toast({
        title: "Error",
        description: "Failed to generate item report",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getSalesReport = async (period: 'day' | 'week' | 'month' | 'year', date?: Date): Promise<SalesReport[]> => {
    setLoading(true);
    try {
      const targetDate = date || new Date();
      let startDate: Date;
      let endDate: Date = new Date(targetDate);
      endDate.setHours(23, 59, 59, 999);

      switch (period) {
        case 'day':
          startDate = new Date(targetDate);
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate = new Date(targetDate);
          startDate.setDate(targetDate.getDate() - targetDate.getDay());
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'month':
          startDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
          break;
        case 'year':
          startDate = new Date(targetDate.getFullYear(), 0, 1);
          break;
      }

      const db = getFirebaseDb();
      const salesCollection = collection(db, 'sales');
      const q = query(
        salesCollection,
        where('timestamp', '>=', Timestamp.fromDate(startDate)),
        where('timestamp', '<=', Timestamp.fromDate(endDate))
      );

      const querySnapshot = await getDocs(q);
      const salesData = querySnapshot.docs.map(doc => doc.data());

      const totalSales = salesData.reduce((sum, sale) => sum + Number(sale.total), 0);
      const totalOrders = salesData.length;
      const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
      const currency = salesData[0]?.currency || 'INR';

      return [{
        period: `${period} - ${targetDate.toDateString()}`,
        totalSales,
        totalOrders,
        averageOrderValue,
        currency
      }];
    } catch (error) {
      console.error('Error generating sales report:', error);
      toast({
        title: "Error",
        description: "Failed to generate sales report",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getItemReport = async (period: 'day' | 'week' | 'month' | 'year', date?: Date): Promise<ItemReport[]> => {
    setLoading(true);
    try {
      const targetDate = date || new Date();
      let startDate: Date;
      let endDate: Date = new Date(targetDate);
      endDate.setHours(23, 59, 59, 999);

      switch (period) {
        case 'day':
          startDate = new Date(targetDate);
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate = new Date(targetDate);
          startDate.setDate(targetDate.getDate() - targetDate.getDay());
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'month':
          startDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
          break;
        case 'year':
          startDate = new Date(targetDate.getFullYear(), 0, 1);
          break;
      }

      const db = getFirebaseDb();
      const salesCollection = collection(db, 'sales');
      const q = query(
        salesCollection,
        where('timestamp', '>=', Timestamp.fromDate(startDate)),
        where('timestamp', '<=', Timestamp.fromDate(endDate))
      );

      const querySnapshot = await getDocs(q);
      const salesData = querySnapshot.docs.map(doc => doc.data());

      const itemMap = new Map<string, { title: string; quantity: number; revenue: number; currency: string }>();

      salesData.forEach(sale => {
        const items = sale.items as any[];
        items.forEach(item => {
          const existing = itemMap.get(item.productId);
          if (existing) {
            existing.quantity += item.quantity;
            existing.revenue += item.total;
          } else {
            itemMap.set(item.productId, {
              title: item.title,
              quantity: item.quantity,
              revenue: item.total,
              currency: sale.currency
            });
          }
        });
      });

      return Array.from(itemMap.entries()).map(([productId, data]) => ({
        productId,
        productTitle: data.title,
        quantitySold: data.quantity,
        totalRevenue: data.revenue,
        currency: data.currency
      }));
    } catch (error) {
      console.error('Error generating item report:', error);
      toast({
        title: "Error",
        description: "Failed to generate item report",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const recordSale = async (items: any[], totalAmount: number, currency: string) => {
    try {
      const db = getFirebaseDb();
      const salesCollection = collection(db, 'sales');
      
      await addDoc(salesCollection, {
        total_amount: totalAmount,
        currency,
        items,
        timestamp: Timestamp.now()
      });

      toast({
        title: "Success",
        description: "Sale recorded successfully",
      });
    } catch (error) {
      console.error('Error recording sale:', error);
      toast({
        title: "Error",
        description: "Failed to record sale",
        variant: "destructive",
      });
    }
  };

  return {
    loading,
    getTodayStats,
    getSalesReportByDateRange,
    getItemReportByDateRange,
    getSalesReport,
    getItemReport,
    recordSale
  };
};
