import { Suspense, lazy, useEffect, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { useSelector } from 'react-redux'
import { HelmetProvider } from 'react-helmet-async'
import PropTypes from 'prop-types'
import { useCursor } from './Hooks/useCursor'
import AIBot from './Components/AIBot/AIBot'
import MainLoader from './Loaders/MainLoader'

// Lazy load components for better performance
const PortfolioPage = lazy(() => import("./Pages/PortfolioPage"))
const LoginPage = lazy(() => import("./Pages/LoginPage"))
const ErrorPage = lazy(() => import("./Pages/ErrorPage"))
const ProjectDetailPage = lazy(() => import("./Pages/ProjectDetailPage"))
const ProtectedRoutes = lazy(() => import("./ProtectedRoutes/ProtectedRoutes"))
// Enhanced Loading component with cursor loading state
const Loading = ({ setCursorLoading }) => {
  useEffect(() => {
    setCursorLoading?.(true)
    return () => setCursorLoading?.(false)
  }, [setCursorLoading])

  return <MainLoader/>
}

Loading.propTypes = {
  setCursorLoading: PropTypes.func
}


// Error fallback component
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/10 dark:to-pink-900/10">
    <div className="text-center p-8 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-xl border border-red-200 dark:border-red-800">
      <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"/>
        </svg>
      </div>
      <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Something went wrong</h2>
      <p className="text-red-500 dark:text-red-300 text-sm mb-4">{error.message}</p>
      <button
        onClick={resetErrorBoundary}
        className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      >
        Try again
      </button>
    </div>
  </div>
)

ErrorFallback.propTypes = {
  error: PropTypes.object.isRequired,
  resetErrorBoundary: PropTypes.func.isRequired
}

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const { isOpen: isAIBotOpen } = useSelector((state) => state.aiBot)
  const [isMobile, setIsMobile] = useState(false)
  
  // Initialize custom cursor with optimized settings
  const { setCursorLoading, hideCursor, showCursor } = useCursor()

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Prevent scrolling when AIBot is open on mobile
  useEffect(() => {
    if (isMobile && isAIBotOpen) {
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
    } else {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
    }

    // Cleanup function to restore scrolling
    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
    }
  }, [isMobile, isAIBotOpen])

  // Handle initial app loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 100) // Minimal delay to ensure cursor is initialized

    return () => clearTimeout(timer)
  }, [])

  // Handle cursor visibility based on device type
  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0

    if (isTouchDevice) {
      hideCursor()
    } else {
      showCursor()
    }

    // Handle window focus/blur for cursor optimization
    const handleFocus = () => !isTouchDevice && showCursor()
    const handleBlur = () => hideCursor()

    window.addEventListener('focus', handleFocus)
    window.addEventListener('blur', handleBlur)

    return () => {
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('blur', handleBlur)
    }
  }, [hideCursor, showCursor])

  // Show initial loading if needed
  if (isLoading) {
    return <Loading setCursorLoading={setCursorLoading} />
  }

  return (
    <HelmetProvider>
      <ErrorBoundary 
        FallbackComponent={ErrorFallback}
        onReset={() => window.location.reload()}
      >
        {/* Toast Container with optimized z-index */}
        <ToastContainer 
          style={{ zIndex: 10000 }}
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          toastClassName="backdrop-blur-sm"
        />
        
        {/* AI Bot Component */}
        <AIBot />
        
        <BrowserRouter>
          <Suspense fallback={<Loading setCursorLoading={setCursorLoading} />}>
            <Routes>
              {/* Main Portfolio Route */}
              <Route path="/" element={<PortfolioPage />} />
              
              {/* Login Route */}
              <Route path="/login" element={<LoginPage />} />
              
              {/* Project Detail Route */}
              <Route path="/project/:id" element={<ProjectDetailPage />} />
              
              {/* Error Page Route */}
              <Route path="/error" element={<ErrorPage />} />
              
              {/* Protected Routes */}
              <Route element={<ProtectedRoutes />}>
                <Route path="/admin" element={<PortfolioPage />} />
              </Route>
              
              {/* Catch-all route for 404 errors - this must be last */}
              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ErrorBoundary>
    </HelmetProvider>
  )
}

export default App