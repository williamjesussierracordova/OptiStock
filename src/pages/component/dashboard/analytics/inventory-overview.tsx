"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function InventoryOverview({ totalProducts }: { totalProducts: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cantidad total de productos</CardTitle>
        <CardDescription>Número de productos almacenados en la base de datos</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-bold">{totalProducts}</p>
      </CardContent>
    </Card>
  )
}
