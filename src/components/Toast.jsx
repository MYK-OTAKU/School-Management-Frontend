import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';

const Toast = ({
  type = 'info',
  title,
  message,
  duration = 5000,
  isVisible = true,
  onClose,
  onAction,
  actionText,
  priority = 'normal',
  theme = 'light'
}) => {
  const [show, setShow] = useState(isVisible);

  useEffect(() => {
    setShow(isVisible);
  }, [isVisible]);

  useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(() => onClose && onClose(), 300); // Délai pour l'animation
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  const handleClose = () => {
    setShow(false);
    setTimeout(() => onClose && onClose(), 300);
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-success-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-error-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-warning-500" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-primary-500" />;
    }
  };

  const getColorClasses = () => {
    const baseClasses = 'bg-card text-text-main';
    
    switch (type) {
      case 'success':
        return `${baseClasses} border-l-4 border-success-500`;
      case 'error':
        return `${baseClasses} border-l-4 border-error-500`;
      case 'warning':
        return `${baseClasses} border-l-4 border-warning-500`;
      case 'info':
      default:
        return `${baseClasses} border-l-4 border-primary-500`;
    }
  };

  const getPriorityClasses = () => {
    switch (priority) {
      case 'urgent':
        return 'ring-2 ring-error-500 ring-opacity-50';
      case 'high':
        return 'ring-2 ring-warning-500 ring-opacity-50';
      case 'normal':
      default:
        return '';
    }
  };

  if (!show) {
    return null;
  }

  return (
    <div
      className={`
        transform transition-all duration-300 ease-in-out
        ${show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        max-w-sm w-full shadow-lg rounded-lg pointer-events-auto
        ${getColorClasses()}
        ${getPriorityClasses()}
      `}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          
          <div className="ml-3 w-0 flex-1">
            {title && (
              <p className="text-sm font-medium">
                {title}
              </p>
            )}
            <p className={`text-sm ${title ? 'mt-1' : ''} text-text-muted`}>
              {message}
            </p>
            
            {onAction && actionText && (
              <div className="mt-3">
                <button
                  onClick={onAction}
                  className={`
                    text-sm font-medium rounded-md px-3 py-1
                    ${type === 'success' ? 'bg-success-100 text-success-800 hover:bg-success-200 dark:bg-success-900/30 dark:text-success-300' :
                      type === 'error' ? 'bg-error-100 text-error-800 hover:bg-error-200 dark:bg-error-900/30 dark:text-error-300' :
                      type === 'warning' ? 'bg-warning-100 text-warning-800 hover:bg-warning-200 dark:bg-warning-900/30 dark:text-warning-300' :
                      'bg-primary-100 text-primary-800 hover:bg-primary-200 dark:bg-primary-900/30 dark:text-primary-300'
                    }
                  `}
                >
                  {actionText}
                </button>
              </div>
            )}
          </div>
          
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={handleClose}
              className="
                inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2
                text-text-muted hover:text-text-main focus:ring-secondary-500
              "
            >
              <span className="sr-only">Fermer</span>
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Barre de progression pour les toasts avec durée */}
      {duration > 0 && show && (
        <div className="h-1 bg-secondary-200 dark:bg-secondary-700 rounded-b-lg overflow-hidden">
          <div
            className={`h-full transition-all ease-linear ${
              type === 'success' ? 'bg-success-500' :
              type === 'error' ? 'bg-error-500' :
              type === 'warning' ? 'bg-warning-500' :
              'bg-primary-500'
            }`}
            style={{
              animation: `shrink ${duration}ms linear forwards`
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Toast;
