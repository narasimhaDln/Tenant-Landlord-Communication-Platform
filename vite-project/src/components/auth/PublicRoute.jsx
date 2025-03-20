import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  // Get the stored intended destination or default to dashboard
  const from = location.state?.from?.pathname || '/';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If user is already authenticated, redirect to the intended destination
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return children;
};

export default PublicRoute; 