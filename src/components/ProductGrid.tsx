
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Package } from "lucide-react";
import { Product } from "@/types/product";
import { useCurrentCurrency } from "@/hooks/useSettings";

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

const ProductGrid = ({ products, onAddToCart }: ProductGridProps) => {
  const currentCurrency = useCurrentCurrency();

  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500">Try adjusting your search terms or connect to Supabase to add products.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
      {products.map((product) => (
        <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="p-0">
            {product.image ? (
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-32 sm:h-48 object-cover rounded-t-lg"
              />
            ) : (
              <div className="w-full h-32 sm:h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                <Package className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" />
              </div>
            )}
          </CardHeader>
          
          <CardContent className="p-2 sm:p-4">
            <div className="space-y-2 sm:space-y-3">
              <div>
                <h3 className="font-semibold text-sm sm:text-lg line-clamp-1">{product.title}</h3>
                <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 hidden sm:block">{product.description}</p>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-lg sm:text-xl font-bold text-green-600">
                  {currentCurrency.symbol}{product.price.toFixed(2)}
                </span>
                <Badge variant={product.inStock ? "default" : "destructive"} className="text-xs">
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </Badge>
              </div>
              
              <div className="flex flex-wrap gap-1 hidden sm:flex">
                {product.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {product.tags.length > 2 && (
                  <Badge variant="secondary" className="text-xs">
                    +{product.tags.length - 2}
                  </Badge>
                )}
              </div>
              
              <Button 
                className="w-full text-xs sm:text-sm" 
                onClick={() => onAddToCart(product)}
                disabled={!product.inStock}
                size="sm"
              >
                <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Add to Cart
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProductGrid;
