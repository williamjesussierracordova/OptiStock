import Sidebar1 from "../component/sidebar";
import Footer from "../parts/footer";
import Header from "../parts/header";
import RegisterSaleComponent from "../component/sales/registerSale"

export const RegisterSale = () => {
    return (
        <div>
            <Header/>
            <Sidebar1>
                <RegisterSaleComponent/>
            </Sidebar1>
            <Footer/>
        </div>
    );
}

