import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

function ProtectedRoutes() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        // Check session storage for authentication
        const checkAuth = () => {
            try {
                const isAuthenticated = sessionStorage.getItem('isAdminAuthenticated');
                const adminEmail = sessionStorage.getItem('adminEmail');
                
                // Debug logging
                console.log('=== Protected Route Auth Check ===');
                console.log('isAuthenticated:', isAuthenticated);
                console.log('adminEmail:', adminEmail);
                
                // Check if user is authenticated
                if (isAuthenticated === 'true' && adminEmail) {
                    setIsLoggedIn(true);
                    console.log('✅ User is authenticated');
                } else {
                    setIsLoggedIn(false);
                    console.log('❌ User is not authenticated');
                }
            } catch (error) {
                console.error('Error checking authentication:', error);
                setIsLoggedIn(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();

        // Optional: Listen for storage changes (if user logs out in another tab)
        const handleStorageChange = (e) => {
            if (e.key === 'isAdminAuthenticated' || e.key === 'adminEmail') {
                checkAuth();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    // Professional Exotic Loading Screen
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden flex items-center justify-center">
                {/* Animated Background Grid */}
                <div className="absolute inset-0 opacity-20">
                    <div className="grid-background"></div>
                </div>

                {/* Floating Particles */}
                <div className="absolute inset-0 overflow-hidden">
                    {[...Array(50)].map((_, i) => (
                        <div
                            key={i}
                            className="particle absolute w-1 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 20}s`,
                                animationDuration: `${15 + Math.random() * 10}s`
                            }}
                        />
                    ))}
                </div>

                {/* Main Loading Container */}
                <div className="relative z-10 text-center">
                    {/* Logo/Icon Container */}
                    <div className="relative mb-12">
                        {/* Outer Ring */}
                        <div className="w-32 h-32 rounded-full border-4 border-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 p-1 animate-spin-slow mx-auto">
                            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                                {/* Inner Content */}
                                <div className="relative">
                                    {/* Pulsing Core */}
                                    <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse-slow flex items-center justify-center">
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                                        </svg>
                                    </div>
                                    
                                    {/* Orbiting Dots */}
                                    <div className="absolute inset-0 animate-spin">
                                        <div className="w-3 h-3 bg-purple-400 rounded-full absolute -top-1 left-1/2 transform -translate-x-1/2"></div>
                                    </div>
                                    <div className="absolute inset-0 animate-spin-reverse">
                                        <div className="w-2 h-2 bg-pink-400 rounded-full absolute -bottom-1 left-1/2 transform -translate-x-1/2"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Glowing Effect */}
                        <div className="absolute inset-0 w-32 h-32 rounded-full bg-gradient-to-r from-purple-500/30 to-pink-500/30 blur-xl animate-pulse mx-auto"></div>
                    </div>

                    {/* Loading Text */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
                            Authenticating Access
                        </h2>
                        
                        {/* Progress Bar */}
                        <div className="w-64 mx-auto">
                            <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-loading-bar"></div>
                            </div>
                        </div>

                        {/* Status Text */}
                        <p className="text-slate-400 text-sm animate-pulse">
                            Verifying credentials and permissions...
                        </p>

                        {/* Loading Dots */}
                        <div className="flex justify-center space-x-2">
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce animation-delay-100"></div>
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce animation-delay-200"></div>
                        </div>
                    </div>
                </div>

                {/* Custom Styles */}
                <style jsx>{`
                    @keyframes spin-slow {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                    
                    @keyframes spin-reverse {
                        from { transform: rotate(360deg); }
                        to { transform: rotate(0deg); }
                    }
                    
                    @keyframes pulse-slow {
                        0%, 100% { opacity: 1; transform: scale(1); }
                        50% { opacity: 0.8; transform: scale(1.05); }
                    }
                    
                    @keyframes gradient {
                        0%, 100% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                    }
                    
                    @keyframes loading-bar {
                        0% { transform: translateX(-100%); }
                        100% { transform: translateX(100%); }
                    }
                    
                    @keyframes float {
                        0%, 100% { transform: translateY(0px) rotate(0deg); }
                        33% { transform: translateY(-30px) rotate(120deg); }
                        66% { transform: translateY(30px) rotate(240deg); }
                    }
                    
                    .animate-spin-slow {
                        animation: spin-slow 3s linear infinite;
                    }
                    
                    .animate-spin-reverse {
                        animation: spin-reverse 2s linear infinite;
                    }
                    
                    .animate-pulse-slow {
                        animation: pulse-slow 2s ease-in-out infinite;
                    }
                    
                    .animate-gradient {
                        background-size: 200% 200%;
                        animation: gradient 3s ease infinite;
                    }
                    
                    .animate-loading-bar {
                        animation: loading-bar 2s ease-in-out infinite;
                    }
                    
                    .animation-delay-100 {
                        animation-delay: 0.1s;
                    }
                    
                    .animation-delay-200 {
                        animation-delay: 0.2s;
                    }
                    
                    .particle {
                        animation: float linear infinite;
                    }
                    
                    .grid-background {
                        background-image: 
                            linear-gradient(rgba(147, 51, 234, 0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(147, 51, 234, 0.1) 1px, transparent 1px);
                        background-size: 50px 50px;
                        width: 100%;
                        height: 100%;
                        animation: grid-move 20s linear infinite;
                    }
                    
                    @keyframes grid-move {
                        0% { transform: translate(0, 0); }
                        100% { transform: translate(50px, 50px); }
                    }
                `}</style>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!isLoggedIn) {
        console.log('🔄 Redirecting to login page');
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Render protected content
    console.log('✅ Rendering protected content');
    return <Outlet />;
}

export default ProtectedRoutes;