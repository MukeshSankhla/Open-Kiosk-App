
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Settings, ShoppingCart, Heart } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 relative">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Open Kiosk</h1>
          <p className="text-xl text-gray-600 mb-2">Open Source Point of Sale System</p>
          <p className="text-gray-500">Perfect for groceries, medical stores, food stalls, bakeries and more</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer" onClick={() => navigate('/admin')}>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Settings className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Admin Panel</CardTitle>
              <CardDescription>
                Manage inventory, add products, update prices and oversee store operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" size="lg">
                Access Admin Panel
              </Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer" onClick={() => navigate('/shop')}>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <ShoppingCart className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Customer Shop</CardTitle>
              <CardDescription>
                Browse products, search items, add to cart and complete purchases
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline" size="lg">
                Start Shopping
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-12 text-sm text-gray-500">
          <p>Open source • Free to use • Customizable for any business</p>
        </div>
      </div>
      
      {/* Attribution in bottom right corner */}
      <div className="fixed bottom-4 right-4 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          Built by{" "}
          <a 
            href="https://www.linkedin.com/in/mukeshsankhla" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            Mukesh Sankhla
          </a>
        </div>
        <div className="items-center">
            <a 
              href="https://www.makerbrains.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              www.makerbrains.com
            </a>
          </div>
      </div>
    </div>
  );
};

export default Index;
