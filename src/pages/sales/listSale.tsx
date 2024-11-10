import Sidebar1 from "../component/sidebar";
import Footer from "../parts/footer";
import Header from "../parts/header";
import ListSaleComponent from "../component/sales/listSale"

export const ListSale = () => {
    return (
        <div>
            <Header/>
            <Sidebar1>
                <ListSaleComponent/>
            </Sidebar1>
            <Footer/>
        </div>
    );
}

