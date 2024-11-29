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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">EOQ Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="EOQ Promedio"
            value={data.eoqAverage}
            icon={<Package className="w-6 h-6" />}
            tooltip="Nivel óptimo de unidades que debería pedir cada vez que realiza un pedido para minimizar los costos totales asociados al inventario."
          />
          <StatCard
            title="Promedio de Costo Total"
            value={`s/.${data.totalCostAverage}`}
            icon={<DollarSign className="w-6 h-6" />}
            tooltip='Costo promedio total de mantener el inventario y realizar pedidos de reposición de productos.'
          />
          <StatCard
            title="Total de Pedidos"
            value={data.totalOrders.toPrecision(4)}
            icon={<ShoppingCart className="w-6 h-6" />}
          />
          <StatCard
            title="Punto de Reorden Promedio"
            value={data.reorderPointAverage}
            icon={<AlertTriangle className="w-6 h-6" />}
            tooltip="El nivel de inventario en el que debería realizar un nuevo pedido para evitar quedarse sin producto antes de que llegue el siguiente lote."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Producto con mayor EOQ"
            value={data.mostEOQProduct.name}
            icon={<TrendingUp className="w-6 h-6" />}
            tooltip='Producto con mayor impacto positivo en la rentabilidad del negocio al ser repuesto.'
          />
          <StatCard
            title="Producto con menor EOQ"
            value={data.leastEOQProduct.name}
            icon={<TrendingDown className="w-6 h-6" />}
            tooltip='Producto con menor impacto en la rentabilidad del negocio al ser repuesto.'
          />
          <StatCard
            title="Valor Total del Inventario"
            value={`s/.${data.totalInventoryValue}`}
            icon={<Warehouse className="w-6 h-6" />}
          />
        </div>

        <ProductTable products={data.criticalStockProducts} />
      </div>
    </div>
  );
}