import { set, ref ,get} from "firebase/database";
import { getFirebaseDb } from "../firebase/firebase.js";
import { v4 as uuidv4 } from 'uuid';
import { updateStockRest } from "../firebase/productsController.js";
import { updateStockAdd } from "../firebase/productsController.js";
const db = getFirebaseDb();

// crud para ventas

export async function writeSale(companie,informationProduct,total,namebuyer,dnibuyer){
    try { 
        let codesale = uuidv4();
        const fecha_actual = new Date();
        // recorremos informationProduct para actualizar el stock de cada producto
        informationProduct.forEach(async (product) => {
            await updateStockRest(companie,product.codeProduct,product.quantity);
        });

        await set(ref(db,'users/'+companie+'/sales/'+codesale),{
            codesale: codesale,
            date: fecha_actual.toLocaleString('es-PE'),
            informationSale: informationProduct,
            totalSale: total,
            namebuyer: namebuyer,
            dnibuyer: dnibuyer
        });
        console.log("Sale write succesfuly")
    }
    catch (error) {
        console.error("Error saving sale data: ", error);
    }
}

// funcion para leer una venta

export async function readSale(companie,codesale){
    const saleRFC = ref(db,'users/'+companie+'/sales/'+codesale);
    try {
        const snapshot = await get(saleRFC);
        let data = snapshot.val();
        return data;
    } catch (error) {
        console.error(error);
    }
}

// funcion para leer todas las ventas de una compañia

export async function readAllSales(companie){
    try {
        const sales = ref(db,'users/'+companie+'/sales');
        const snapshot = await get(sales);
        let data = snapshot.val();
        return data;
    } catch (error) {
        console.error(error);
    }
}

// funcion para eliminar una venta

export async function deleteSale(companie,codesale){

    try {
        const sale = await readSale(companie,codesale);
        // recorremos informationProduct para actualizar el stock de cada producto
        console.log(sale);
        sale.informationSale.forEach(async (product) => {
            await updateStockAdd(companie,product.codeProduct,product.quantity);
        });
        await set(ref(db,'users/'+companie+'/sales/'+codesale),null);
        console.log("Sale deleted successfully.");
    } catch (error) {
        console.error("Error deleting sale: ", error);
    }
}

// funcion para actualizar una venta

export async function updateSale(companie,codesale,informationProduct,total,namebuyer,dnibuyer){
    try {
        // recorremos informationProduct para actualizar el stock de cada producto
        const sale = await readSale(companie,codesale);
        sale.informationSale.forEach(async (product) => {
            await updateStockAdd(companie,product.codeProduct,product.quantity);
        });
        informationProduct.forEach(async (product) => {
            await updateStockRest(companie,product.codeProduct,product.quantity);
        });
        await set(ref(db,'users/'+companie+'/sales/'+codesale),{
            codesale: codesale,
            date: sale.date,
            informationSale: informationProduct,
            totalSale: total,
            namebuyer: namebuyer,
            dnibuyer: dnibuyer
        });
        console.log("Sale updated successfully.");
    } catch (error) {
        console.error("Error updating sale: ", error);
    }
}

// await writeSale('1',[
//     {
//     'codeProduct':'21d9e9ad-c967-46f3-b404-7afefb4057c3',
//     'quantity':20,
//     'subtotal':120.30
//     },
//     {
//     'codeProduct':'89f51a0e-4a5a-41b2-94ad-ac801eb690db',
//     'quantity':50,
//     'subtotal':120.30
//     }
// ],500,'Juan Perez','12345678')

// await deleteSale('1','78966017-ac09-463f-92e2-8e1cd8b291db')

// console.log(await readSale('1','78966017-ac09-463f-92e2-8e1cd8b291db'))