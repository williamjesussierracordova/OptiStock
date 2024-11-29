"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type InventoryStatsProps = {
  averageCost: number
  totalValue: number
  averageLeadTime: number
}

export default function InventoryStats({ averageCost, totalValue, averageLeadTime }: InventoryStatsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Estadísticas de Inventario</CardTitle>
        <CardDescription>Resumen de costos y tiempos de entrega</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <h3 className="font-semibold mb-1">Costo promedio por producto</h3>
            <p className="text-2xl font-bold">${averageCost.toFixed(2)}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Valor total del inventario</h3>
            <p className="text-2xl font-bold">${totalValue.toLocaleString()}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Tiempo promedio de entrega</h3>
            <p className="text-2xl font-bold">{averageLeadTime} días</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

