import React, { Children } from 'react'
import {  useSelector } from 'react-redux';
import { Navigate,Outlet, useLocation } from 'react-router-dom';

function ProtectedRoutes() {
    // const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    const isLoggedIn = false;
    const location = useLocation();
    
    if (!isLoggedIn) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
    
}

export default ProtectedRoutes
