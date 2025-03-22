import React, { useState, useEffect } from 'react';
import { testConnection } from '../services/api';
import { Database, HardDrive, AlertCircle, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';

const ConnectionStatus = () => {
  const [status, setStatus] = useState({
    loading: true,
    connected: false,
    mode: 'unknown',
    message: 'Checking connection...'
  });
  const [isRetrying, setIsRetrying] = useState(false);
  const [error, setError] = useState(null);

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
      setError(error);
    } finally {
      setIsRetrying(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  const apiUrl = import.meta.env.VITE_API_URL || 'Not configured';
  const isProduction = window.location.hostname !== 'localhost';

  if (status.loading) {
    return (
      <div className="text-xs text-center text-gray-500 mt-4 flex items-center justify-center">
        <div className="animate-spin h-3 w-3 border-t-2 border-blue-500 rounded-full mr-2"></div>
        Checking database connection...
      </div>
    );
  }

  return (
    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900 rounded-lg mt-4">
      <div className="flex items-start">
        <AlertTriangle className="w-5 h-5 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
            {isProduction 
              ? "Backend Connection Issue (Deployment)" 
              : "Can't connect to MongoDB"}
          </h3>
          
          {isProduction ? (
            <>
              <p className="mt-2 text-sm text-yellow-700 dark:text-yellow-400">
                This is a deployment issue with your backend server. For Netlify deployments:
              </p>
              <ul className="mt-1 text-sm text-yellow-700 dark:text-yellow-400 list-disc list-inside ml-4 space-y-1">
                <li>Your backend server needs to be deployed separately (Netlify only hosts frontend)</li>
                <li>Update your environment variables in Netlify dashboard</li>
                <li>Set <code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">VITE_API_URL</code> to your deployed backend URL</li>
                <li>Make sure CORS is configured on your backend to allow your Netlify domain</li>
                <li>Redeploy your application after making these changes</li>
              </ul>
              <div className="mt-3 text-xs text-yellow-600 dark:text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded">
                <p className="font-semibold">Quick Fix:</p>
                <ol className="list-decimal list-inside ml-2 space-y-1">
                  <li>Deploy your backend to a service like Render, Railway, or Heroku</li>
                  <li>Add your Netlify URL to the CORS allowed origins in your backend</li>
                  <li>Add your backend URL as VITE_API_URL in Netlify environment variables</li>
                </ol>
              </div>
            </>
          ) : (
            <>
              <p className="mt-2 text-sm text-yellow-700 dark:text-yellow-400">
                Please check that:
              </p>
              <ul className="mt-1 text-sm text-yellow-700 dark:text-yellow-400 list-disc list-inside ml-4 space-y-1">
                <li>MongoDB server is running</li>
                <li>Backend server is running at {apiUrl}</li>
                <li>The browser can connect to the backend (no network blocks/CORS issues)</li>
              </ul>
            </>
          )}
          
          <div className="mt-3">
            <p className="text-xs text-yellow-600 dark:text-yellow-500">Current configuration:</p>
            <p className="text-xs font-mono mt-1 bg-yellow-100 dark:bg-yellow-900/30 p-1.5 rounded">
              API URL: {apiUrl}
            </p>
            {error && (
              <p className="text-xs font-mono mt-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-1.5 rounded">
                Error: {error.toString()}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionStatus; 