import { set, ref ,get} from "firebase/database";
import { getFirebaseDb } from "./firebase.js";
import { v4 as uuidv4 } from 'uuid';
const db = getFirebaseDb();


export async function writeProduct(companie,name,price,cost,demand,leadtime,holdingCost,orderCost,stock){
    try {
        let codeProduct = uuidv4();
        await set(ref(db, 'users/'+ companie + '/' + 'products/' + codeProduct), {
            codeProduct: codeProduct,
            name: name,
            price: price,
            cost: cost,
            demand: demand,
            leadtime: leadtime,
            holdingCost: holdingCost,
            orderCost: orderCost,
            stock: stock,
            eoq:{
                economicOrderQuantity: Math.sqrt((2*demand*orderCost)/holdingCost),
                numOrders: demand/Math.sqrt((2*demand*orderCost)/holdingCost),
                totalCost: (demand*Math.sqrt((2*demand*orderCost)/holdingCost)*holdingCost)/2 + (demand/orderCost)*orderCost,
                reorderPoint: demand*leadtime
            }

        });
        console.log("Product data saved successfully.");
    } catch (error) {
        console.error("Error saving product data: ", error);
    }
}

export async function readProduct(companie,codeProduct) {
    const productRFC = ref(db, 'users/'+ companie + '/' + 'products/' + codeProduct);
    try {
        const snapshot = await get(productRFC);
        let data = snapshot.val();
        return data;
    } catch (error) {
        console.error(error);
    }
}

export function deleteProduct(companie,codeProduct) {
    set(ref(db, 'users/'+ companie + '/' + 'products/' + codeProduct), null);
}

// funcion para leer todos los productos de una compañia

export async function readAllProducts(companie) {
    try {
        const products = ref(db, 'users/'+ companie + '/' + 'products');
        const snapshot = await get(products);
        let data = snapshot.val();
        return data;
    } catch (error) {
        console.error(error);
    }
}

// funcion para actualizar un producto

export async function updateProduct(companie,codeProduct,name,price,cost,demand,leadtime,holdingCost,orderCost,stock){
    try {
        await set(ref(db, 'users/'+ companie + '/' + 'products/' + codeProduct), {
            codeProduct: codeProduct,
            name: name,
            price: price,
            cost: cost,
            demand: demand,
            leadtime: leadtime,
            holdingCost: holdingCost,
            orderCost: orderCost,
            stock: stock,
            eoq:{
                economicOrderQuantity: Math.sqrt((2*demand*orderCost)/holdingCost),
                numOrders: demand/Math.sqrt((2*demand*orderCost)/holdingCost),
                totalCost: (demand*Math.sqrt((2*demand*orderCost)/holdingCost)*holdingCost)/2 + (demand/orderCost)*orderCost,
                reorderPoint: demand*leadtime
            }
        });
        console.log("Product data updated successfully.");
    } catch (error) {
        console.error("Error updating product data: ", error);
    }
}

// funcion para actualizar el stock de un producto cuando se realiza una venta

export async function updateStockRest(companie,codeProduct,quantity){
    try {
        const product = await readProduct(companie,codeProduct);
        let newStock = product.stock - quantity;
        await set(ref(db, 'users/'+ companie + '/' + 'products/' + codeProduct), {
            codeProduct: codeProduct,
            name: product.name,
            price: product.price,
            cost: product.cost,
            demand: product.demand,
            leadtime: product.leadtime,
            holdingCost: product.holdingCost,
            orderCost: product.orderCost,
            stock: newStock,
            eoq:{
                economicOrderQuantity: Math.sqrt((2*product.demand*product.orderCost)/product.holdingCost),
                numOrders: product.demand/Math.sqrt((2*product.demand*product.orderCost)/product.holdingCost),
                totalCost: (product.demand*Math.sqrt((2*product.demand*product.orderCost)/product.holdingCost)*product.holdingCost)/2 + (product.demand/product.orderCost)*product.orderCost,
                reorderPoint: product.demand*product.leadtime
            }
        });
        console.log("Stock updated successfully.");
    } catch (error) {
        console.error("Error updating stock: ", error);
    }
}

// funcion para actualizar el stock de un producto cuando se elimina una venta

export async function updateStockAdd(companie,codeProduct,quantity){
    try {
        const product = await readProduct(companie,codeProduct);
        let newStock = product.stock + quantity;
        await set(ref(db, 'users/'+ companie + '/' + 'products/' + codeProduct), {
            codeProduct: codeProduct,
            name: product.name,
            price: product.price,
            cost: product.cost,
            demand: product.demand,
            leadtime: product.leadtime,
            holdingCost: product.holdingCost,
            orderCost: product.orderCost,
            stock: newStock,
            eoq:{
                economicOrderQuantity: Math.sqrt((2*product.demand*product.orderCost)/product.holdingCost),
                numOrders: product.demand/Math.sqrt((2*product.demand*product.orderCost)/product.holdingCost),
                totalCost: (product.demand*Math.sqrt((2*product.demand*product.orderCost)/product.holdingCost)*product.holdingCost)/2 + (product.demand/product.orderCost)*product.orderCost,
                reorderPoint: product.demand*product.leadtime
            }
        });
        console.log("Stock updated successfully.");
    } catch (error) {
        console.error("Error updating stock: ", error);
    }
}

// await writeProduct('1','product3',100,50,100,1,1,1,200);

// console.log(await readAllProducts('1'));

// await updateStock('1','5f26f3da-8234-490d-b552-27629447c69e',10);

// await writeProduct('jEcZIHprxEfzy3yMa9sAwgpkjlY2', 'Product1', 100, 50, 500, 2, 2, 10, 300);
// await writeProduct('jEcZIHprxEfzy3yMa9sAwgpkjlY2', 'Product2', 80, 40, 600, 1, 1, 8, 400);
// await writeProduct('jEcZIHprxEfzy3yMa9sAwgpkjlY2', 'Product3', 150, 70, 300, 3, 3, 12, 250);
// await writeProduct('jEcZIHprxEfzy3yMa9sAwgpkjlY2', 'Product4', 120, 60, 400, 2, 2.5, 9, 350);
// await writeProduct('jEcZIHprxEfzy3yMa9sAwgpkjlY2', 'Product5', 200, 100, 700, 4, 4, 15, 500);
// await writeProduct('jEcZIHprxEfzy3yMa9sAwgpkjlY2', 'Product6', 50, 25, 900, 1, 1.5, 5, 600);
// await writeProduct('jEcZIHprxEfzy3yMa9sAwgpkjlY2', 'Product7', 300, 150, 200, 5, 5, 20, 150);
// await writeProduct('jEcZIHprxEfzy3yMa9sAwgpkjlY2', 'Product8', 75, 35, 800, 1, 1, 6, 450);
// await writeProduct('jEcZIHprxEfzy3yMa9sAwgpkjlY2', 'Product9', 90, 45, 600, 2, 2, 7, 400);
// await writeProduct('jEcZIHprxEfzy3yMa9sAwgpkjlY2', 'Product10', 250, 120, 300, 3, 3.5, 14, 200);
