import PortfolioPage from "./Pages/PortfolioPage"
import { BrowserRouter, Routes,Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import LoginPage from "./Pages/LoginPage"
import ProtectedRoutes from "./ProtectedRoutes/ProtectedRoutes"
function App() {


  return (
    <>
<ToastContainer style={{ zIndex: 9999 }} />
     <BrowserRouter>
   <Routes>
  
    <Route path="/" element={<PortfolioPage/>}/>
    <Route path="/login" element={<LoginPage/>}/>
    <Route element={<ProtectedRoutes/>} >
    <Route path="/admin" element={<PortfolioPage/>}/>
    </Route>    
   </Routes>
   </BrowserRouter>
    </>
  )
}

export default App
