"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type Product = {
  name: string
  stock: number
}

export default function LowStockProducts({ products }: { products: Product[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Productos con bajo stock</CardTitle>
        <CardDescription>Productos cuyo stock está por debajo de un umbral crítico</CardDescription>
      </CardHeader>
      <CardContent>
        <ul>
          {products.map((product, index) => (
            <li key={index} className="flex justify-between mb-2">
              <span>{product.name}</span>
              <span className="font-semibold text-red-500">{product.stock} en stock</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

