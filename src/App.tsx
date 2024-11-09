import { Routes } from "react-router-dom"
import { Route } from "react-router-dom"
import { SignIn } from "./pages/signIn"
import { SignUp } from "./pages/signUp"
import { Home } from "./pages/home"
import { Profile } from "./pages/profile"
import Prueba from "./pages/prueba"
import { useSessionStore } from "./store/sessionStore"
import { Navigate } from "react-router-dom"
import { ProtectedRoute } from "./store/protectedRoute"
function App() {
  const { initialized } = useSessionStore();
  // if (!initialized) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
  //     </div>
  //   );
  // }
  return (
    <>
      <Routes>
        <Route path="/" element={<SignIn />}/>
        <Route path="/signUp" element={<SignUp />}/>
        <Route path="/home" element={
          <ProtectedRoute>
          <Home />
          </ProtectedRoute>
          }/>
        <Route path="/prueba" element={
          <ProtectedRoute>
          <Prueba />
          </ProtectedRoute>
        }/>
        <Route path="/profile" element={
          <ProtectedRoute>
          <Profile />
          </ProtectedRoute>
        }/>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App
