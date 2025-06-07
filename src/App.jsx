import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import ErrorBoundary from './Components/ErrorBoundary' // Create this component

// Lazy load components for better performance
const PortfolioPage = lazy(() => import("./Pages/PortfolioPage"))
const LoginPage = lazy(() => import("./Pages/LoginPage"))
const ErrorPage = lazy(() => import("./Pages/ErrorPage"))
const ProtectedRoutes = lazy(() => import("./ProtectedRoutes/ProtectedRoutes"))

// Loading component
const Loading = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-slate-600 dark:text-slate-400">Loading...</p>
    </div>
  </div>
)

function App() {
  return (
    <ErrorBoundary>
      <ToastContainer 
        style={{ zIndex: 9999 }}
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <BrowserRouter>
        <Suspense fallback={<Loading />}>
          <Routes>
            {/* Main Portfolio Route */}
            <Route path="/" element={<PortfolioPage/>}/>
            
            {/* Login Route */}
            <Route path="/login" element={<LoginPage/>}/>
            
            {/* Project Detail Route */}
            <Route path="/project/:id" element={<PortfolioPage/>}/>
            
            {/* Error Page Route */}
            <Route path="/error" element={<ErrorPage/>}/>
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoutes/>}>
              <Route path="/admin" element={<PortfolioPage/>}/>
            </Route>
            
            {/* Catch-all route for 404 errors - this must be last */}
            <Route path="*" element={<ErrorPage/>}/>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App