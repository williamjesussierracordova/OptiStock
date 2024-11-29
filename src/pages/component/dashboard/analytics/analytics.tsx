import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSessionStore } from '@/store/sessionStore';
import { getInventoryData } from '@/firebase/dashboardController';

interface Product {
  codeProduct: string;
  name: string;
  cost: number;
  demand: number;
  leadtime: number;
  price: number;
  stock: number;
  holdingCost: number;
  orderCost: number;
}

interface InventoryData {
  totalProducts: number;
  mostSoldProducts: Product[];
  lowStockProducts: Product[];
  averageCost: string;
  totalInventoryValue: string;
  averageLeadTime: string;
}

function CardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-20 w-full" />
      </CardContent>
    </Card>
  );
}

function InventoryOverview({ totalProducts }: { totalProducts: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Total de productos</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{totalProducts}</p>
      </CardContent>
    </Card>
  );
}

function TopSellingProducts({ products }: { products: Product[] }) {
  return (
    <Card>
      <CardHeader>
        {/* FIXME */}
        <CardTitle>Productos más vendidos</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {products.map((product) => (
            <li key={product.codeProduct} className="flex justify-between">
              <span>{product.name}</span>
              <span className="font-medium">Stock: {product.stock}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function LowStockProducts({ products }: { products: Product[] }) {
  return (
    <Card>
      <CardHeader>
        {/* FIXME */}
        <CardTitle>Productos con bajo stock</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {products.map((product) => (
            <li key={product.codeProduct} className="flex justify-between text-red-600">
              <span>{product.name}</span>
              <span className="font-medium">Stock: {product.stock}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function InventoryStats({ 
  averageCost, 
  totalValue, 
  averageLeadTime 
}: { 
  averageCost: string; 
  totalValue: string; 
  averageLeadTime: string; 
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Estadísticas de inventario</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span>Costo promedio:</span>
          <span className="font-medium">{averageCost}</span>
        </div>
        <div className="flex justify-between">
          <span>Valor total:</span>
          <span className="font-medium">{totalValue}</span>
        </div>
        <div className="flex justify-between">
          {/* TODO: Entrega en días? Semanas? Cuál es la unidad? */}
          <span>Plazo de entrega medio:</span>
          <span className="font-medium">{averageLeadTime}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function InventoryDashboard() {
  const { session } = useSessionStore();
  const [inventoryData, setInventoryData] = useState<InventoryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!session?.uid) {
        setError('No user session found');
        setIsLoading(false);
        return;
      }

      try {
        const data = await getInventoryData(session.uid);
        setInventoryData(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch inventory data');
        console.error('Error fetching inventory data:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [session?.uid]);

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (isLoading || !inventoryData) {
    return (
      <div className="container mx-auto p-4">
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <div className="mt-6">
          <CardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <InventoryOverview totalProducts={inventoryData.totalProducts} />
        <TopSellingProducts products={inventoryData.mostSoldProducts} />
        <LowStockProducts products={inventoryData.lowStockProducts} />
      </div>
      <div className="mt-6">
        <InventoryStats
          averageCost={inventoryData.averageCost}
          totalValue={inventoryData.totalInventoryValue}
          averageLeadTime={inventoryData.averageLeadTime}
        />
      </div>
    </div>
  );
}