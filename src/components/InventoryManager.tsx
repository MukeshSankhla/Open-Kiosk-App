
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, Package, AlertTriangle } from "lucide-react";
import { ProductWithInventory, InventoryLog } from "@/types/store";
import { useToast } from "@/hooks/use-toast";

interface InventoryManagerProps {
  products: ProductWithInventory[];
  onUpdateInventory: (productId: string, newStock: number, log: Omit<InventoryLog, 'id' | 'timestamp'>) => void;
}

const InventoryManager = ({ products, onUpdateInventory }: InventoryManagerProps) => {
  const [selectedProduct, setSelectedProduct] = useState<ProductWithInventory | null>(null);
  const [adjustmentType, setAdjustmentType] = useState<'ADD' | 'REMOVE' | 'ADJUST'>('ADD');
  const [quantity, setQuantity] = useState<number>(0);
  const [comment, setComment] = useState("");
  const { toast } = useToast();

  const handleInventoryUpdate = () => {
    if (!selectedProduct || quantity <= 0) {
      toast({
        title: "Error",
        description: "Please select a product and enter a valid quantity",
        variant: "destructive"
      });
      return;
    }

    let newStock = selectedProduct.stock;
    
    switch (adjustmentType) {
      case 'ADD':
        newStock += quantity;
        break;
      case 'REMOVE':
        newStock = Math.max(0, newStock - quantity);
        break;
      case 'ADJUST':
        newStock = quantity;
        break;
    }

    const log: Omit<InventoryLog, 'id' | 'timestamp'> = {
      productId: selectedProduct.id,
      type: adjustmentType,
      quantity,
      comment
    };

    onUpdateInventory(selectedProduct.id, newStock, log);
    
    toast({
      title: "Success",
      description: `Inventory updated for ${selectedProduct.title}`
    });

    // Reset form
    setQuantity(0);
    setComment("");
    setSelectedProduct(null);
  };

  const lowStockProducts = products.filter(p => p.minStock && p.stock <= p.minStock);

  return (
    <div className="space-y-6">
      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-800">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Low Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStockProducts.map(product => (
                <div key={product.id} className="flex justify-between items-center">
                  <span className="text-orange-700">{product.title}</span>
                  <Badge variant="destructive">{product.stock} left</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Inventory Adjustment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="w-5 h-5 mr-2" />
            Inventory Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Select Product</Label>
            <select 
              className="w-full p-2 border rounded-md"
              value={selectedProduct?.id || ""}
              onChange={(e) => {
                const product = products.find(p => p.id === e.target.value);
                setSelectedProduct(product || null);
              }}
            >
              <option value="">Choose a product...</option>
              {products.map(product => (
                <option key={product.id} value={product.id}>
                  {product.title} (Current: {product.stock})
                </option>
              ))}
            </select>
          </div>

          {selectedProduct && (
            <>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={adjustmentType === 'ADD' ? 'default' : 'outline'}
                  onClick={() => setAdjustmentType('ADD')}
                  className="flex items-center"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
                <Button
                  variant={adjustmentType === 'REMOVE' ? 'default' : 'outline'}
                  onClick={() => setAdjustmentType('REMOVE')}
                  className="flex items-center"
                >
                  <Minus className="w-4 h-4 mr-1" />
                  Remove
                </Button>
                <Button
                  variant={adjustmentType === 'ADJUST' ? 'default' : 'outline'}
                  onClick={() => setAdjustmentType('ADJUST')}
                >
                  Set To
                </Button>
              </div>

              <div>
                <Label>Quantity</Label>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                  placeholder="Enter quantity"
                />
              </div>

              <div>
                <Label>Comment</Label>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a note about this inventory change..."
                />
              </div>

              <Button onClick={handleInventoryUpdate} className="w-full">
                Update Inventory
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Current Inventory */}
      <Card>
        <CardHeader>
          <CardTitle>Current Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {products.map(product => (
              <div key={product.id} className="flex justify-between items-center p-2 border rounded">
                <span>{product.title}</span>
                <div className="flex items-center gap-2">
                  <Badge variant={product.stock > (product.minStock || 0) ? 'default' : 'destructive'}>
                    {product.stock} in stock
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryManager;
