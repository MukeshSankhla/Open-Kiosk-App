
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Product } from "@/types/product";
import { useSettings } from "@/hooks/useSettings";

interface ProductFormProps {
  onSubmit: (product: Omit<Product, "id">) => void;
  initialProduct?: Product;
}

const ProductForm = ({ onSubmit, initialProduct }: ProductFormProps) => {
  const { currentCurrency } = useSettings();
  const [title, setTitle] = useState(initialProduct?.title || "");
  const [price, setPrice] = useState(initialProduct?.price || 0);
  const [description, setDescription] = useState(initialProduct?.description || "");
  const [image, setImage] = useState(initialProduct?.image || "");
  const [category, setCategory] = useState(initialProduct?.category || "");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(initialProduct?.tags || []);
  const [inStock, setInStock] = useState(initialProduct?.inStock ?? true);
  const [stock, setStock] = useState(initialProduct?.stock || 0);
  const [minStock, setMinStock] = useState(initialProduct?.minStock || 5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      price,
      description,
      image,
      category,
      tags,
      inStock: stock > 0,
      stock,
      minStock
    });
    
    // Reset form if not editing
    if (!initialProduct) {
      setTitle("");
      setPrice(0);
      setDescription("");
      setImage("");
      setCategory("");
      setTags([]);
      setTagInput("");
      setInStock(true);
      setStock(0);
      setMinStock(5);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Product Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Enter product title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Price ({currentCurrency.symbol})</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value))}
                required
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter product description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g., Fruits, Vegetables, Dairy"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="stock">Stock Quantity</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(parseInt(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="minStock">Minimum Stock Alert</Label>
              <Input
                id="minStock"
                type="number"
                min="0"
                value={minStock}
                onChange={(e) => setMinStock(parseInt(e.target.value) || 0)}
                placeholder="5"
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleTagInputKeyPress}
                placeholder="Add a tag and press Enter"
                className="flex-1"
              />
              <Button type="button" onClick={addTag}>Add Tag</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-red-500" 
                    onClick={() => removeTag(tag)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full">
            {initialProduct ? "Update Product" : "Add Product"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductForm;
