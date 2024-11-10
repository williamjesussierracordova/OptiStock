import Sidebar1 from "../component/sidebar";
import Footer from "../parts/footer";
import Header from "../parts/header";
import DeleteSaleComponent from "../component/sales/deleteSale"

export const DeleteSale = () => {
    return (
        <div>
            <Header/>
            <Sidebar1>
                <DeleteSaleComponent/>
            </Sidebar1>
            <Footer/>
        </div>
    );
}

