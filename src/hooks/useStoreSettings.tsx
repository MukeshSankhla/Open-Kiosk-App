
import { useState, useEffect } from 'react';
import { StoreSettings } from '@/types/store';
import { initializeFirebase } from '@/services/firebase';

export const useStoreSettings = () => {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkInitialization = () => {
      try {
        const initialized = localStorage.getItem('storeInitialized');
        const savedSettings = localStorage.getItem('storeSettings');

        console.log('Checking initialization...', { initialized, hasSettings: !!savedSettings });

        if (initialized === 'true' && savedSettings) {
          const parsedSettings = JSON.parse(savedSettings);
          console.log('Found saved settings:', parsedSettings);
          setSettings(parsedSettings);
          
          // Initialize Firebase with saved settings
          try {
            initializeFirebase(parsedSettings);
            setIsInitialized(true);
            console.log('Firebase initialized with saved settings');
          } catch (error) {
            console.error('Error initializing Firebase with saved settings:', error);
            // Don't reset on Firebase error, just log it
          }
        } else {
          console.log('No saved settings found, showing initialization screen');
        }
      } catch (error) {
        console.error('Error loading store settings:', error);
        localStorage.removeItem('storeInitialized');
        localStorage.removeItem('storeSettings');
      }
      setLoading(false);
    };

    checkInitialization();
  }, []);

  const updateSettings = (newSettings: StoreSettings) => {
    try {
      console.log('Updating settings:', newSettings);
      setSettings(newSettings);
      localStorage.setItem('storeSettings', JSON.stringify(newSettings));
      localStorage.setItem('storeInitialized', 'true');
      
      // Initialize Firebase
      initializeFirebase(newSettings);
      setIsInitialized(true);
      console.log('Settings saved and Firebase initialized');
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  const resetStore = () => {
    localStorage.removeItem('storeInitialized');
    localStorage.removeItem('storeSettings');
    setSettings(null);
    setIsInitialized(false);
    console.log('Store reset');
  };

  return {
    settings,
    isInitialized,
    loading,
    updateSettings,
    resetStore
  };
};
