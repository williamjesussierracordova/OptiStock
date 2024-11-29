import Sidebar1 from "./component/sidebar"
import Footer from "./parts/footer"
import Header from "./parts/header"
import Documentacion from "./document"
export const Documentacion_view = () => {
    
    return (    
        <div>
          <Header/>
          <Sidebar1>
              <Documentacion/>
          </Sidebar1>
          <Footer/>
        </div>
    )
}