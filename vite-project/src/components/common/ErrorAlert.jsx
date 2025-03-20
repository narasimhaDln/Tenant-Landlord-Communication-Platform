import React from 'react';
import { X, AlertCircle } from 'lucide-react';

const ErrorAlert = ({ message, onClose }) => {
  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start">
      <div className="flex-shrink-0 mt-0.5">
        <AlertCircle className="h-5 w-5 text-red-500" />
      </div>
      <div className="ml-3 flex-1">
        <p className="text-sm text-red-700">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg p-1.5 hover:bg-red-100 focus:outline-none"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default ErrorAlert; 