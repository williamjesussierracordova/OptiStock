
import Sidebar1 from "../component/sidebar";
import Footer from "../parts/footer";
import Header from "../parts/header";
import ListProductsComponent from "../component/products/listProducts";

export const ListProducts = () => {
    return (
        <div>
            <Header/>
            <Sidebar1>
                <ListProductsComponent />
            </Sidebar1>
            <Footer/>
        </div>
    );
}