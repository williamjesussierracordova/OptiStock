import React from 'react';
import { StatCard } from './StatCard';
import { ProductTable } from './ProductTable';
import { Package, DollarSign, ShoppingCart, AlertTriangle, TrendingUp, TrendingDown, Warehouse } from 'lucide-react';

interface EOQDashboardProps {
  data: {
    eoqAverage: string;
    totalCostAverage: string;
    totalOrders: number;
    reorderPointAverage: string;
    mostEOQProduct: any;
    leastEOQProduct: any;
    totalInventoryValue: string;
    criticalStockProducts: any[];
  };
}

export function EOQDashboard({ data }: EOQDashboardProps) {
  if (!data) {
    return <div>Cargando...</div>
  }
  return (
    // TODO: ¿Qué significa todo esto para el dueño de la bodega?
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">EOQ Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Average EOQ"
            value={data.eoqAverage}
            icon={<Package className="w-6 h-6" />}
          />
          <StatCard
            title="Average Total Cost"
            value={`$${data.totalCostAverage}`}
            icon={<DollarSign className="w-6 h-6" />}
          />
          <StatCard
            title="Total Orders"
            value={data.totalOrders}
            icon={<ShoppingCart className="w-6 h-6" />}
          />
          <StatCard
            title="Average Reorder Point"
            value={data.reorderPointAverage}
            icon={<AlertTriangle className="w-6 h-6" />}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Highest EOQ Product"
            value={data.mostEOQProduct.name}
            icon={<TrendingUp className="w-6 h-6" />}
          />
          <StatCard
            title="Lowest EOQ Product"
            value={data.leastEOQProduct.name}
            icon={<TrendingDown className="w-6 h-6" />}
          />
          <StatCard
            title="Total Inventory Value"
            value={`$${data.totalInventoryValue}`}
            icon={<Warehouse className="w-6 h-6" />}
          />
        </div>

        <ProductTable products={data.criticalStockProducts} />
      </div>
    </div>
  );
}