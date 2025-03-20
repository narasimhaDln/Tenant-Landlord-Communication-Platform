import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
      setIsAuthenticated(true);
    }
    
    setLoading(false);
  }, []);

  // Login function
  const login = useCallback((token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  }, []);

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = '/login';
  }, []);

  // Check if token is expired (sample implementation)
  const isTokenExpired = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) return true;
    
    // Here you'd typically decode JWT and check expiration
    // For this example, we'll return false (not expired)
    return false;
  }, []);

  // Value to be provided to consumers
  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    isTokenExpired
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
