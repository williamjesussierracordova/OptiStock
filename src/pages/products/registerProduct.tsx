import Sidebar1 from "../component/sidebar";
import Footer from "../parts/footer";
import Header from "../parts/header";
import RegisterProductComponent from "../component/registerProduct";

export const RegisterProduct = () => {
    return (
        <div>
            <Header/>
            <Sidebar1>
                <RegisterProductComponent/>
            </Sidebar1>
            <Footer/>
        </div>
    );
}

