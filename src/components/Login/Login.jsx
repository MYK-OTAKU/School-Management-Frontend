import React, { useState, useEffect } from 'react';
import { User, Lock, AlertCircle, LogIn, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import SplashScreen from '../SplashScreen/SplashScreen';

// Composant Image optimisé (inchangé)
const OptimizedImage = ({
  src,
  alt,
  className = '',
  style = {},
  placeholder = true,
  placeholderColor = '#0EA5E9',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setIsLoaded(true);
    img.onerror = () => setHasError(true);
    img.src = src;
  }, [src]);

  if (hasError) {
    return (
      <div
        className={`${className} flex items-center justify-center bg-gray-700 rounded-full`}
        style={style}
        {...props}
      >
        <div className="text-accent-200 text-center">
          <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold text-xl">
            DT
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative" style={style}>
      {!isLoaded && placeholder && (
        <div
          className={`${className} absolute inset-0 flex items-center justify-center animate-pulse rounded-full`}
          style={{
            backgroundColor: 'rgba(14, 165, 233, 0.18)',
            backdropFilter: 'blur(10px)',
            ...style
          }}
        >
          <div
            className="w-8 h-8 rounded-full animate-spin border-2 border-t-transparent"
            style={{ borderColor: placeholderColor }}
          />
        </div>
      )}

      <img
        src={src}
        alt={alt}
        className={`${className} transition-opacity duration-700 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={style}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        {...props}
      />
    </div>
  );
};

const LoginPage = () => {
  const [nomUtilisateur, setNomUtilisateur] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    loading,
    initialAuthCheckComplete,
    login
  } = useAuth();

  const { getTranslation } = useLanguage();
  const { effectiveTheme } = useTheme();

  const isDarkMode = effectiveTheme === 'dark';

  // Preload critical images
  useEffect(() => {
    const preloadImages = ['/MalianDevs-logo.jpg', '/MalianDevs-logo.jpg'];
    preloadImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowError(false);
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      console.log('🔐 [LOGIN] Tentative de connexion...');

      await login({
        username: nomUtilisateur,
        password: motDePasse,
        rememberMe
      });

    } catch (error) {
      console.error('❌ [LOGIN] Erreur de connexion:', error);
      setErrorMessage(error.message || getTranslation('auth.loginError', 'Erreur de connexion'));
      setShowError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Display SplashScreen ONLY during initialization
  if (!initialAuthCheckComplete) {
    console.log('⏳ [LOGIN] Chargement initial...');
    return <SplashScreen />;
  }

  console.log('✅ [LOGIN] Affichage de la page de connexion');

  // Utility function to handle copyright securely
  const renderCopyright = () => {
    const copyrightText = getTranslation('auth.copyright', 'Tous droits réservés.');
    
    if (copyrightText.includes('MYK')) {
      const parts = copyrightText.split('MYK');
      return (
        <>
          {parts[0]}
          <span className="text-primary-500 font-medium">MYK</span>
          {parts[1] || ''}
        </>
      );
    }
    
    return copyrightText;
  };

  const backgroundGradient = 'var(--background-gradient)';
  const cardBg = 'var(--background-card)';
  const cardBorder = '1px solid var(--border-color)';
  const cardShadow = isDarkMode
    ? '0 25px 45px rgba(15, 23, 42, 0.55)'
    : '0 25px 45px rgba(59, 130, 246, 0.18)';
  const titleGradient = 'from-[var(--accent-color-primary)] to-[var(--accent-color-secondary)]';
  const subtitleColor = `text-[color:var(--text-secondary)]`;
  const labelClasses = 'block text-sm font-medium text-[color:var(--text-secondary)] mb-2 transition-colors group-hover:text-[color:var(--accent-color-primary)]';
  const inputBg = 'var(--background-input)';
  const inputBorder = '1px solid var(--border-color)';
  const inputTextClass = 'text-[color:var(--text-primary)]';
  const inputPlaceholderClass = 'placeholder-[color:var(--text-secondary)]';
  const iconColor = 'var(--accent-color-primary)';
  const checkboxClasses = isDarkMode
    ? 'text-[color:var(--accent-color-secondary)] focus:ring-[color:var(--accent-color-primary)] border-[color:var(--border-color)] bg-[color:var(--background-input)]'
    : 'text-[color:var(--accent-color-primary)] focus:ring-[color:var(--accent-color-primary)] border-[color:var(--border-color)] bg-[color:var(--background-card)]';
  const errorBgClass = isDarkMode
    ? 'bg-error-500/10 text-error-100 border border-error-300'
    : 'bg-error-100 text-error-700 border border-error-300';
  const buttonBackground = 'linear-gradient(90deg, var(--accent-color-primary) 0%, var(--accent-color-secondary) 100%)';
  const buttonShadow = isDarkMode
    ? '0 12px 30px rgba(62, 130, 246, 0.25)'
    : '0 12px 30px rgba(14, 165, 233, 0.2)';
  const footerTextColor = `text-[color:var(--text-secondary)]`;
  const footerDivider = 'via-[color:var(--accent-color-secondary)]';

  const themeDecorColors = isDarkMode
    ? ['rgba(14, 165, 233, 0.3)', 'rgba(59, 130, 246, 0.25)', 'rgba(16, 185, 129, 0.25)', 'rgba(239, 68, 68, 0.18)']
    : ['rgba(59, 130, 246, 0.18)', 'rgba(14, 165, 233, 0.22)', 'rgba(16, 185, 129, 0.2)', 'rgba(245, 158, 11, 0.2)'];

  // Simple geometric shapes for background decoration
  const decorativeShapes = [
    // Simple circle
    <circle cx="12" cy="12" r="8" strokeWidth="2" fill="none"/>,
    // Rounded rectangle
    <rect x="4" y="4" width="16" height="16" rx="4" ry="4" strokeWidth="2" fill="none"/>,
    // Star
    <path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z" strokeWidth="2" fill="none"/>
  ];

  const getRandomColor = () => themeDecorColors[Math.floor(Math.random() * themeDecorColors.length)];

  return (
    <div
      className="w-full min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        background: backgroundGradient,
      }}
    >
      {/* Decorative background elements */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 20%, ${themeDecorColors[0]} 0%, transparent 52%),
            radial-gradient(circle at 78% 82%, ${themeDecorColors[1]} 0%, transparent 52%),
            radial-gradient(circle at 35% 68%, ${themeDecorColors[2]} 0%, transparent 55%),
            radial-gradient(circle at 70% 25%, ${themeDecorColors[3]} 0%, transparent 58%)
          `
        }}
      />

      {/* Animated grid background */}
      <div
        className="absolute inset-0 opacity-1"
        style={{
          backgroundImage: `
            linear-gradient(${isDarkMode ? 'rgba(90, 126, 189, 0.08)' : 'rgba(29, 79, 145, 0.08)'} 1px, transparent 1px),
            linear-gradient(90deg, ${isDarkMode ? 'rgba(89, 195, 195, 0.08)' : 'rgba(246, 139, 31, 0.09)'} 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Animated decorative circles */}
      <div className="absolute top-10 left-10 w-32 h-32 border opacity-20 rounded-full animate-spin-slow" style={{ borderColor: 'var(--accent-color-primary)' }} />
      <div className="absolute bottom-10 right-10 w-24 h-24 border opacity-20 rounded-full animate-bounce" style={{ borderColor: 'var(--accent-color-secondary)' }} />
      <div className="absolute top-1/3 right-20 w-16 h-16 border opacity-20 rounded-full animate-pulse" style={{ borderColor: 'var(--accent-color-tertiary)' }} />

      {/* Decorative Shapes */}
      {[...Array(8)].map((_, i) => {
        const shape = decorativeShapes[Math.floor(Math.random() * decorativeShapes.length)];
        const size = Math.random() * 30 + 15; // Size between 15px and 45px
        const color = getRandomColor();
        const animationDuration = `${Math.random() * 8 + 4}s`; // 4 to 12 seconds
        const animationDelay = `${Math.random() * 3}s`; // 0 to 3 seconds
        const animationType = ['animate-float', 'animate-pulse'][Math.floor(Math.random() * 2)];

        return (
          <svg
            key={`decorative-shape-${i}`}
            className={`absolute opacity-10 ${animationType}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${size}px`,
              height: `${size}px`,
              animationDuration: animationDuration,
              animationDelay: animationDelay,
              transform: `rotate(${Math.random() * 360}deg)` // Initial random rotation
            }}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
          >
            {shape}
          </svg>
        );
      })}

      {/* Main content */}
      <div
        className="w-full max-w-md p-8 relative z-10 transform hover:scale-100 transition-transform duration-300"
        style={{
          backgroundColor: cardBg,
          borderRadius: '1.5rem',
          boxShadow: cardShadow,
          backdropFilter: 'blur(15px)',
          border: cardBorder
        }}
      >
        {/* Logo and title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div
              className="p-3 rounded-full"
              style={{
                width: '110px',
                height: '110px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <OptimizedImage
                src="/MalianDevs-logo.jpg"
                alt={getTranslation('auth.logoAlt', 'Logo Dashboard Template')}
                className="w-full h-full object-cover"
                placeholder={true}
                placeholderColor={isDarkMode ? '#0EA5E9' : '#3B82F6'}
              />
            </div>
          </div>

          <h1 className={`text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r ${titleGradient} animate-pulse`}>
            {getTranslation('app.title', 'Dashboard Template')}
          </h1>
          <p className={`${subtitleColor} text-lg font-medium`}>
            {getTranslation('app.subtitle', 'Modern Web Application')}
          </p>
          <div className={`w-20 h-1 bg-gradient-to-r ${titleGradient} mx-auto mt-2 rounded-full`} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username field */}
          <div className="group">
            <label htmlFor="nomUtilisateur" className={labelClasses}>
              {getTranslation('auth.usernameLabel', 'Nom d\'utilisateur')}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={20} className="transition-colors" style={{ color: iconColor }} />
              </div>
              <input
                id="nomUtilisateur"
                type="text"
                autoComplete="username"
                className={`pl-10 pr-3 py-3 w-full rounded-lg outline-none focus:ring-2 focus:ring-[color:var(--accent-color-primary)] focus:border-transparent transition-all duration-300 group-hover:shadow-lg ${inputTextClass} ${inputPlaceholderClass}`}
                style={{
                  backgroundColor: inputBg,
                  border: inputBorder,
                }}
                placeholder={getTranslation('auth.usernamePlaceholder', 'Entrez votre nom d\'utilisateur')}
                value={nomUtilisateur}
                onChange={(e) => setNomUtilisateur(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Password field */}
          <div className="group">
            <label htmlFor="motDePasse" className={labelClasses}>
              {getTranslation('auth.passwordLabel', 'Mot de passe')}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={20} className="transition-colors" style={{ color: iconColor }} />
              </div>
              <input
                id="motDePasse"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                className={`pl-10 pr-12 py-3 w-full rounded-lg outline-none focus:ring-2 focus:ring-[color:var(--accent-color-primary)] focus:border-transparent transition-all duration-300 group-hover:shadow-lg ${inputTextClass} ${inputPlaceholderClass}`}
                style={{
                  backgroundColor: inputBg,
                  border: inputBorder,
                }}
                placeholder={getTranslation('auth.passwordPlaceholder', 'Entrez votre mot de passe')}
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                required
                disabled={isSubmitting}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center transition-colors hover:opacity-80"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isSubmitting}
                style={{ color: iconColor }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Checkbox */}
          <div className="flex items-center group">
            <input
              id="remember-me"
              type="checkbox"
              className={`h-4 w-4 rounded transition-all duration-300 ${checkboxClasses}`}
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isSubmitting}
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-[color:var(--text-secondary)] transition-colors cursor-pointer hover:text-[color:var(--accent-color-primary)]">
              {getTranslation('auth.rememberMe', 'Se souvenir de moi')}
            </label>
          </div>

          {/* Error message */}
          {showError && (
            <div
              className={`p-4 rounded-lg text-sm flex items-center animate-shake ${errorBgClass}`}
              style={{ animation: 'shake 0.5s ease-in-out' }}
            >
              <AlertCircle size={20} className="mr-3 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Login button */}
          <button
            type="submit"
            className="w-full py-3 px-4 rounded-lg font-medium text-white flex items-center justify-center transform hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-2xl"
            style={{
              background: buttonBackground,
              boxShadow: buttonShadow
            }}
            disabled={isSubmitting || loading}
          >
            {isSubmitting ? (
              <div className="w-6 h-6 border-t-2 border-white border-solid rounded-full animate-spin" />
            ) : (
              <>
                <span className="font-semibold">{getTranslation('auth.loginButton', 'Se connecter')}</span>
                <LogIn size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className={`w-full h-px bg-gradient-to-r from-transparent ${footerDivider} to-transparent mb-4`} />
          <p className={`text-xs ${footerTextColor} opacity-75`}>
            © 2025 Dashboard Template. {renderCopyright()}
          </p>
        </div>
      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .hover\\:scale-104 {
          transform: scale(1.02);
        }

        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;