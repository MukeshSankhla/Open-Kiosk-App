import { Product } from './product';

export interface StoreSettings {
  name: string;
  currency: string;
  taxId: string;
  taxPercentage: number;
  firebaseConfig: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };
  comPort?: string;
  useThermalPrinter?: boolean;
}

export interface InventoryLog {
  id: string;
  productId: string;
  type: 'ADD' | 'REMOVE' | 'ADJUST';
  quantity: number;
  comment: string;
  timestamp: Date;
  userId?: string;
}

export interface ProductWithInventory extends Product {
  stock: number;
  minStock?: number;
}
