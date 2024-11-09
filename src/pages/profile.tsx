import Header from "./parts/header"
import {ProfileComponent} from "./component/profile"
import Footer from "./parts/footer"
import Sidebar1 from "./component/sidebar"


export const Profile = () => {
    return(
        <>
        <Header/>
        <Sidebar1>
            <ProfileComponent/>
        </Sidebar1>
        <Footer/>
        </>
    )
}