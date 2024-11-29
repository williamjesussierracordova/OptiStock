import React from 'react';
import { EOQDashboard } from './EOQDashboard';
import { useSessionStore } from '@/store/sessionStore';
import { getEOQDashboardData } from '@/firebase/dashboardController';

// Example data (replace with actual data from your getEOQDashboardData function)
const mockData = {
  eoqAverage: "150.25",
  totalCostAverage: "1250.75",
  totalOrders: 45,
  reorderPointAverage: "25.50",
  mostEOQProduct: { name: "Product A", eoq: { economicOrderQuantity: 200 } },
  leastEOQProduct: { name: "Product B", eoq: { economicOrderQuantity: 50 } },
  totalInventoryValue: "45000.00",
  criticalStockProducts: [
    { name: "Product X", stock: 10, eoq: { reorderPoint: 15 } },
    { name: "Product Y", stock: 5, eoq: { reorderPoint: 12 } },
  ]
};

function MainEOQ() {
    const {session} = useSessionStore()
    const [data, setData] = React.useState(null);

    React.useEffect(() => {
        const fetchData = async () => {
          try {
            if (!session?.uid) return;
            setData(await getEOQDashboardData(session.uid));    
            console.log('Data:', data);    
          } catch (error) {
            console.error('Error fetching dashboard data:', error);
          }
        };
    
        fetchData();
      }, [session?.uid]);

  return (
    <EOQDashboard data={data} />
  );
}

export default MainEOQ;