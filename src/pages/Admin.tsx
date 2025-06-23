
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminOverview from "@/components/AdminOverview";
import AdminProducts from "@/components/AdminProducts";
import AdminAddProduct from "@/components/AdminAddProduct";
import AdminReports from "@/components/AdminReports";
import AdminSettings from "@/components/AdminSettings";
import AdminOrders from "@/components/AdminOrders";
import { useFirebaseProducts } from "@/hooks/useFirebaseProducts";
import { Product } from "@/types/product";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("overview");
  const { addProduct, updateProduct, deleteProduct } = useFirebaseProducts();

  const handleAddProduct = async (newProduct: Omit<Product, "id">) => {
    try {
      await addProduct(newProduct);
      setActiveTab("products");
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleUpdateProduct = async (updatedProduct: Product) => {
    try {
      await updateProduct(updatedProduct.id, updatedProduct);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProduct(productId);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold py-4">Admin Dashboard</h1>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-6 h-12">
            <TabsTrigger value="overview" className="text-sm">Overview</TabsTrigger>
            <TabsTrigger value="products" className="text-sm">Products</TabsTrigger>
            <TabsTrigger value="add-product" className="text-sm">Add Product</TabsTrigger>
            <TabsTrigger value="orders" className="text-sm">Orders</TabsTrigger>
            <TabsTrigger value="reports" className="text-sm">Reports</TabsTrigger>
            <TabsTrigger value="settings" className="text-sm">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <AdminOverview />
          </TabsContent>
          
          <TabsContent value="products">
            <AdminProducts onUpdate={handleUpdateProduct} onDelete={handleDeleteProduct} />
          </TabsContent>
          
          <TabsContent value="add-product">
            <AdminAddProduct onSubmit={handleAddProduct} />
          </TabsContent>
          
          <TabsContent value="orders">
            <AdminOrders />
          </TabsContent>
          
          <TabsContent value="reports">
            <AdminReports />
          </TabsContent>
          
          <TabsContent value="settings">
            <AdminSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
