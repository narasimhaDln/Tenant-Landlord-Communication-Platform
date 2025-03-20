import React, { createContext, useContext, useState, useCallback } from 'react';
import { maintenance } from '../services/api';

const MaintenanceContext = createContext();

export const MaintenanceProvider = ({ children }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await maintenance.getAll();
      if (!response.data) {
        throw new Error('No data received from server');
      }
      setRequests(response.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch maintenance requests';
      console.error('Error fetching maintenance requests:', err);
      setError(errorMessage);
      // Keep the existing requests in state if there's an error
      return false;
    } finally {
      setLoading(false);
    }
    return true;
  }, []);

  const deleteRequest = useCallback(async (id) => {
    try {
      setError(null);
      const response = await maintenance.deleteOne(id);
      
      // Check if the delete was successful
      if (response?.data?.success) {
        // Update the local state by removing the deleted request
        setRequests(prevRequests => prevRequests.filter(request => request._id !== id));
        return true;
      } else if (response?.data?.message) {
        throw new Error(response.data.message);
      }
      
      throw new Error('Failed to delete maintenance request');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete maintenance request';
      setError(errorMessage);
      console.error('Error deleting maintenance request:', err);
      throw err;
    }
  }, []);

  const addRequest = useCallback((newRequest) => {
    setRequests(prevRequests => [newRequest, ...prevRequests]);
  }, []);

  const updateRequest = useCallback((updatedRequest) => {
    setRequests(prevRequests =>
      prevRequests.map(request =>
        request._id === updatedRequest._id ? updatedRequest : request
      )
    );
  }, []);

  const value = {
    requests,
    loading,
    error,
    fetchRequests,
    deleteRequest,
    addRequest,
    updateRequest
  };

  return (
    <MaintenanceContext.Provider value={value}>
      {children}
    </MaintenanceContext.Provider>
  );
};

export const useMaintenance = () => {
  const context = useContext(MaintenanceContext);
  if (!context) {
    throw new Error('useMaintenance must be used within a MaintenanceProvider');
  }
  return context;
};