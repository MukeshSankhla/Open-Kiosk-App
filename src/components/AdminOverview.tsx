
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, DollarSign, ShoppingCart } from "lucide-react";
import { useFirebaseProducts } from "@/hooks/useFirebaseProducts";
import { useReports } from "@/hooks/useReports";
import { useSettings } from "@/hooks/useSettings";
import { useEffect, useState } from "react";

export default function AdminOverview() {
  const { products } = useFirebaseProducts();
  const { getTodayStats } = useReports();
  const { currentCurrency } = useSettings();
  const [todayStats, setTodayStats] = useState({ totalSales: 0, totalOrders: 0, currency: 'INR' });

  useEffect(() => {
    const fetchTodayStats = async () => {
      const stats = await getTodayStats();
      setTodayStats(stats);
    };
    fetchTodayStats();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{products.length}</div>
          <p className="text-xs text-muted-foreground">Items in inventory</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">In Stock</CardTitle>
          <Package className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {products.filter((p) => p.inStock).length}
          </div>
          <p className="text-xs text-muted-foreground">Available items</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
          <DollarSign className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {currentCurrency.symbol}{todayStats.totalSales.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground">Total amount today</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Today's Orders</CardTitle>
          <ShoppingCart className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">
            {todayStats.totalOrders}
          </div>
          <p className="text-xs text-muted-foreground">Orders today</p>
        </CardContent>
      </Card>
    </div>
  );
}
