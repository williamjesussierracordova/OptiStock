import { set, ref ,get} from "firebase/database";
import { getFirebaseDb } from "./firebase.js";
const db = getFirebaseDb();

export async function getSalesData(codigoUsuario) {
    try {
      const salesRef = ref(db, 'users/'+ codigoUsuario +'/sales');
      const snapshot = await get(salesRef);
  
      if (!snapshot.exists()) {
        console.log("No sales data found.");
        return null;
      }
  
      const salesData = snapshot.val();
      const salesArray = Object.values(salesData);
  
      // Process the sales data
      const totalSales = salesArray.length;
      const totalRevenue = salesArray.reduce((sum, sale) => sum + sale.totalSale, 0);
      const averageSale = totalRevenue / totalSales || 0;
  
      // Sort sales by date (newest first)
      const sortedSales = salesArray.sort((a, b) => new Date(b.date) - new Date(a.date));
  
      // Most recent sale
      const mostRecentSale = sortedSales[0];
  
      // Last 5 sales
      const lastFiveSales = sortedSales.slice(0, 5);
  
      // Calculate buyer frequencies
      const buyersFrequency = salesArray.reduce((acc, sale) => {
        const buyerId = sale.dnibuyer;
        if (!acc[buyerId]) {
          acc[buyerId] = {
            count: 0,
            name: sale.namebuyer,
          };
        }
        acc[buyerId].count += 1;
        return acc;
      }, {});
  
      // Determine the most frequent buyer
      const mostFrequentBuyerEntry = Object.entries(buyersFrequency).reduce(
        (a, b) => (b[1].count > a[1].count ? b : a),
        ["", { count: 0, name: "" }]
      );
  
      const mostFrequentBuyer = {
        id: mostFrequentBuyerEntry[0],
        name: mostFrequentBuyerEntry[1].name,
        purchases: mostFrequentBuyerEntry[1].count,
      };
  
      return {
        totalSales,
        totalRevenue,
        averageSale: averageSale.toFixed(2),
        mostRecentSale,
        mostFrequentBuyer,
        lastFiveSales,
      };
    } catch (error) {
      console.error("Error fetching sales data:", error);
      return null;
    }
  }

export async function getSalesDataByDate(codigoUsuario) {
    try {
      const salesRef = ref(db, `users/${codigoUsuario}/sales`);
      const snapshot = await get(salesRef);
  
      if (!snapshot.exists()) {
        console.log("No sales data found.");
        return null;
      }
  
      const salesData = snapshot.val();
      const salesArray = Object.values(salesData);
  
      // Agrupar las ventas por fecha
      const salesByDate = salesArray.reduce((acc, sale) => {
        // Extraer solo la fecha sin hora del formato 'es-PE'
        const saleDate = sale.date.split(',')[0].trim(); // Ejemplo: "28/11/2024"
  
        if (!acc[saleDate]) {
          acc[saleDate] = {
            totalRevenue: 0,
            totalSales: 0,
          };
        }
        acc[saleDate].totalRevenue += sale.totalSale;
        acc[saleDate].totalSales += 1;
        return acc;
      }, {});
  
      // Obtener las fechas ordenadas de forma descendente
      const sortedDates = Object.keys(salesByDate).sort(
        (a, b) => new Date(b.split('/').reverse().join('-')) - new Date(a.split('/').reverse().join('-'))
      );
  
      const today = sortedDates[0];
      const yesterday = sortedDates[1] || null;
  
      // Ventas del día actual y del día anterior
      const todayData = today ? salesByDate[today] : { totalRevenue: 0, totalSales: 0 };
      const yesterdayData = yesterday ? salesByDate[yesterday] : { totalRevenue: 0, totalSales: 0 };
  
      // Diferencia en ingresos
      const revenueDifference = todayData.totalRevenue - yesterdayData.totalRevenue;
  
      return {
        today: {
          date: today,
          totalRevenue: todayData.totalRevenue,
          totalSales: todayData.totalSales,
        },
        yesterday: {
          date: yesterday,
          totalRevenue: yesterdayData.totalRevenue,
          totalSales: yesterdayData.totalSales,
        },
        revenueDifference,
      };
    } catch (error) {
      console.error("Error fetching sales data:", error);
      return null;
    }
  }
// console.log(await getDashboardData('jEcZIHprxEfzy3yMa9sAwgpkjlY2'))
// console.log(await getSalesDataByDate('jEcZIHprxEfzy3yMa9sAwgpkjlY2'))

// export async function inventarioData(codigoUsuario){
//     try{
//         const inventarioRef = ref(db, 'users/'+ codigoUsuario );
//         const snapshot = await get(inventarioRef);
//         if (!snapshot.exists()) {
//             console.log("No sales data found.");
//             return null;
//           }
//         const inventarioData = snapshot.val();
//         return inventarioData;
//     }
//     catch (error) {
//         console.error("Error fetching sales data:", error);
//         return null;
//       }
// }

export async function getInventoryData(codigoUsuario, lowStockThreshold = 400) {
    try {
      const productsRef = ref(db, `users/${codigoUsuario}/products`);
      const snapshot = await get(productsRef);
  
      if (!snapshot.exists()) {
        console.log("No products data found.");
        return null;
      }
  
      const productsData = snapshot.val();
      const productsArray = Object.values(productsData);
  
      // Cantidad total de productos
      const totalProducts = productsArray.length;
  
      // Productos más vendidos (ordenados por demanda)
      const mostSoldProducts = productsArray
        .sort((a, b) => b.demand - a.demand)
        .slice(0, 5); // Obtener los 5 más vendidos
  
      // Productos con bajo stock (stock < umbral)
      const lowStockProducts = productsArray.filter(product => product.stock < lowStockThreshold);
  
      // Costo promedio por producto
      const averageCost =
        productsArray.reduce((sum, product) => sum + product.cost, 0) / totalProducts || 0;
  
      // Valor total del inventario (price * stock)
      const totalInventoryValue = productsArray.reduce(
        (sum, product) => sum + product.price * product.stock,
        0
      );
  
      // Tiempo promedio de entrega
      const averageLeadTime =
        productsArray.reduce((sum, product) => sum + product.leadtime, 0) / totalProducts || 0;
  
      return {
        totalProducts,
        mostSoldProducts,
        lowStockProducts,
        averageCost: averageCost.toFixed(2),
        totalInventoryValue: totalInventoryValue.toFixed(2),
        averageLeadTime: averageLeadTime.toFixed(2),
      };
    } catch (error) {
      console.error("Error fetching inventory data:", error);
      return null;
    }
  }

  export async function getEOQDashboardData(codigoUsuario) {
    try {
      const productsRef = ref(db, `users/${codigoUsuario}/products`);
      const snapshot = await get(productsRef);
  
      if (!snapshot.exists()) {
        console.log("No product data found.");
        return null;
      }
  
      const productsData = snapshot.val();
      const productsArray = Object.values(productsData);
  
      // Calcular los datos puntuales
      const eoqAverage = productsArray.reduce((sum, product) => sum + product.eoq.economicOrderQuantity, 0) / productsArray.length;
      const totalCostAverage = productsArray.reduce((sum, product) => sum + product.eoq.totalCost, 0) / productsArray.length;
      const totalOrders = productsArray.reduce((sum, product) => sum + product.eoq.numOrders, 0);
      const reorderPointAverage = productsArray.reduce((sum, product) => sum + product.eoq.reorderPoint, 0) / productsArray.length;
  
      const mostEOQProduct = productsArray.reduce((max, product) => product.eoq.economicOrderQuantity > max.eoq.economicOrderQuantity ? product : max);
      const leastEOQProduct = productsArray.reduce((min, product) => product.eoq.economicOrderQuantity < min.eoq.economicOrderQuantity ? product : min);
  
      const totalInventoryValue = productsArray.reduce((sum, product) => sum + (product.price * product.stock), 0);
  
      const criticalStockProducts = productsArray.filter(product => product.stock < product.eoq.reorderPoint);
  
      return {
        eoqAverage: eoqAverage.toFixed(2),
        totalCostAverage: totalCostAverage.toFixed(2),
        totalOrders,
        reorderPointAverage: reorderPointAverage.toFixed(2),
        mostEOQProduct,
        leastEOQProduct,
        totalInventoryValue: totalInventoryValue.toFixed(2),
        criticalStockProducts
      };
  
    } catch (error) {
      console.error("Error fetching EOQ data:", error);
      return null;
    }
  }

// console.log(await getEOQDashboardData('jEcZIHprxEfzy3yMa9sAwgpkjlY2'))