'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ChevronDown, ChevronUp, Search, X } from 'lucide-react'
import { useSessionStore } from '@/store/sessionStore'
import {readAllSales} from '../../../firebase/salesController'
interface SaleItem {
  product: string
  quantity: number
  price: number
    subtotal: number
}

interface Sale {
  id: string
  date: string
  buyerName: string
  buyerDNI: string
  total: number
  items: SaleItem[]
}

const sampleSales: Sale[] = [
  // Add more sample sales as needed
]

export default function Component() {
  const { session } = useSessionStore()
  const [sales, setSales] = useState<Sale[]>(sampleSales)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState<{ key: keyof Sale; direction: 'ascending' | 'descending' } | null>(null)
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null)


  const handleSort = (key: keyof Sale) => {
    let direction: 'ascending' | 'descending' = 'ascending'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  const sortedSales = [...sales].sort((a, b) => {
    if (!sortConfig) return 0
    const { key, direction } = sortConfig
    if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1
    if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1
    return 0
  })

  const filteredSales = sortedSales.filter(sale =>
    sale.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.buyerDNI.includes(searchTerm) ||
    sale.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  useEffect(()=>{
    const fetchSales = async () => {
        try {
            const sales_pivot = await readAllSales(session.uid)
            console.log(sales_pivot)
            const sales = Object.entries(sales_pivot).map(([saleId, saleData]) => ({
                id: saleId,
                date: saleData.date,
                buyerName: saleData.namebuyer,
                buyerDNI: saleData.dnibuyer,
                total: saleData.totalSale,
                items: Object.entries(saleData.informationSale).map(([productId, productData]) => ({
                    product: productData.product.name,
                    quantity: productData.quantity,
                    price: productData.subTotal / productData.quantity,
                    subtotal: productData.subTotal
                }))
            }));
            setSales(sales)
            console.log(sales)
        }
        catch (error) {
            console.log(error)
        }
    }
    // asegurarnos que solo se ejecute una vez
    if (session.uid) {
        fetchSales();
      }
    }, [session.uid]); 

  return (
    <ScrollArea className="h-[100vh] w-full">
      <div className="container mx-auto px-4 py-8">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl sm:text-3xl">Lista de Ventas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por ID, fecha o comprador"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Button variant="outline" onClick={() => setSearchTerm('')}>
                Limpiar
              </Button>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">
                      <Button variant="ghost" onClick={() => handleSort('id')}>
                        ID
                        {sortConfig?.key === 'id' && (
                          sortConfig.direction === 'ascending' ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />
                        )}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => handleSort('date')}>
                        Fecha
                        {sortConfig?.key === 'date' && (
                          sortConfig.direction === 'ascending' ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />
                        )}
                      </Button>
                    </TableHead>
                    <TableHead>Comprador</TableHead>
                    <TableHead className="text-right">
                      <Button variant="ghost" onClick={() => handleSort('total')}>
                        Total
                        {sortConfig?.key === 'total' && (
                          sortConfig.direction === 'ascending' ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />
                        )}
                      </Button>
                    </TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell className="font-medium">{sale.id}</TableCell>
                      <TableCell>{sale.date}</TableCell>
                      <TableCell>
                        <div>{sale.buyerName}</div>
                        <div className="text-sm text-muted-foreground">DNI: {sale.buyerDNI}</div>
                      </TableCell>
                      <TableCell className="text-right">S/.{sale.total.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedSale(sale)}>
                              Ver detalles
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Detalles venta</DialogTitle>
                            </DialogHeader>
                            {selectedSale && (
                              <div className="mt-4">
                                <h3 className="font-semibold">ID venta: {selectedSale.id}</h3>
                                <p>Fecha: {selectedSale.date}</p>
                                <p>Comprador: {selectedSale.buyerName}</p>
                                <p>DNI: {selectedSale.buyerDNI}</p>
                                <h4 className="font-semibold mt-4 mb-2">Items:</h4>
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Producto</TableHead>
                                      <TableHead className="text-right">Cantidad</TableHead>
                                      <TableHead className="text-right">Precio</TableHead>
                                      <TableHead className="text-right">Subtotal</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {selectedSale.items.map((item, index) => (
                                      <TableRow key={index}>
                                        <TableCell>{item.product}</TableCell>
                                        <TableCell className="text-right">{item.quantity}</TableCell>
                                        <TableCell className="text-right">S/.{item.price.toFixed(2)}</TableCell>
                                        <TableCell className="text-right">S/.{(item.quantity * item.price).toFixed(2)}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                                <p className="mt-4 text-right font-semibold">Total: S/.{selectedSale.total.toFixed(2)}</p>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {filteredSales.length === 0 && (
              <div className="text-center py-4 text-muted-foreground">
                No se encontraron ventas
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  )
}