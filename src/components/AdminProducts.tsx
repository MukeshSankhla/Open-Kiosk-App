
import ProductList from "@/components/ProductList";
import { useFirebaseProducts } from "@/hooks/useFirebaseProducts";

export default function AdminProducts({ onUpdate, onDelete }: { onUpdate: any; onDelete: any }) {
  const { products, loading } = useFirebaseProducts();
  if (loading)
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
        <p className="mt-4 text-gray-500">Loading products...</p>
      </div>
    );
  return <ProductList products={products} onUpdate={onUpdate} onDelete={onDelete} />;
}
