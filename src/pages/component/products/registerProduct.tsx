'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {writeProduct} from '../../../firebase/productsController'
import { useSessionStore } from '@/store/sessionStore'
import { BadgeCheck, Ban } from 'lucide-react'
import { AlertDescription, AlertTitle } from '@/components/ui/alert'
import { IoMdClose } from 'react-icons/io'

interface ProductData {
  name: string
  price: number
  cost: number
  demand: number
  leadtime: number
  holdingCost: number
  orderCost: number
  stock: number
}

export default function RegisterProductComponent() {
  const { session } = useSessionStore()
  const [product, setProduct] = useState<ProductData>({
    name: '',
    price: 0,
    cost: 0,
    demand: 0,
    leadtime: 0,
    holdingCost: 0,
    orderCost: 0,
    stock: 0
  })
  const [errors, setErrors] = useState(false)
  const [valid, setValid] = useState(false)
  const message = valid ? 'Producto registrado con éxito' : 'Error al registrar el producto'

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProduct(prev => ({
      ...prev,
      [name]: name === 'name' ? value : Number(value)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the product data to your backend
    try{
      await writeProduct(
        session.uid,
        product.name,
        product.price,
        product.cost,
        product.demand,
        product.leadtime,
        product.holdingCost,
        product.orderCost,
        product.stock
      )
      setErrors(false)
      setValid(true)
      setProduct({
        name: '',
        price: 0,
        cost: 0,
        demand: 0,
        leadtime: 0,
        holdingCost: 0,
        orderCost: 0,
        stock: 0
      })
    }
    catch (error){
      setErrors(true)
      setValid(false)
      console.log('Error:', error)
    }
    console.log('Product data:', product)
    // You can add logic here to show a success message or handle errors
  }

  return (
    <>
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          Registro de Producto
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                name="name"
                value={product.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Precio</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={product.price}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cost">Costo</Label>
              <Input
                id="cost"
                name="cost"
                type="number"
                value={product.cost}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="demand">Demanda Anual</Label>
              <Input
                id="demand"
                name="demand"
                type="number"
                value={product.demand}
                onChange={handleInputChange}
                required
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="leadtime">
                Tiempo de Entrega (días)
              </Label>
              <Input
                id="leadtime"
                name="leadtime"
                type="number"
                value={product.leadtime}
                onChange={handleInputChange}
                required
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="holdingCost">
                Costo de Mantenimiento
              </Label>
              <Input
                id="holdingCost"
                name="holdingCost"
                type="number"
                value={product.holdingCost}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="orderCost">
                Costo de Ordenar
              </Label>
              <Input
                id="orderCost"
                name="orderCost"
                type="number"
                value={product.orderCost}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">
                Inventario Inicial
              </Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                value={product.stock}
                onChange={handleInputChange}
                required
                min="0"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="ml-auto">Registrar Producto</Button>
        </CardFooter>
      </form>
    </Card>
    {valid  && (
                    <div className="fixed bottom-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-lg">
                        <div className="flex items-start">
                            <BadgeCheck className="h-5 w-5 mr-2" />
                            <div>
                                <AlertTitle className="font-bold">
                                    Producto registrado
                                </AlertTitle>
                                <AlertDescription className="text-pretty">
                                    {message}
                                </AlertDescription>
                            </div>
                            <button
                                className="ml-4 bg-transparent hover:bg-white"
                                onClick={() => {
                                    setErrors(false);
                                    setValid(false);
                                }}
                            >
                                <IoMdClose />
                            </button>
                        </div>
                    </div>
      )}
      {
        errors && (
          <div className="fixed bottom-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-lg">
              <div className="flex items-start">
                  <Ban className="h-5 w-5 mr-2" />
                  <div>
                      <AlertTitle className="font-bold">
                          Error al registrar el producto
                      </AlertTitle>
                      <AlertDescription className="text-pretty">
                          {message}
                      </AlertDescription>
                  </div>
                  <button
                      className="ml-4 bg-transparent hover:bg-white"
                      onClick={() => {
                          setErrors(false);
                          setValid(false);
                      }}
                  >
                      <IoMdClose />
                  </button>
              </div>
          </div>
        )
      }
    </>
  )
}