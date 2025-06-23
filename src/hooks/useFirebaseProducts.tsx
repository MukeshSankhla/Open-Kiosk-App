
import { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { getFirebaseDb } from '@/services/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

export const useFirebaseProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = () => {
      try {
        const db = getFirebaseDb();
        const productsCollection = collection(db, 'products');
        
        // Set up real-time listener
        const unsubscribe = onSnapshot(productsCollection, (snapshot) => {
          const productsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Product[];
          
          console.log('Fetched products from Firebase:', productsData);
          setProducts(productsData);
          setLoading(false);
        }, (error) => {
          console.error('Error fetching products:', error);
          setError(error.message);
          setLoading(false);
          toast({
            title: "Error",
            description: "Failed to fetch products from Firebase",
            variant: "destructive"
          });
        });

        return unsubscribe;
      } catch (error) {
        console.error('Error setting up products listener:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
        setLoading(false);
      }
    };

    const unsubscribe = fetchProducts();
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [toast]);

  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      const db = getFirebaseDb();
      const productsCollection = collection(db, 'products');
      const docRef = await addDoc(productsCollection, {
        ...product,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      
      console.log('Product added with ID:', docRef.id);
      toast({
        title: "Success",
        description: "Product added successfully"
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const db = getFirebaseDb();
      const productDoc = doc(db, 'products', id);
      await updateDoc(productDoc, {
        ...updates,
        updated_at: new Date().toISOString()
      });
      
      console.log('Product updated:', id);
      toast({
        title: "Success",
        description: "Product updated successfully"
      });
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const db = getFirebaseDb();
      const productDoc = doc(db, 'products', id);
      await deleteDoc(productDoc);
      
      console.log('Product deleted:', id);
      toast({
        title: "Success",
        description: "Product deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive"
      });
      throw error;
    }
  };

  return {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct
  };
};
