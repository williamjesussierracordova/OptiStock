"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type Product = {
  name: string
  sales: number
}

export default function TopSellingProducts({ products }: { products: Product[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Productos más vendidos</CardTitle>
        <CardDescription>Con base en la demanda o ventas asociadas</CardDescription>
      </CardHeader>
      <CardContent>
        <ul>
          {products.map((product, index) => (
            <li key={index} className="flex justify-between mb-2">
              <span>{product.name}</span>
              <span className="font-semibold">{product.sales} ventas</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

