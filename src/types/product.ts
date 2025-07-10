
export interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  image?: string;
  tags: string[];
  inStock: boolean;
  category: string;
  stock: number;
  minStock?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
