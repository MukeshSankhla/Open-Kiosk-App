
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, Minus, Package, AlertTriangle, Search, Filter, X, Check, ChevronsUpDown } from "lucide-react";
import { ProductWithInventory, InventoryLog } from "@/types/store";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface InventoryManagerProps {
  products: ProductWithInventory[];
  onUpdateInventory: (productId: string, newStock: number, log: Omit<InventoryLog, 'id' | 'timestamp'>) => void;
}

const InventoryManager = ({ products, onUpdateInventory }: InventoryManagerProps) => {
  const [selectedProduct, setSelectedProduct] = useState<ProductWithInventory | null>(null);
  const [adjustmentType, setAdjustmentType] = useState<'ADD' | 'REMOVE' | 'ADJUST'>('ADD');
  const [quantity, setQuantity] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [stockFilter, setStockFilter] = useState<"all" | "in-stock" | "out-of-stock" | "low-stock">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [productSelectOpen, setProductSelectOpen] = useState(false);
  const { toast } = useToast();

  // Filter and search logic
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStockFilter = (() => {
      switch (stockFilter) {
        case "in-stock":
          return (product.stock || 0) > 0;
        case "out-of-stock":
          return (product.stock || 0) === 0;
        case "low-stock":
          return (product.stock || 0) > 0 && (product.stock || 0) <= (product.minStock || 5);
        default:
          return true;
      }
    })();

    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;

    return matchesSearch && matchesStockFilter && matchesCategory;
  });

  // Get unique categories for filter
  const categories = [...new Set(products.map(p => p.category))];

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
      comment: ""
    };

    onUpdateInventory(selectedProduct.id, newStock, log);
    
    toast({
      title: "Success",
      description: `Inventory updated for ${selectedProduct.title}`
    });

    // Reset form
    setQuantity(0);
    setSelectedProduct(null);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStockFilter("all");
    setCategoryFilter("all");
  };

  const lowStockProducts = products.filter(p => p.minStock && p.stock <= p.minStock);
  const outOfStockProducts = products.filter(p => p.stock === 0);

  return (
    <div className="space-y-6">
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
            <Popover open={productSelectOpen} onOpenChange={setProductSelectOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={productSelectOpen}
                  className="w-full justify-between"
                >
                  {selectedProduct
                    ? `${selectedProduct.title} (Current: ${selectedProduct.stock})`
                    : "Choose a product..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search products..." />
                  <CommandEmpty>No product found.</CommandEmpty>
                  <CommandGroup>
                    <CommandList>
                      {filteredProducts.map((product) => (
                        <CommandItem
                          key={product.id}
                          value={product.title}
                          onSelect={() => {
                            setSelectedProduct(product);
                            setProductSelectOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedProduct?.id === product.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span>{product.title}</span>
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-xs">{product.category}</Badge>
                                <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                                {product.stock === 0 && <Badge variant="destructive" className="text-xs">OUT OF STOCK</Badge>}
                                {product.stock <= (product.minStock || 5) && product.stock > 0 && 
                                  <Badge variant="secondary" className="text-xs">LOW STOCK</Badge>
                                }
                              </div>
                            </div>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandList>
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
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

              <Button onClick={handleInventoryUpdate} className="w-full">
                Update Inventory
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Alerts Section - Moved Down */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        {/* Low Stock Alert */}
        {lowStockProducts.length > 0 && (
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center text-orange-800">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Low Stock Alert ({lowStockProducts.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {lowStockProducts.slice(0, 3).map(product => (
                  <div key={product.id} className="flex justify-between items-center">
                    <span className="text-orange-700 text-sm">{product.title}</span>
                    <Badge variant="destructive" className="text-xs">{product.stock} left</Badge>
                  </div>
                ))}
                {lowStockProducts.length > 3 && (
                  <div className="text-xs text-orange-600">+{lowStockProducts.length - 3} more</div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Out of Stock Alert */}
        {outOfStockProducts.length > 0 && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center text-red-800">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Out of Stock ({outOfStockProducts.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {outOfStockProducts.slice(0, 3).map(product => (
                  <div key={product.id} className="flex justify-between items-center">
                    <span className="text-red-700 text-sm">{product.title}</span>
                    <Badge variant="destructive" className="text-xs">0 stock</Badge>
                  </div>
                ))}
                {outOfStockProducts.length > 3 && (
                  <div className="text-xs text-red-600">+{outOfStockProducts.length - 3} more</div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Current Inventory */}
      <Card>
        <CardHeader>
          <CardTitle>Current Inventory</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Stock Filter */}
            <Select value={stockFilter} onValueChange={(value: "all" | "in-stock" | "out-of-stock" | "low-stock") => setStockFilter(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by stock" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stock Levels</SelectItem>
                <SelectItem value="in-stock">In Stock</SelectItem>
                <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                <SelectItem value="low-stock">Low Stock</SelectItem>
              </SelectContent>
            </Select>

            {/* Category Filter */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            <Button variant="outline" onClick={clearFilters} className="flex items-center">
              <X className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          </div>

          {/* Filter Summary */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Showing {filteredProducts.length} of {products.length} products</span>
            {(searchTerm || stockFilter !== "all" || categoryFilter !== "all") && (
              <Badge variant="secondary">Filtered</Badge>
            )}
          </div>
        </CardContent>
        <CardContent>
          <div className="space-y-2">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No products match your current filters</p>
                <Button variant="outline" onClick={clearFilters} className="mt-2">
                  Clear Filters
                </Button>
              </div>
            ) : (
              filteredProducts.map(product => (
                <div key={product.id} className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{product.title}</span>
                      <Badge variant="secondary" className="text-xs">{product.category}</Badge>
                    </div>
                    {product.description && (
                      <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={
                        product.stock === 0 ? 'destructive' : 
                        product.stock <= (product.minStock || 5) ? 'secondary' : 
                        'default'
                      }
                    >
                      {product.stock} in stock
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryManager;
