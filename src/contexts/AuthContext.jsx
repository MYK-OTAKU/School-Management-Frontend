import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import authService from '../services/authService';
import { useNotification } from '../hooks/useNotification';

// AuthContext pour la gestion de l'authentification
import { isTokenExpired, getTokenExpiryDate } from '../utils/tokenUtils';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [tempAuthData, setTempAuthData] = useState(null);
  const [token, setToken] = useState(null);
  const [initialAuthCheckComplete, setInitialAuthCheckComplete] = useState(false);
  const [sessionExpiresAt, setSessionExpiresAt] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { showSessionExpired } = useNotification();
  
  // Suppression des références à showToast - maintenant géré par le système de notifications
  
  // ✅ Refs pour éviter les boucles infinies
  const isInitializing = useRef(false);
  const loginInProgress = useRef(false);
  const redirectionHandled = useRef(false);

  // ✅ Surveillance de l'expiration du token
  useEffect(() => {
    if (token && isAuthenticated) {
      const expiryDate = getTokenExpiryDate(token);
      setSessionExpiresAt(expiryDate);
      
      const checkTokenExpiry = () => {
        if (isTokenExpired(token)) {
          // Log de débogage du token expiré
          clearAuthState();
          showSessionExpired();
          navigate('/', { replace: true });
        }
      };
      
      const intervalId = setInterval(checkTokenExpiry, 30000);
      return () => clearInterval(intervalId);
    } else {
      setSessionExpiresAt(null);
    }
  }, [token, isAuthenticated]);

  // Fonction pour nettoyer l'état d'authentification
  const clearAuthState = useCallback(() => {
    // Nettoyage de l'état d'authentification
    setUser(null);
    setIsAuthenticated(false);
    setTwoFactorRequired(false);
    setTempAuthData(null);
    setToken(null);
    setSessionExpiresAt(null);
    redirectionHandled.current = false;
    authService.clearAuthData();
  }, []);

  // ✅ CORRECTION CRITIQUE: Gestion centralisée des redirections
  useEffect(() => {
    if (!initialAuthCheckComplete || loading) return;

    // ✅ Éviter les redirections multiples
    if (redirectionHandled.current) return;

    // Gestion des redirections

    // ✅ Cas 1: Utilisateur complètement authentifié - rediriger vers dashboard
    if (isAuthenticated && user && !twoFactorRequired) {
      if (location.pathname === '/' || location.pathname === '/verify-2fa') {
        // Redirection vers le tableau de bord
        redirectionHandled.current = true;
        navigate('/dashboard', { replace: true });
        return;
      }
    }

    // ✅ CORRECTION: Cas 2: 2FA requis - rediriger vers page 2FA
    if (twoFactorRequired && tempAuthData?.tempToken && !isAuthenticated) {
      if (location.pathname !== '/verify-2fa') { // ✅ Condition corrigée
        // Redirection vers la vérification 2FA
        redirectionHandled.current = true;
        navigate('/verify-2fa', { replace: true }); // ✅ Route corrigée
        return;
      }
    }

    // ✅ Cas 3: Pas d'authentification - rediriger vers login
    if (!isAuthenticated && !twoFactorRequired && !tempAuthData) {
      if (location.pathname !== '/') {
        // Redirection vers la page de connexion
        redirectionHandled.current = true;
        navigate('/', { replace: true });
        return;
      }
    }

  }, [initialAuthCheckComplete, loading, isAuthenticated, user, twoFactorRequired, tempAuthData, location.pathname, navigate]);

  // ✅ Initialisation au montage
  useEffect(() => {
    const initAuth = async () => {
      if (isInitializing.current) return;
      isInitializing.current = true;

      // Initialisation de l'authentification
      try {
        setLoading(true);
        authService.init();
        
        if (authService.isAuthenticated()) {
          const currentUser = authService.getCurrentUser();
          const currentToken = authService.getToken();
          
          if (currentToken && !isTokenExpired(currentToken)) {
            // Utilisateur déjà connecté
            setUser(currentUser);
            setToken(currentToken);
            setIsAuthenticated(true);
            setTwoFactorRequired(false);
            setTempAuthData(null);
          } else {
            // Token expiré, nettoyage en cours
            clearAuthState();
          }
        } else {
          // Aucune session active trouvée
          clearAuthState();
        }
      } catch (error) {
        console.error('❌ [AUTH_CONTEXT] Erreur lors de l\'initialisation:', error);
        clearAuthState();
      } finally {
        setLoading(false);
        setInitialAuthCheckComplete(true);
        isInitializing.current = false;
        // Initialisation terminée
      }
    };

    initAuth();
  }, []);

  // Écouter les événements d'expiration de session
  useEffect(() => {
    const handleSessionExpired = (event) => {
      // Gestion de l'expiration de session
      clearAuthState();
      showSessionExpired();
      
      if (!location.pathname.includes('/')) {
        navigate('/', { replace: true });
      }
    };

    window.addEventListener('auth:sessionExpired', handleSessionExpired);
    
    return () => {
      window.removeEventListener('auth:sessionExpired', handleSessionExpired);
    };
  }, [clearAuthState, showSessionExpired, navigate, location.pathname]);

  // Fonction de connexion avec gestion du 2FA
  const login = useCallback(async (credentials) => {
    if (loginInProgress.current) {
      return;
    }

    loginInProgress.current = true;
    redirectionHandled.current = false;
    
    try {
      setLoading(true);
      const response = await authService.login(credentials);
      
      // 2FA requis
      if (response.success && response.requireTwoFactor) {
        const authData = {
          tempToken: response.tempToken || '',
          userId: response.userId || '',
          message: response.message || '',
          qrCodeUrl: response.qrCodeUrl || '',
          qrCodeExists: !!response.qrCodeUrl,
          manualEntryKey: response.manualEntryKey || '',
          isNewSetup: response.isNewSetup || false,
          setupReason: response.setupReason || 'STANDARD',
          requiresNewConfiguration: response.requiresNewConfiguration || false
        };
        
        setTempAuthData(authData);
        setTwoFactorRequired(true);
        setIsAuthenticated(false);
        setUser(null);
        setToken(null);
        return response;
      }
      
      // Connexion réussie sans 2FA
      if (response.success && response.token && response.user) {
        const currentUser = authService.getCurrentUser();
        const currentToken = authService.getToken();
        
        setUser(currentUser);
        setToken(currentToken);
        setIsAuthenticated(true);
        setTwoFactorRequired(false);
        setTempAuthData(null);
        
        return response;
      }
      
      throw new Error('Réponse de connexion invalide du serveur');
      
    } catch (error) {
      console.error('Erreur de connexion:', error);
      clearAuthState();
      throw error;
    } finally {
      setLoading(false);
      loginInProgress.current = false;
    }
  }, [clearAuthState]);

  // Fonction de vérification 2FA
  const verifyTwoFactor = useCallback(async (twoFactorCode) => {
    if (!tempAuthData?.tempToken) {
      throw new Error("Token temporaire manquant pour la vérification 2FA");
    }
    
    redirectionHandled.current = false;
    
    try {
      setLoading(true);
      const response = await authService.verifyTwoFactor(tempAuthData.tempToken, twoFactorCode);
      
      if (response.success && response.token && response.user) {
        const currentUser = authService.getCurrentUser();
        const currentToken = authService.getToken();
        
        setUser(currentUser);
        setToken(currentToken);
        setIsAuthenticated(true);
        setTwoFactorRequired(false);
        setTempAuthData(null);
        
        return response;
      }
      
      throw new Error('Échec de la vérification 2FA');
      
    } catch (error) {
      console.error('Erreur 2FA:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [clearAuthState, tempAuthData]);

  // Fonction de déconnexion
  const logout = useCallback(async (reason = null) => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      clearAuthState();
      navigate('/', { replace: true });
    }
  }, [clearAuthState, navigate]);

  // Fonction de vérification de permission
  const hasPermission = useCallback((permission) => {
    if (!user || !user.role || !user.role.permissions) {
      return false;
    }

    // Vérifier si c'est un admin (accès total)
    if (user.role.permissions.includes('ADMIN')) {
      return true;
    }

    // Vérifier la permission spécifique
    return user.role.permissions.includes(permission);
  }, [user]);

  // Fonction de vérification de rôle
  const hasRole = useCallback((roleName) => {
    if (!user || !user.role) return false;
    return user.role.name === roleName;
  }, [user]);

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    loadingInitial: loading,
    initialAuthCheckComplete,
    twoFactorRequired,
    tempAuthData,
    sessionExpiresAt,
    login,
    logout,
    verifyTwoFactor,
    hasPermission,
    hasRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};