
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getFirebaseDb } from '@/services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

export const currencies: Currency[] = [
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
];

// Global currency state
let currentCurrencyGlobal: Currency = currencies[0];
const currencyListeners: Array<(currency: Currency) => void> = [];

export const useSettings = () => {
  const [currentCurrency, setCurrentCurrency] = useState<Currency>(currentCurrencyGlobal);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchCurrency = async () => {
    setLoading(true);
    try {
      console.log('Fetching currency from Firebase...');
      const db = getFirebaseDb();
      const docRef = doc(db, 'settings', 'default_currency');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log('Currency data received:', docSnap.data());
        const currency = currencies.find(c => c.code === docSnap.data().value) || currencies[0];
        currentCurrencyGlobal = currency;
        setCurrentCurrency(currency);
        // Notify all listeners
        currencyListeners.forEach(listener => listener(currency));
      }
    } catch (error) {
      console.error('Error fetching currency:', error);
      toast({
        title: "Error",
        description: "Failed to fetch currency setting",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateCurrency = async (currencyCode: string) => {
    setLoading(true);
    try {
      console.log('Updating currency to:', currencyCode);
      const currency = currencies.find(c => c.code === currencyCode);
      if (!currency) throw new Error('Invalid currency code');

      const db = getFirebaseDb();
      await setDoc(doc(db, 'settings', 'default_currency'), {
        value: currencyCode
      });

      console.log('Currency updated successfully');
      currentCurrencyGlobal = currency;
      setCurrentCurrency(currency);
      // Notify all listeners
      currencyListeners.forEach(listener => listener(currency));
      
      toast({
        title: "Success",
        description: `Currency updated to ${currency.name}`,
      });
    } catch (error) {
      console.error('Error updating currency:', error);
      toast({
        title: "Error",
        description: "Failed to update currency",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrency();
    
    // Add this component to the listeners
    const listener = (currency: Currency) => {
      setCurrentCurrency(currency);
    };
    currencyListeners.push(listener);
    
    // Cleanup
    return () => {
      const index = currencyListeners.indexOf(listener);
      if (index > -1) {
        currencyListeners.splice(index, 1);
      }
    };
  }, []);

  return {
    currentCurrency,
    currencies,
    loading,
    updateCurrency,
    fetchCurrency
  };
};

// Export a hook for components that only need to read the current currency
export const useCurrentCurrency = () => {
  const [currentCurrency, setCurrentCurrency] = useState<Currency>(currentCurrencyGlobal);
  
  useEffect(() => {
    const listener = (currency: Currency) => {
      setCurrentCurrency(currency);
    };
    currencyListeners.push(listener);
    
    return () => {
      const index = currencyListeners.indexOf(listener);
      if (index > -1) {
        currencyListeners.splice(index, 1);
      }
    };
  }, []);
  
  return currentCurrency;
};
