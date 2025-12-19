// components/common/ProtectedRoute.jsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null); // null = loading

    useEffect(() => {
        const verifySession = async () => {
            try {
                // We ask the backend to verify the httpOnly cookie
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/check-auth`, {
                    withCredentials: true // Critical: This sends the cookie to the backend
                });

                if (response.data.success) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch {
                setIsAuthenticated(false);
               
            }
        };

        verifySession();
    }, []);

    // 1. Show a loading state while checking (prevent flickering)
    if (isAuthenticated === null) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // 2. Redirect if verification failed
    if (isAuthenticated === false) {
        return <Navigate to="/admin/login" replace />;
    }

    // 3. Render Dashboard if authenticated
    return children;
};

export default ProtectedRoute;