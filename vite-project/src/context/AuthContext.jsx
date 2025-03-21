import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { auth } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize state from localStorage if available, but with deferred loading
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load authentication state from localStorage with a delay
  useEffect(() => {
    // Check if we're on the login page
    const isLoginPage = window.location.pathname === '/login' || window.location.pathname === '/register';
    
    // Don't auto-login if user is on the login page
    if (isLoginPage) {
      setLoading(false);
      return;
    }
    
    // Check authentication status
    const { isAuthenticated, user: authUser } = auth.checkAuthStatus();
    
    if (isAuthenticated && authUser) {
      try {
        const savedToken = localStorage.getItem('token');
        if (savedToken) {
          setToken(savedToken);
          setUser(authUser);
          console.log('User authenticated:', authUser.email);
        } else {
          // Clear user if token is missing
          localStorage.removeItem('user');
        }
      } catch (err) {
        console.error('Error loading auth state:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } else {
      // Clear invalid auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    
    setLoading(false);
  }, []);

  // Login function
  const login = (authToken, userData) => {
    setToken(authToken);
    setUser(userData);
    
    // Save to localStorage for persistence
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    
    setLoading(false);
  };

  // Logout function
  const logout = () => {
    setToken(null);
    setUser(null);
    
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Also clear maintenance requests to avoid persistence issues
    localStorage.removeItem('maintenanceRequests');
    
    setLoading(false);
  };

  // Update user information
  const updateUser = (updatedUserData) => {
    const updatedUser = { ...user, ...updatedUserData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // Create context value
  const value = {
    token,
    user,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated: !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
