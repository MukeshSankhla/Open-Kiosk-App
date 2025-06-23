import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Store, Database } from "lucide-react";
import { StoreSettings } from "@/types/store";
import { useToast } from "@/hooks/use-toast";

interface StoreInitializationProps {
  onComplete: (settings: StoreSettings) => void;
}

const StoreInitialization = ({ onComplete }: StoreInitializationProps) => {
  const [settings, setSettings] = useState<StoreSettings>({
    name: "",
    currency: "INR",
    taxId: "",
    taxPercentage: 18,
    firebaseConfig: {
      apiKey: "",
      authDomain: "",
      projectId: "",
      storageBucket: "",
      messagingSenderId: "",
      appId: ""
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string | number) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFirebaseConfigChange = (field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      firebaseConfig: {
        ...prev.firebaseConfig,
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate required fields
      if (!settings.name || !settings.taxId || !settings.firebaseConfig.projectId) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        return;
      }

      // Save to localStorage for persistence
      localStorage.setItem('storeSettings', JSON.stringify(settings));
      localStorage.setItem('storeInitialized', 'true');

      toast({
        title: "Success",
        description: "Store setup completed successfully!"
      });

      onComplete(settings);
    } catch (error) {
      console.error('Setup error:', error);
      toast({
        title: "Error",
        description: "Failed to complete setup",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Store className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Store Setup</CardTitle>
          <p className="text-gray-600">Set up your store for the first time</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Store Information</h3>
              
              <div>
                <Label htmlFor="storeName">Store Name *</Label>
                <Input
                  id="storeName"
                  value={settings.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your store name"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Input
                    id="currency"
                    value={settings.currency}
                    onChange={(e) => handleInputChange('currency', e.target.value)}
                    placeholder="INR"
                  />
                </div>
                <div>
                  <Label htmlFor="taxPercentage">Tax Percentage (%)</Label>
                  <Input
                    id="taxPercentage"
                    type="number"
                    value={settings.taxPercentage}
                    onChange={(e) => handleInputChange('taxPercentage', parseFloat(e.target.value))}
                    placeholder="18"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="taxId">Tax ID / GST Number *</Label>
                <Input
                  id="taxId"
                  value={settings.taxId}
                  onChange={(e) => handleInputChange('taxId', e.target.value)}
                  placeholder="Enter your tax ID or GST number"
                  required
                />
              </div>

              <div>
                <Label htmlFor="comPort">COM Port for Printer (Optional)</Label>
                <Input
                  id="comPort"
                  value={settings.comPort || ""}
                  onChange={(e) => handleInputChange('comPort', e.target.value)}
                  placeholder="COM3"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter the COM port for your thermal printer (e.g., COM3, ttyACM0)
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center">
                <Database className="w-5 h-5 mr-2" />
                Firebase Configuration *
              </h3>
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="apiKey">API Key</Label>
                  <Input
                    id="apiKey"
                    value={settings.firebaseConfig.apiKey}
                    onChange={(e) => handleFirebaseConfigChange('apiKey', e.target.value)}
                    placeholder="Your Firebase API key"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="projectId">Project ID</Label>
                  <Input
                    id="projectId"
                    value={settings.firebaseConfig.projectId}
                    onChange={(e) => handleFirebaseConfigChange('projectId', e.target.value)}
                    placeholder="your-project-id"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="authDomain">Auth Domain</Label>
                  <Input
                    id="authDomain"
                    value={settings.firebaseConfig.authDomain}
                    onChange={(e) => handleFirebaseConfigChange('authDomain', e.target.value)}
                    placeholder="your-project-id.firebaseapp.com"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="storageBucket">Storage Bucket</Label>
                    <Input
                      id="storageBucket"
                      value={settings.firebaseConfig.storageBucket}
                      onChange={(e) => handleFirebaseConfigChange('storageBucket', e.target.value)}
                      placeholder="your-project-id.appspot.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="messagingSenderId">Messaging Sender ID</Label>
                    <Input
                      id="messagingSenderId"
                      value={settings.firebaseConfig.messagingSenderId}
                      onChange={(e) => handleFirebaseConfigChange('messagingSenderId', e.target.value)}
                      placeholder="123456789"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="appId">App ID</Label>
                  <Input
                    id="appId"
                    value={settings.firebaseConfig.appId}
                    onChange={(e) => handleFirebaseConfigChange('appId', e.target.value)}
                    placeholder="1:123456789:web:abcdef"
                  />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? "Setting up..." : "Complete Setup"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default StoreInitialization;
