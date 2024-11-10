
import Sidebar1 from "../component/sidebar";
import Footer from "../parts/footer";
import Header from "../parts/header";
import EditProductsComponent from "../component/products/editProducts"

export const EditProducts = () => {
    return (
        <div>
            <Header/>
            <Sidebar1>
                <EditProductsComponent/>
            </Sidebar1>
            <Footer/>
        </div>
    );
}