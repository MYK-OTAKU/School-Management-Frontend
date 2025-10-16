
import React from 'react';

const colorClasses = {
  secondary: 'bg-secondary-100 text-secondary-800 dark:bg-secondary-700 dark:text-secondary-300',
  error: 'bg-error-100 text-error-800 dark:bg-error-900/30 dark:text-error-300',
  success: 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-300',
  primary: 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300',
  warning: 'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-300',
  accent: 'bg-accent-100 text-accent-800 dark:bg-accent-900/30 dark:text-accent-300'
};

const sizeClasses = {
  xs: 'text-xs px-1.5 py-0.5',
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-0.5',
  lg: 'text-sm px-3 py-1'
};

const Badge = ({ 
  children, 
  color = 'secondary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const colorClass = colorClasses[color] || colorClasses.secondary;
  const sizeClass = sizeClasses[size] || sizeClasses.md;
  
  return (
    <span 
      className={`inline-flex items-center rounded-full font-medium ${colorClass} ${sizeClass} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;