import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ allowedRoles, redirectPath = '/' }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        // Validate token with backend
        const response = await axios.get('/api/auth/validate-token', {
          headers: { 
            'Authorization': `Bearer ${token}` 
          }
        });

        if (response.data.valid) {
          setIsAuthenticated(true);
          setUserRole(response.data.role);
        } else {
          // Token is invalid
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          setIsAuthenticated(false);
        }
      } catch (error) {
        // Network error or token validation failed
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();
  }, []);

  // Show loading state while checking authentication
  if (isLoading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  // Not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  // Check role-based access if roles are specified
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Authenticated and authorized, render child routes
  return <Outlet />;
};

export default ProtectedRoute;
