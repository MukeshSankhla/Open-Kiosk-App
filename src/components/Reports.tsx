
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Download, TrendingUp, Package, DollarSign, BarChart3, PieChart } from "lucide-react";
import { format } from "date-fns";
import { useReports, SalesReport, ItemReport } from "@/hooks/useReports";
import { useSettings } from "@/hooks/useSettings";
import { cn } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell, Pie } from "recharts";
import { DateRange } from "react-day-picker";

const Reports = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });
  const [salesData, setSalesData] = useState<SalesReport[]>([]);
  const [itemData, setItemData] = useState<ItemReport[]>([]);
  const { loading, getSalesReportByDateRange, getItemReportByDateRange } = useReports();
  const { currentCurrency } = useSettings();

  // Auto-load data when component mounts or date range changes
  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      loadReports();
    }
  }, [dateRange]);

  const loadReports = async () => {
    if (!dateRange?.from || !dateRange?.to) return;
    
    // Load both sales and item reports simultaneously
    const [salesReportData, itemReportData] = await Promise.all([
      getSalesReportByDateRange(dateRange.from, dateRange.to),
      getItemReportByDateRange(dateRange.from, dateRange.to)
    ]);
    
    setSalesData(salesReportData);
    setItemData(itemReportData);
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;
    
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).join(',')).join('\n');
    const csv = `${headers}\n${rows}`;
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}_${format(dateRange?.from || new Date(), 'yyyy-MM-dd')}_to_${format(dateRange?.to || new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00'];

  const salesChartData = salesData.map((report, index) => ({
    name: report.period,
    sales: report.totalSales,
    orders: report.totalOrders,
    avg: report.averageOrderValue
  }));

  const itemChartData = itemData.slice(0, 5).map((item, index) => ({
    name: item.productTitle.length > 10 ? item.productTitle.substring(0, 10) + '...' : item.productTitle,
    revenue: item.totalRevenue,
    quantity: item.quantitySold,
    fill: colors[index % colors.length]
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Reports & Analytics</h2>
      </div>

      {/* Date Range Selection */}
      <div className="flex items-center gap-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Select Date Range</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[300px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} -{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Tabs defaultValue="sales" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sales">Sales Reports</TabsTrigger>
          <TabsTrigger value="items">Item Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-6">
          {salesData.length > 0 && (
            <>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Sales Summary</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => exportToCSV(salesData, 'sales_report')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {salesData.map((report, index) => (
                  <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {currentCurrency.symbol}{report.totalSales.toFixed(2)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {report.totalOrders} orders • Avg: {currentCurrency.symbol}{report.averageOrderValue.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">{report.period}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Sales Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={salesChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} />
                      <Line type="monotone" dataKey="orders" stroke="#82ca9d" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="items" className="space-y-6">
          {itemData.length > 0 && (
            <>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Item Performance</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => exportToCSV(itemData, 'item_report')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Revenue by Product
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={itemChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="revenue" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="w-5 h-5" />
                      Sales Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsPieChart>
                        <Pie
                          data={itemChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="revenue"
                        >
                          {itemChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4">
                {itemData.map((item, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Package className="h-8 w-8 text-gray-400" />
                          <div>
                            <h4 className="font-semibold">{item.productTitle}</h4>
                            <p className="text-sm text-gray-500">Product ID: {item.productId}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">
                            {currentCurrency.symbol}{item.totalRevenue.toFixed(2)}
                          </div>
                          <p className="text-sm text-gray-500">
                            {item.quantitySold} units sold
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>

      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading reports...</p>
        </div>
      )}
    </div>
  );
};

export default Reports;
