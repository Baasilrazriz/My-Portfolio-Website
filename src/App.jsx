import PortfolioPage from "./Pages/PortfolioPage"
import ErrorPage from "./Pages/ErrorPage"
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import LoginPage from "./Pages/LoginPage"
import ProtectedRoutes from "./ProtectedRoutes/ProtectedRoutes"

function App() {
  return (
    <>
      <ToastContainer style={{ zIndex: 9999 }} />
      <BrowserRouter>
        <Routes>
          {/* Main Portfolio Route */}
          <Route path="/" element={<PortfolioPage/>}/>
          
          {/* Login Route */}
          <Route path="/login" element={<LoginPage/>}/>
          
          {/* Error Page Route */}
          <Route path="/error" element={<ErrorPage/>}/>
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoutes/>}>
            <Route path="/admin" element={<PortfolioPage/>}/>
          </Route>
          
          {/* Catch-all route for 404 errors - this must be last */}
          <Route path="*" element={<ErrorPage/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App