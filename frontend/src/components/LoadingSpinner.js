import React from 'react';

const LoadingSpinner = ({ size = 'medium', text = 'Loading...' }) => {
  const sizeClasses = {
    small: 'w-5 h-5',
    medium: 'w-10 h-10',
    large: 'w-14 h-14'
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`relative ${sizeClasses[size]} animate-spin rounded-full spinner-gradient spinner-glow`}
        aria-label="Loading"
      />
      {text && (
        <p className="mt-2 text-sm text-muted-foreground">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;