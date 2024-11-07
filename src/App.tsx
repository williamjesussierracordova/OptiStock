import { Routes } from "react-router-dom"
import { Route } from "react-router-dom"
import { SignIn } from "./pages/signIn"
import { SignUp } from "./pages/signUp"
import { Home } from "./pages/home"
import Prueba from "./pages/prueba"
import { useAuthStateListener } from "./store/sessionStore"
function App() {
  useAuthStateListener();

  return (
    <>
      <Routes>
        <Route path="/" element={<SignIn />}/>
        <Route path="/signUp" element={<SignUp />}/>
        <Route path="/home" element={<Home />}/>
        <Route path="/prueba" element={<Prueba />}/>
      </Routes>
    </>
  )
}

export default App
