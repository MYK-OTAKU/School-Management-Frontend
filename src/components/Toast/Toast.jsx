import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

// Types de notifications avec leurs configurations
const TOAST_TYPES = {
  success: {
    icon: CheckCircle,
    bgClass: {
      dark: 'bg-success-600/90',
      light: 'bg-success-500/90'
    },
    borderClass: {
      dark: 'border-success-500/50',
      light: 'border-success-400/50'
    },
    iconColor: {
      dark: 'text-success-300',
      light: 'text-success-600'
    }
  },
  error: {
    icon: XCircle,
    bgClass: {
      dark: 'bg-error-600/90',
      light: 'bg-error-500/90'
    },
    borderClass: {
      dark: 'border-error-500/50',
      light: 'border-error-400/50'
    },
    iconColor: {
      dark: 'text-error-300',
      light: 'text-error-600'
    }
  },
  warning: {
    icon: AlertCircle,
    bgClass: {
      dark: 'bg-warning-600/90',
      light: 'bg-warning-500/90'
    },
    borderClass: {
      dark: 'border-warning-500/50',
      light: 'border-warning-400/50'
    },
    iconColor: {
      dark: 'text-warning-300',
      light: 'text-warning-600'
    }
  },
  info: {
    icon: Info,
    bgClass: {
      dark: 'bg-primary-600/90',
      light: 'bg-primary-500/90'
    },
    borderClass: {
      dark: 'border-primary-500/50',
      light: 'border-primary-400/50'
    },
    iconColor: {
      dark: 'text-primary-300',
      light: 'text-primary-600'
    }
  }
};

const DEFAULT_DURATION = 5000;

const Toast = ({ 
  type = 'info', 
  message, 
  title, 
  onClose, 
  duration = DEFAULT_DURATION,
  isVisible = true,
  onAction = null,
  actionText = null,
  priority = 'normal',
  category = 'general',
  theme
}) => {
  const [visible, setVisible] = useState(isVisible);
  const [isHovered, setIsHovered] = useState(false);
  const { effectiveTheme } = useTheme();
  
  const currentTheme = theme || effectiveTheme;
  const isDarkMode = currentTheme === 'dark';
  
  // Configuration du type de toast
  const toastConfig = TOAST_TYPES[type] || TOAST_TYPES.info;
  const IconComponent = toastConfig.icon;
  
  // Classes dynamiques basées sur le thème
  const getTextColorClass = (isPrimary) => isPrimary ? 'text-text-main' : 'text-text-muted';
  
  const getBackgroundClass = () => {
    if (priority === 'critical') {
      return isDarkMode ? 'bg-error-900/95' : 'bg-error-100/95';
    }
    return 'bg-card/95';
  };
  
  const getBorderClass = () => {
    if (priority === 'critical') {
      return 'border-error-500';
    }
    return toastConfig.borderClass[currentTheme];
  };
  
  const getPriorityIndicator = () => {
    switch (priority) {
      case 'critical':
        return 'border-l-4 border-error-500';
      case 'high':
        return 'border-l-4 border-warning-500';
      default:
        return 'border-l-4 border-transparent';
    }
  };

  // Effet pour gérer la disparition automatique
  useEffect(() => {
    setVisible(isVisible);
    
    if (isVisible && duration > 0 && !isHovered) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) setTimeout(onClose, 300);
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose, isHovered]);

  const handleClose = () => {
    setVisible(false);
    if (onClose) setTimeout(onClose, 300);
  };

  const handleAction = () => {
    if (onAction) {
      onAction();
    }
    handleClose();
  };

  // Si le toast n'est pas visible, ne rien rendre
  if (!visible) return null;

  return (
    <div 
      className={`max-w-md w-full transform transition-all duration-300 ease-in-out ${getPriorityIndicator()}`}
      style={{ 
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(-16px) scale(0.95)',
        opacity: visible ? 1 : 0
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className={`
          rounded-lg shadow-xl border 
          ${getBackgroundClass()} 
          ${getBorderClass()}
          p-4 relative
          ${priority === 'critical' ? 'ring-2 ring-error-500' : ''}
        `}
        style={{
          backdropFilter: 'blur(10px)',
          boxShadow: priority === 'critical' ? 
            `0 20px 25px -5px rgb(var(--color-error) / 0.3), 0 10px 10px -5px rgb(var(--color-error) / 0.1)` :
            '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        }}
      >
        <div className="flex items-start">
          <div className="flex-shrink-0 mr-3 pt-0.5">
            <IconComponent 
              size={20} 
              className={toastConfig.iconColor[currentTheme]}
            />
          </div>
          
          <div className="flex-grow">
            {title && (
              <div className="flex items-center justify-between mb-1">
                <h3 className={`font-bold ${getTextColorClass(true)}`}>
                  {title}
                </h3>
                {priority === 'critical' && (
                  <span className="text-xs px-2 py-1 bg-error-500 text-white rounded-full">
                    CRITIQUE
                  </span>
                )}
              </div>
            )}
            
            <p className={`text-sm ${getTextColorClass(false)}`}>
              {message}
            </p>
            
            {/* Métadonnées */}
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center space-x-2">
                {category !== 'general' && (
                  <span className={`text-xs px-2 py-1 rounded ${
                    isDarkMode ? 'bg-secondary-700 text-secondary-300' : 'bg-secondary-200 text-secondary-600'
                  }`}>
                    {category}
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-1">
                {/* Bouton de fermeture */}
                <button
                  onClick={handleClose}
                  className={`p-1 rounded hover:bg-opacity-20 ${
                    isDarkMode ? 'hover:bg-secondary-100' : 'hover:bg-secondary-800'
                  } transition-colors`}
                  title="Fermer"
                >
                  <X size={14} className={getTextColorClass(false)} />
                </button>
              </div>
            </div>
            
            {/* Bouton d'action si présent */}
            {onAction && actionText && (
              <button
                onClick={handleAction}
                className={`mt-3 px-3 py-1 rounded transition-colors ${
                  isDarkMode 
                    ? 'bg-secondary-100 bg-opacity-20 hover:bg-opacity-30 text-text-main' 
                    : 'bg-secondary-800 bg-opacity-10 hover:bg-opacity-20 text-text-main'
                } text-sm`}
              >
                {actionText}
              </button>
            )}
          </div>
          
          <button 
            onClick={handleClose}
            className={`flex-shrink-0 ml-2 p-1 rounded hover:bg-opacity-20 ${
              isDarkMode ? 'hover:bg-secondary-100' : 'hover:bg-secondary-800'
            } transition-colors`}
            aria-label="Fermer"
          >
            <X size={18} className={getTextColorClass(false)} />
          </button>
        </div>

        {/* Barre de progression pour le temps restant */}
        {duration > 0 && !isHovered && (
          <div className="absolute bottom-0 left-0 h-1 bg-current opacity-20 rounded-b-lg"
            style={{
              animation: `shrink ${duration}ms linear forwards`
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Toast;