'use client'

import { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import {readAllProducts} from "../../firebase/productsController"
import { useSessionStore } from '@/store/sessionStore'
interface Product {
  codeProduct: string
  name: string
  price: number
  cost: number
  demand: number
  leadtime: number
  holdingCost: number
  orderCost: number
  stock: number
  eoq: {
    economicOrderQuantity: number
    numOrders: number
    totalCost: number
    reorderPoint: number
  }
}

const sampleProducts: Product[] = []

export default function Component() {
  const { session } = useSessionStore()
  const [products, setProducts] = useState<Product[]>(sampleProducts)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.codeProduct.toLowerCase().includes(searchTerm.toLowerCase())
  )

  useEffect(() => {
    // Función asincrónica para la petición a la base de datos
    const fetchProducts = async () => {
      try {
        const data = await readAllProducts(session.uid);
        console.log(data);

        // Convertir los datos en un array de productos
        const productsArray = Object.entries(data).map(([productId, productData]) => ({
          codeProduct: productId,
          name: productData.name,
          price: productData.price,
          cost: productData.cost,
          demand: productData.demand,
          leadtime: productData.leadtime,
          holdingCost: productData.holdingCost,
          orderCost: productData.orderCost,
          stock: productData.stock,
          eoq: {
            economicOrderQuantity: productData.eoq.economicOrderQuantity,
            numOrders: productData.eoq.numOrders,
            totalCost: productData.eoq.totalCost,
            reorderPoint: productData.eoq.reorderPoint
          }
        }));

        // Actualizar el estado solo una vez con el array de productos
        setProducts(productsArray);
      } catch (error) {
        console.error(error);
      }
    };

    // Ejecutar la función una vez
    if (session.uid) {
      fetchProducts();
    }
  }, [session.uid]); 

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Productos Listados</h1>
      <div className="mb-4">
        <Label htmlFor="search">Busqueda de Productos</Label>
        <Input
          id="search"
          placeholder="Buscar por nombre o código"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Mobile view */}
      <div className="md:hidden space-y-4">
        {filteredProducts.map((product) => (
          <Card key={product.codeProduct}>
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <div className="space-y-2">
                  <p><strong>Codigo:</strong> {product.codeProduct}</p>
                  <p><strong>Precio:</strong> S/.{product.price.toFixed(2)}</p>
                  <p><strong>Costo:</strong> S/.{product.cost.toFixed(2)}</p>
                  <p><strong>Demanda Anual:</strong> {product.demand}</p>
                  <p><strong>Tiempo de espera:</strong> {product.leadtime}</p>
                  <p><strong>Costo de mantenimiento:</strong> S/.{product.holdingCost.toFixed(2)}</p>
                  <p><strong>Costo de orden:</strong> S/.{product.orderCost.toFixed(2)}</p>
                  <p><strong>Stock:</strong> {product.stock}</p>
                  <p><strong>EOQ:</strong> {product.eoq.economicOrderQuantity}</p>
                  <p><strong># Ordenes:</strong> {product.eoq.numOrders}</p>
                  <p><strong>Costo total:</strong> S/.{product.eoq.totalCost.toFixed(2)}</p>
                  <p><strong>Punto de reorden:</strong> {product.eoq.reorderPoint}</p>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop view */}
      <div className="hidden md:block">
        <Card>
          <CardContent>
            <ScrollArea >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Codigo</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Costo</TableHead>
                    <TableHead>Demanda</TableHead>
                    <TableHead>Tiempo de espera</TableHead>
                    <TableHead>Costo mantenimiento</TableHead>
                    <TableHead>Costo de orden</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>EOQ</TableHead>
                    <TableHead># Ordenes</TableHead>
                    <TableHead>Costo Total</TableHead>
                    <TableHead>Punto de reorden</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.codeProduct}>
                      <TableCell>{product.codeProduct}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>S/.{product.price.toFixed(2)}</TableCell>
                      <TableCell>S/.{product.cost.toFixed(2)}</TableCell>
                      <TableCell>{product.demand}</TableCell>
                      <TableCell>{product.leadtime}</TableCell>
                      <TableCell>S/.{product.holdingCost.toFixed(2)}</TableCell>
                      <TableCell>S/.{product.orderCost.toFixed(2)}</TableCell>
                      <TableCell>{product.stock}</TableCell>
                      <TableCell>{product.eoq.economicOrderQuantity}</TableCell>
                      <TableCell>{product.eoq.numOrders}</TableCell>
                      <TableCell>S/.{product.eoq.totalCost.toFixed(2)}</TableCell>
                      <TableCell>{product.eoq.reorderPoint}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}