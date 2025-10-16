import React from 'react';

const variantClasses = {
  primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-sm',
  secondary: 'bg-secondary-500 hover:bg-secondary-600 text-white shadow-sm',
  success: 'bg-success-600 hover:bg-success-700 text-white shadow-sm',
  danger: 'bg-error-600 hover:bg-error-700 text-white shadow-sm',
  warning: 'bg-warning-500 hover:bg-warning-600 text-white shadow-sm',
  info: 'bg-accent-500 hover:bg-accent-600 text-white shadow-sm',
  outline: 'bg-transparent border border-secondary-300 dark:border-secondary-600 text-text-main hover:bg-secondary-50 dark:hover:bg-secondary-700',
  ghost: 'bg-transparent text-text-main hover:bg-secondary-100 dark:hover:bg-secondary-800'
};

const sizeClasses = {
  xs: 'text-xs px-2 py-1 rounded',
  sm: 'text-sm px-2.5 py-1.5 rounded',
  md: 'text-sm px-4 py-2 rounded-md',
  lg: 'text-base px-5 py-2.5 rounded-md',
  xl: 'text-base px-6 py-3 rounded-md'
};

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false,
  isLoading = false,
  type = 'button',
  ...props 
}) => {
  const variantClass = variantClasses[variant] || variantClasses.primary;
  const sizeClass = sizeClasses[size] || sizeClasses.md;
  
  return (
    <button 
      type={type} 
      className={`
        inline-flex items-center justify-center font-medium transition-colors
        ${variantClass} ${sizeClass} ${className}
        ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;