
import Sidebar1 from "../component/sidebar";
import Footer from "../parts/footer";
import Header from "../parts/header";
import DeleteProducto from "../component/products/deleteProducts"

export const EliminarProducto = () => {
    return (
        <div>
            <Header/>
            <Sidebar1>
                <DeleteProducto />
            </Sidebar1>
            <Footer/>
        </div>
    );
}