import React from 'react';

const LoadingSpinner = ({ size = 'medium', color = 'blue' }) => {
  const sizeClasses = {
    small: 'w-4 h-4 border-2',
    medium: 'w-8 h-8 border-3',
    large: 'w-12 h-12 border-4'
  };
  
  const colorClasses = {
    blue: 'border-blue-500',
    gray: 'border-gray-500',
    white: 'border-white'
  };

  return (
    <div className="flex items-center justify-center">
      <div 
        className={`${sizeClasses[size]} rounded-full animate-spin border-t-transparent ${colorClasses[color]}`}
        aria-label="Loading"
      ></div>
    </div>
  );
};

export default LoadingSpinner; 