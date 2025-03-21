import React, { useState, useEffect } from 'react';
import { testConnection } from '../services/api';
import { Database, HardDrive, AlertCircle, RefreshCw, CheckCircle } from 'lucide-react';

const ConnectionStatus = () => {
  const [status, setStatus] = useState({
    loading: true,
    connected: false,
    mode: 'unknown',
    message: 'Checking connection...'
  });
  const [isRetrying, setIsRetrying] = useState(false);

  const checkConnection = async () => {
    try {
      setIsRetrying(true);
      const connectionStatus = await testConnection();
      setStatus({
        loading: false,
        ...connectionStatus
      });
    } catch (error) {
      setStatus({
        loading: false,
        connected: false,
        mode: 'error',
        message: 'Error checking connection: ' + (error.message || 'Unknown error')
      });
    } finally {
      setIsRetrying(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  if (status.loading) {
    return (
      <div className="text-xs text-center text-gray-500 mt-4 flex items-center justify-center">
        <div className="animate-spin h-3 w-3 border-t-2 border-blue-500 rounded-full mr-2"></div>
        Checking database connection...
      </div>
    );
  }

  return (
    <div className={`text-xs p-3 rounded mt-4 ${
      status.mode === 'mongodb' 
        ? 'bg-green-50 text-green-700' 
        : status.mode === 'mock' 
        ? 'bg-yellow-50 text-yellow-700'
        : 'bg-red-50 text-red-700'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {status.mode === 'mongodb' ? (
            <Database size={14} className="mr-1" />
          ) : status.mode === 'mock' ? (
            <HardDrive size={14} className="mr-1" />
          ) : (
            <AlertCircle size={14} className="mr-1" />
          )}
          <span>{status.message}</span>
        </div>
        <button 
          className="text-xs p-1 hover:bg-gray-100 rounded-full"
          onClick={checkConnection}
          disabled={isRetrying}
        >
          <RefreshCw size={12} className={isRetrying ? "animate-spin" : ""} />
        </button>
      </div>
      
      {status.mode === 'mock' && (
        <div className="mt-2 text-xs bg-white p-2 rounded border border-yellow-200">
          <div className="flex items-center">
            <CheckCircle size={12} className="mr-1 text-yellow-500" />
            <span className="font-medium">App is working in offline mode</span>
          </div>
          <p className="mt-1">
            Your data is being stored locally in your browser. <br />
            User credentials and data will not be saved to MongoDB.
          </p>
        </div>
      )}
      
      {status.mode === 'error' && (
        <div className="mt-2 text-xs bg-white p-2 rounded border border-red-200">
          <p>The app can't connect to MongoDB. Please make sure:</p>
          <ul className="list-disc pl-5 mt-1">
            <li>MongoDB server is running</li>
            <li>Backend server is running at <code className="bg-gray-100 px-1">http://localhost:5000</code></li>
            <li>The browser can connect to the backend (no network blocks/CORS issues)</li>
          </ul>
          <div className="mt-2">
            <p className="font-medium text-gray-700">Current configuration:</p>
            <p>API URL: <code className="bg-gray-100 px-1">{import.meta.env.VITE_API_URL}</code></p>
            {status.error && (
              <p className="mt-1 text-red-500">Error: {status.error}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectionStatus; 