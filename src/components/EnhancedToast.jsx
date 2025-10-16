import React, { useState, useEffect, useCallback } from 'react';
import { X, AlertTriangle, CheckCircle, Info, AlertCircle, Eye, ChevronRight } from 'lucide-react';
import { formatRelativeDate } from '../utils/dateUtils';

const Toast = ({ 
  notification, 
  onClose, 
  onMarkAsRead,
  position = 'top-right',
  className = '' 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Animation d'entrée
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = useCallback(() => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose(notification?.id);
    }, 300);
  }, [onClose, notification?.id]);

  useEffect(() => {
    // Auto-close pour les notifications non urgentes
    if (notification?.priority !== 'urgent' && (notification?.duration || 0) > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, notification.duration);
      return () => clearTimeout(timer);
    }
  }, [notification?.duration, notification?.priority, handleClose]);

  // Protection contre les notifications undefined ou mal formatées
  if (!notification) {
    console.warn('Toast component received undefined notification');
    return null;
  }

  const handleMarkAsRead = () => {
    if (onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-success-400" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-error-400" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-warning-400" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-primary-400" />;
    }
  };

  const getBorderColor = () => {
    switch (notification.type) {
      case 'success':
        return 'border-l-success-500';
      case 'error':
        return 'border-l-error-500';
      case 'warning':
        return 'border-l-warning-500';
      case 'info':
      default:
        return 'border-l-primary-500';
    }
  };

  const getPriorityStyles = () => {
    switch (notification.priority) {
      case 'urgent':
        return 'ring-2 ring-error-500 ring-opacity-50 shadow-2xl';
      case 'high':
        return 'ring-1 ring-warning-400 ring-opacity-50 shadow-xl';
      default:
        return 'shadow-lg';
    }
  };

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
  };

  return (
    <div
      className={`
        ${position === 'relative' ? 'relative' : `fixed z-50 ${positionClasses[position] || positionClasses['top-right']}`}
        transition-all duration-300 ease-in-out
        ${isVisible && !isLeaving ? 'translate-x-0 opacity-100' : position === 'relative' ? 'opacity-100' : 'translate-x-full opacity-0'}
        ${className}
      `}
      style={{ 
        maxWidth: '480px', 
        minWidth: '400px',
        width: '480px'
      }}
    >
      <div className={`
        relative bg-card rounded-xl border-l-4 ${getBorderColor()} 
        ${getPriorityStyles()} overflow-hidden backdrop-blur-sm
        shadow-xl border border-secondary-200 dark:border-secondary-700
      `}>
        {/* Barre de progression pour les notifications avec durée */}
        {notification.duration > 0 && notification.priority !== 'urgent' && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-secondary-200 dark:bg-secondary-700">
            <div 
              className={`h-full transition-all ease-linear ${
                notification.type === 'success' ? 'bg-success-500' :
                notification.type === 'error' ? 'bg-error-500' :
                notification.type === 'warning' ? 'bg-warning-500' :
                'bg-primary-500'
              }`}
              style={{
                animation: `progress-bar ${notification.duration}ms linear forwards`
              }}
            />
          </div>
        )}

        <div className="p-5">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 mt-1">
              <div className={`p-2 rounded-full ${
                notification.type === 'success' ? 'bg-success-500/20' :
                notification.type === 'error' ? 'bg-error-500/20' :
                notification.type === 'warning' ? 'bg-warning-500/20' :
                'bg-primary-500/20'
              }`}>
                {getIcon()}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              {/* En-tête avec titre et priorité */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <h4 className="text-base font-semibold text-text-main leading-tight">
                    {notification.title}
                  </h4>
                  {notification.priority === 'urgent' && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-error-100 text-error-800 dark:bg-error-900 dark:text-error-200 border border-error-200 dark:border-error-800">
                      🚨 Urgent
                    </span>
                  )}
                  {notification.priority === 'high' && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-200 border border-warning-200 dark:border-warning-800">
                      ⚠️ Important
                    </span>
                  )}
                </div>
              </div>

              {/* Message */}
              <p className="text-sm text-text-muted mb-4 leading-relaxed">
                {notification.message}
              </p>

              {/* Métadonnées et actions */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-muted font-medium">
                  {notification.timestamp && formatRelativeDate(notification.timestamp)}
                </span>

                <div className="flex items-center space-x-2">
                  {/* Bouton Marquer comme lu */}
                  {!notification.isRead && onMarkAsRead && (
                    <button
                      onClick={handleMarkAsRead}
                      className="inline-flex items-center px-3 py-1.5 bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 rounded-lg text-xs font-semibold hover:bg-primary-100 dark:hover:bg-primary-900/70 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 border border-primary-200 dark:border-primary-800"
                      title="Marquer comme lu"
                    >
                      <Eye className="h-3.5 w-3.5 mr-1.5" />
                      Marquer lu
                    </button>
                  )}

                  {/* Badge Non lu */}
                  {!notification.isRead && !onMarkAsRead && (
                    <span className="inline-flex items-center px-2.5 py-1 bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 rounded-lg text-xs font-semibold border border-primary-200 dark:border-primary-800">
                      • Non lu
                    </span>
                  )}
                </div>
              </div>

              {/* Action personnalisée */}
              {notification.actionText && notification.onAction && (
                <div className="mt-4 pt-3 border-t border-secondary-200 dark:border-secondary-600">
                  <button
                    onClick={notification.onAction}
                    className="inline-flex items-center text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 focus:outline-none focus:underline transition-colors duration-200"
                  >
                    {notification.actionText}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
              )}
            </div>

            {/* Bouton de fermeture */}
            <button
              onClick={handleClose}
              className="ml-2 flex-shrink-0 p-2 rounded-full text-text-muted hover:text-text-main hover:bg-secondary-100 dark:hover:bg-secondary-700/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:ring-offset-1"
              title="Fermer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toast;
