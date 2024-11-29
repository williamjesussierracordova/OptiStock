import React from 'react';
import { Users } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getSalesData, getSalesDataByDate } from "@/firebase/dashboardController";
import { useSessionStore } from "@/store/sessionStore";
import DashboardPage from './dashboard/analytics/analytics';
import MainEOQ from '@/pages/component/dashboard/eoq/eoq';

interface SalesData {
  totalRevenue: number;
  totalSales: number;
  averageSale: number;
  mostRecentSale: RecentSale;
  mostFrequentBuyer: {
    id: string;
    name: string;
    purchases: number;
  };
  lastFiveSales: RecentSale[];
}

interface RecentSale {
  codesale: string;
  date: string;
  dnibuyer: string;
  informationSale: any[];
  namebuyer: string;
  totalSale: number;
}

interface SalesDataByDate {
  today: {
    date: string;
    totalRevenue: number;
    totalSales: number;
  };
  yesterday: {
    date: string;
    totalRevenue: number;
    totalSales: number;
  };
  revenueDifference: number;
}



const Overview: React.FC<{
  salesData: SalesData;
  salesDataByDate: SalesDataByDate;
}> = ({ salesData, salesDataByDate }) => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Ingresos</CardTitle>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="h-4 w-4 text-muted-foreground"
        >
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">S/.{salesData.totalRevenue}</div>
        <p className="text-xs text-muted-foreground">
          {salesDataByDate.today.totalRevenue - salesDataByDate.yesterday.totalRevenue > 0 ? "+" : "-"} S/.
          {Math.abs(salesDataByDate.today.totalRevenue - salesDataByDate.yesterday.totalRevenue)} con respecto a ayer
        </p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Ventas</CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{salesData.totalSales}</div>
        <p className="text-xs text-muted-foreground">
          {salesDataByDate.today.totalSales - salesDataByDate.yesterday.totalSales > 0 ? "+" : "-"}{" "}
          {Math.abs(salesDataByDate.today.totalSales - salesDataByDate.yesterday.totalSales)} con respecto a ayer
        </p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Promedio de venta</CardTitle>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="h-4 w-4 text-muted-foreground"
        >
          <rect width="20" height="14" x="2" y="5" rx="2" />
          <path d="M2 10h20" />
        </svg>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">S/. {salesData.averageSale}</div>
        <p className="text-xs text-muted-foreground">
          {salesDataByDate.revenueDifference > 0 ? "+" : "-"} S/.{Math.abs(salesDataByDate.revenueDifference)} con respecto a ayer
        </p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Comprador más frecuente</CardTitle>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="h-4 w-4 text-muted-foreground"
        >
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{salesData.mostFrequentBuyer?.name || "N/A"}</div>
        <p className="text-xs text-muted-foreground">
          {salesData.mostFrequentBuyer?.purchases || 0} compras
        </p>
      </CardContent>
    </Card>
  </div>
);

const SalesChart: React.FC<{
  data: Array<{ day: string; total: number; }>;
}> = ({ data }) => (
  <Card className="col-span-4">
    <CardHeader>
      <CardTitle>Overview</CardTitle>
    </CardHeader>
    <CardContent className="pl-2">
      <ResponsiveContainer height={350}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="day"
            stroke="#888888"
            fontSize={12}
            tickLine={true}
            axisLine={true}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={true}
            axisLine={true}
            tickFormatter={(value) => `$${value}`}
          />
          <Bar
            dataKey="total"
            fill="currentColor"
            radius={[4, 4, 0, 0]}
            className="fill-primary"
          />
          <Tooltip />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

const RecentSales: React.FC<{
  sales: RecentSale[];
}> = ({ sales }) => (
  <Card className="col-span-3">
    <CardHeader>
      <CardTitle>Ventas Recientes</CardTitle>
      <p className="text-sm text-muted-foreground">
        Últimas {sales.length} ventas realizadas
      </p>
    </CardHeader>
    <CardContent>
      <div className="space-y-8">
        {sales.map((sale) => (
          <div key={sale.codesale} className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarFallback>
                {sale.namebuyer.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">{sale.namebuyer}</p>
              <p className="text-sm text-muted-foreground">{sale.dnibuyer}</p>
            </div>
            <div className="ml-auto font-medium">S/. {sale.totalSale}</div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export const Dashboard: React.FC = () => {
  const { session } = useSessionStore();
  const [salesData, setSalesData] = React.useState<SalesData | null>(null);
  const [salesDataByDate, setSalesDataByDate] = React.useState<SalesDataByDate | null>(null);
  
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        if (!session?.uid) return;
        
        const [data, dataByDate] = await Promise.all([
          getSalesData(session.uid),
          getSalesDataByDate(session.uid)
        ]);
        
        setSalesData(data);
        setSalesDataByDate(dataByDate);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, [session?.uid]);

  if (!salesData || !salesDataByDate) {
    return <div>Loading...</div>;
  }
  const chartData = [
    { day: "23/11", total: 2400 },
    { day: "24/11", total: 1800 },
    { day: "25/11", total: 4200 },
    { day: "26/11", total: 3800 },
    { day: "27/11", total: 2200 },
    { day: "28/11", total: 3400 },
    { day: "hoy", total: salesDataByDate.today.totalRevenue },
  ];
  return (
    // TODO: Traducir TODO al español
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex-1 space-y-4 p-2 lg:px-8 md:px-4">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-3">
          <TabsList className="grid w-full grid-cols-1  lg:grid-cols-3 ">
            <TabsTrigger value="overview" className="bg-blue-900 text-white border-black hover:bg-white hover:text-black">
              Overview
            </TabsTrigger>
            <TabsTrigger value="analytics" className="bg-blue-900 text-white border-black hover:bg-white hover:text-black">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="EOQ" className="bg-blue-900 text-white border-black hover:bg-white hover:text-black">
              EOQ
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Overview salesData={salesData} salesDataByDate={salesDataByDate} />
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <SalesChart data={chartData} />
              <RecentSales sales={salesData.lastFiveSales} />
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <DashboardPage />
          </TabsContent>
          <TabsContent value="EOQ" className="space-y-4">
            <MainEOQ/>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;