'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useSessionStore } from '@/store/sessionStore'
import { readAllProducts } from '../../../firebase/productsController'
import { BadgeCheck, Ban } from 'lucide-react'
import { AlertDescription, AlertTitle } from '@/components/ui/alert'
import { IoMdClose } from 'react-icons/io'
import { writeSale } from '../../../firebase/salesController'

interface Product {
  codeProduct: string
  name: string
  price: number
  stock: number
}

interface SaleItem {
  product: Product
  codeProduct: string
  quantity: number
  subTotal: number
}

const sampleProducts: Product[] = [
]

export default function Component() {
  const [products,setProducts] = useState<Product[]>(sampleProducts)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState<number>(1)
  const [saleItems, setSaleItems] = useState<SaleItem[]>([])
  const [total, setTotal] = useState<number>(0)
  const [nameBuyer, setNameBuyer] = useState<string>('')
  const [dniBuyer, setDniBuyer] = useState<string>('')
  const { session} = useSessionStore()
  const [ message, setMessage ] = useState<string>('')
  const [ errors, setErrors ] = useState(false)
  const [ valid, setValid ] = useState(false)

  useEffect(() => {
    const newTotal = saleItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    setTotal(newTotal)
    console.log(saleItems)
  }, [saleItems])

  useEffect(() => {
    // Función asincrónica para la petición a la base de datos
    const fetchProducts = async () => {
      try {
        const data = await readAllProducts(session.uid);

        // Convertir los datos en un array de productos
        const productsArray = Object.entries(data).map(([productId, productData]) => ({
            codeProduct: productId,
            name: productData.name,
            price: productData.price,
            stock: productData.stock,
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

  const handleAddProduct = () => {
    // check if the stock of the product is enough
    if (selectedProduct && quantity > selectedProduct.stock) {
      setMessage('No hay suficiente stock para este producto, el stock total es de ' + selectedProduct.stock)
      setErrors(true)
      setValid(false)
      return
    }

    if (selectedProduct && quantity > 0) {
      setSaleItems(prevItems => {
        const existingItemIndex = prevItems.findIndex(item => item.product.codeProduct === selectedProduct.codeProduct)
        // if the product is already in the cart , verify if whith the new quantity the stock is enough
        if (existingItemIndex !== -1 && prevItems[existingItemIndex].quantity + quantity > selectedProduct.stock) {
          setMessage('No hay suficiente stock para este producto, el stock total es de ' + selectedProduct.stock)
          setErrors(true)
          setValid(false)
          return prevItems
        }
        if (existingItemIndex !== -1) {
          const updatedItems = [...prevItems]
          updatedItems[existingItemIndex].quantity += quantity
          return updatedItems
        } else {
          return [...prevItems, { product:selectedProduct,codeProduct:selectedProduct.codeProduct,subTotal:selectedProduct.price*quantity ,quantity: quantity }]
        }
      })
      setSelectedProduct(null)
      setQuantity(1)
    }
  }

  const handleRemoveProduct = (codeProduct: string) => {
    setSaleItems(prevItems => prevItems.filter(item => item.product.codeProduct !== codeProduct))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the sale data to your backend
    try {
      // enviamos la data a la base de datos de firebase 
      await writeSale(session.uid, saleItems,total, nameBuyer, dniBuyer)
      setMessage('Venta registrada con éxito')
      setErrors(false)
      setValid(true)
      setSaleItems([])
      setTotal(0)
      setNameBuyer('')
      setDniBuyer('')
    }
    catch (error) {
      console.log(error)
      setMessage('Error al registrar la venta')
      setErrors(true)
      setValid(false)
    }
    console.log('Sale data:', { saleItems, total, nameBuyer, dniBuyer })
    // You can add logic here to show a success message or handle errors
  }

  return (
    <>
    <ScrollArea className="h-[100vh] w-full">
      <div className="container mx-auto px-4 py-8">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl sm:text-3xl">Registrar Venta</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="product-select">Seleccionar producto</Label>
                  <Select onValueChange={(value) => setSelectedProduct(products.find(p => p.codeProduct === value) || null)}>
                    <SelectTrigger id="product-select">
                      <SelectValue placeholder="Seleccionar un producto" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.codeProduct} value={product.codeProduct}>
                          {product.name} (S/.{product.price.toFixed(2)})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Cantidad</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    min="1"
                    max={selectedProduct?.stock || 1}
                  />
                </div>
              </div>
              <Button 
                type="button" 
                onClick={handleAddProduct} 
                disabled={!selectedProduct}
                className="w-full sm:w-auto"
              >
                Agregar
              </Button>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40%]">Producto</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead>Cantidad</TableHead>
                      <TableHead>Subtotal</TableHead>
                      <TableHead className="text-right">Acción</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {saleItems.map((item) => (
                      <TableRow key={item.product.codeProduct}>
                        <TableCell className="font-medium">{item.product.name}</TableCell>
                        <TableCell>S/.{item.product.price.toFixed(2)}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>S/.{(item.product.price * item.quantity).toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemoveProduct(item.product.codeProduct)}
                          >
                            Eliminar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="text-right text-lg font-semibold">
                Total: S/.{total.toFixed(2)}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nameBuyer">
                    Nombre del Comprador
                  </Label>
                  <Input
                    id="nameBuyer"
                    value={nameBuyer}
                    onChange={(e) => setNameBuyer(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dniBuyer">DNI comprador</Label>
                  <Input
                    id="dniBuyer"
                    value={dniBuyer}
                    onChange={(e) => setDniBuyer(e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full sm:w-auto sm:ml-auto" 
                disabled={saleItems.length === 0}
              >
                Registrar Venta
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </ScrollArea>
    {errors  && (
                    <div className="fixed bottom-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-lg">
                        <div className="flex items-start">
                            <Ban className="h-5 w-5 mr-2" />
                            <div>
                                <AlertTitle className="font-bold">
                                    Producto no agregado
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
      {valid  && (
                    <div className="fixed bottom-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-lg">
                        <div className="flex items-start">
                            <BadgeCheck className="h-5 w-5 mr-2" />
                            <div>
                                <AlertTitle className="font-bold">
                                    Venta registrada
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
    </>
  )
}