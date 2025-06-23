
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import ProductGrid from "@/components/ProductGrid";
import Cart from "@/components/Cart";
import VoiceSearchButton from "@/components/VoiceSearchButton";
import OnScreenKeyboard from "@/components/OnScreenKeyboard";
import AdminAccess from "@/components/AdminAccess";
import { CartItem, Product } from "@/types/product";
import { useFirebaseProducts } from "@/hooks/useFirebaseProducts";
import { useSettings } from "@/hooks/useSettings";

const Shop = () => {
  const navigate = useNavigate();
  const { products, loading } = useFirebaseProducts();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const { currentCurrency } = useSettings();

  useEffect(() => {
    if (products) {
      const filtered = products.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredProducts(filtered);
    }
  }, [products, searchQuery]);

  const addToCart = (product: Product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { product, quantity: 1 }];
      }
    });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems(prevItems => prevItems.filter(item => item.product.id !== productId));
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handleAdminAuth = () => {
    setIsAdmin(true);
    navigate('/admin');
  };

  const handleVoiceTranscript = (transcript: string) => {
    setSearchQuery(transcript);
  };

  const handleKeyPress = (key: string) => {
    if (key === 'BACKSPACE') {
      setSearchQuery(prev => prev.slice(0, -1));
    } else if (key === 'CLEAR') {
      setSearchQuery('');
    } else if (key === ' ') {
      setSearchQuery(prev => prev + ' ');
    } else if (key.length === 1) {
      setSearchQuery(prev => prev + key);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="ml-4 text-gray-600">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsKeyboardVisible(true)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <VoiceSearchButton onTranscript={handleVoiceTranscript} />
            <div>
              <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCartOpen(true)}
              className="relative"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Cart
              {getTotalItems() > 0 && (
                <Badge variant="destructive" className="ml-2 px-1 min-w-[1.2rem] h-5">
                  {getTotalItems()}
                </Badge>
              )}
            </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Products with improved image sizing */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="h-full">
              <CardContent className="p-4">
                <div className="space-y-3">
                  {product.image && (
                    <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div>
                    <h3 className="font-semibold text-sm line-clamp-2">{product.title}</h3>
                    <p className="text-gray-600 text-xs line-clamp-2 mt-1">{product.description}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-green-600 text-sm">
                        {currentCurrency.symbol}{product.price.toFixed(2)}
                      </span>
                      <Badge variant={product.inStock ? "default" : "destructive"} className="text-xs">
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </Badge>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => addToCart(product)}
                    disabled={!product.inStock}
                    className="w-full text-sm py-2"
                    size="sm"
                  >
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Cart */}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={updateCartQuantity}
        onClearCart={clearCart}
      />

      {/* On-Screen Keyboard */}
      <OnScreenKeyboard
        isVisible={isKeyboardVisible}
        onKeyPress={handleKeyPress}
        onClose={() => setIsKeyboardVisible(false)}
      />
    </div>
  );
};

export default Shop;
