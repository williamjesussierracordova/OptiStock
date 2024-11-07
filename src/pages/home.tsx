import Sidebar1 from "./component/sidebar"
import Footer from "./parts/footer"
import Header from "./parts/header"
import { Dashboard } from "./component/dashboard"

export const Home = () => {
    return (
        <div>
          <Header/>
          <Sidebar1>
              <Dashboard/>
          </Sidebar1>
          <Footer/>
        </div>
    )
}