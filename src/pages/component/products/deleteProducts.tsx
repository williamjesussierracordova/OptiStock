'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect } from 'react'
import { useSessionStore } from '@/store/sessionStore'
import { readAllProducts } from "../../../firebase/productsController"
import { updateProduct } from "../../../firebase/productsController"
import {deleteProduct} from "../../../firebase/productsController"
import { BadgeCheck, Ban } from 'lucide-react'
import { AlertDescription, AlertTitle } from '@/components/ui/alert'
import { IoMdClose } from 'react-icons/io'

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

const sampleProducts: Product[] = [
]

export default function Component() {
    const { session } = useSessionStore()
    const [products, setProducts] = useState<Product[]>(sampleProducts)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
    const [valid, setValid] = useState(false)
    const [error, setError] = useState(false)
    const message = valid ? 'Producto eliminado con éxito' : 'Error al eliminar el producto'

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.codeProduct.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleProductSelect = (codeProduct: string) => {
        const product = products.find(p => p.codeProduct === codeProduct)
        setSelectedProduct(product || null)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        if (selectedProduct) {
            if (name.includes('.')) {
                const [parent, child] = name.split('.')
                setSelectedProduct(prev => ({
                    ...prev,
                    [parent]: {
                        ...prev[parent as keyof Product],
                        [child]: Number(value)
                    }
                }))
            } else {
                setSelectedProduct(prev => ({
                    ...prev,
                    [name]: name === 'name' || name === 'codeProduct' ? value : Number(value)
                }))
            }
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (selectedProduct) {
            try {
                deleteProduct(session.uid,selectedProduct.codeProduct)
                // Here you would typically send the updated product data to your backend
                console.log('Updated product:', selectedProduct)
                setValid(true)
                setError(false)
                // Update the products list with the edited product
                fetchProducts()
                // You can add logic here to show a success message or handle errors
            }
            catch (error) {
                console.error(error);
                setValid(false)
                setError(true)
            }

        }
    }

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

    useEffect(() => {
        // Función asincrónica para la petición a la base de datos
        // Ejecutar la función una vez
        if (session.uid) {
            fetchProducts();
        }
    }, [session.uid]);

    return (
        <>
        <ScrollArea className="h-[100vh] w-full">
            <div className="container mx-auto px-4 py-8">
                <Card className="w-full max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle>Eliminar Producto</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="search">Buscar Producto</Label>
                            <Input
                                id="search"
                                placeholder="Buscar por nombre o código"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="product-select">Seleccionar Producto</Label>
                            <Select onValueChange={handleProductSelect}>
                                <SelectTrigger id="product-select">
                                    <SelectValue placeholder="Seleccionar Producto" />
                                </SelectTrigger>
                                <SelectContent>
                                    {filteredProducts.map((product) => (
                                        <SelectItem key={product.codeProduct} value={product.codeProduct}>
                                            {product.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {selectedProduct && (
                            <form onSubmit={handleSubmit}>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="codeProduct">Codigo de Producto</Label>
                                            <Input
                                                id="codeProduct"
                                                name="codeProduct"
                                                value={selectedProduct.codeProduct}
                                                onChange={handleInputChange}
                                                required
                                                disabled
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Nombre</Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                value={selectedProduct.name}
                                                onChange={handleInputChange}
                                                required
                                                disabled
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="price">Precio</Label>
                                            <Input
                                                id="price"
                                                name="price"
                                                type="number"
                                                value={selectedProduct.price}
                                                onChange={handleInputChange}
                                                required
                                                min="0"
                                                step="0.01"
                                                disabled
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="cost">Costo</Label>
                                            <Input
                                                id="cost"
                                                name="cost"
                                                type="number"
                                                value={selectedProduct.cost}
                                                onChange={handleInputChange}
                                                required
                                                min="0"
                                                step="0.01"
                                                disabled
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="demand">Demanda</Label>
                                            <Input
                                                id="demand"
                                                name="demand"
                                                type="number"
                                                value={selectedProduct.demand}
                                                onChange={handleInputChange}
                                                required
                                                min="0"
                                                disabled
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="leadtime">Tiempo de espera</Label>
                                            <Input
                                                id="leadtime"
                                                name="leadtime"
                                                type="number"
                                                value={selectedProduct.leadtime}
                                                onChange={handleInputChange}
                                                required
                                                min="0"
                                                disabled
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="holdingCost">Costo mantenimiento</Label>
                                            <Input
                                                id="holdingCost"
                                                name="holdingCost"
                                                type="number"
                                                value={selectedProduct.holdingCost}
                                                onChange={handleInputChange}
                                                required
                                                min="0"
                                                step="0.01"
                                                disabled
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="orderCost">Costo de ordenar</Label>
                                            <Input
                                                id="orderCost"
                                                name="orderCost"
                                                type="number"
                                                value={selectedProduct.orderCost}
                                                onChange={handleInputChange}
                                                required
                                                min="0"
                                                step="0.01"
                                                disabled
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="stock">Stock</Label>
                                            <Input
                                                id="stock"
                                                name="stock"
                                                type="number"
                                                value={selectedProduct.stock}
                                                onChange={handleInputChange}
                                                required
                                                min="0"
                                                disabled
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-semibold">EOQ</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="eoq.economicOrderQuantity">
                                                    Cantidad Económica de Pedido (EOQ)
                                                </Label>
                                                <Input
                                                    id="eoq.economicOrderQuantity"
                                                    name="eoq.economicOrderQuantity"
                                                    type="number"
                                                    value={selectedProduct.eoq.economicOrderQuantity}
                                                    onChange={handleInputChange}
                                                    required
                                                    min="0"
                                                    disabled
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="eoq.numOrders">
                                                    Número de Ordenes
                                                </Label>
                                                <Input
                                                    id="eoq.numOrders"
                                                    name="eoq.numOrders"
                                                    type="number"
                                                    value={selectedProduct.eoq.numOrders}
                                                    onChange={handleInputChange}
                                                    required
                                                    min="0"
                                                    disabled
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="eoq.totalCost">
                                                    Costo Total
                                                </Label>
                                                <Input
                                                    id="eoq.totalCost"
                                                    name="eoq.totalCost"
                                                    type="number"
                                                    value={selectedProduct.eoq.totalCost}
                                                    onChange={handleInputChange}
                                                    required
                                                    min="0"
                                                    step="0.01"
                                                    disabled
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="eoq.reorderPoint">
                                                    Punto de Reorden
                                                </Label>
                                                <Input
                                                    id="eoq.reorderPoint"
                                                    name="eoq.reorderPoint"
                                                    type="number"
                                                    value={selectedProduct.eoq.reorderPoint}
                                                    onChange={handleInputChange}
                                                    required
                                                    min="0"
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <CardFooter className="px-0 pt-6">
                                    <Button type="submit" className="ml-auto">
                                        Eliminar Producto
                                    </Button>
                                </CardFooter>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </div>
        </ScrollArea>
        {valid  && (
                    <div className="fixed bottom-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-lg">
                        <div className="flex items-start">
                            <BadgeCheck className="h-5 w-5 mr-2" />
                            <div>
                                <AlertTitle className="font-bold">
                                    Producto Eliminado
                                </AlertTitle>
                                <AlertDescription className="text-pretty">
                                    {message}
                                </AlertDescription>
                            </div>
                            <button
                                className="ml-4 bg-transparent hover:bg-white"
                                onClick={() => {
                                    setValid(false);
                                }}
                            >
                                <IoMdClose />
                            </button>
                        </div>
                    </div>
      )}
      {error  && (
                    <div className="fixed bottom-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-lg">
                        <div className="flex items-start">
                            <Ban className="h-5 w-5 mr-2" />
                            <div>
                                <AlertTitle className="font-bold">
                                    Producto no Eliminado
                                </AlertTitle>
                                <AlertDescription className="text-pretty">
                                    {message}
                                </AlertDescription>
                            </div>
                            <button
                                className="ml-4 bg-transparent hover:bg-white"
                                onClick={() => {
                                    setError(false);
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