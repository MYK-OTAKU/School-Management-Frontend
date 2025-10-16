import React, { createContext, useContext, useState, useEffect } from 'react';

// Créer le Contexte
const ThemeContext = createContext();

// Thèmes disponibles
const availableThemes = [
  {
    value: 'dark',
    label: 'Mode sombre',
    description: 'Thème sombre pour un confort visuel',
    icon: '🌙'
  },
  {
    value: 'light',
    label: 'Mode clair',
    description: 'Thème clair classique',
    icon: '☀️'
  },
  {
    value: 'auto',
    label: 'Automatique',
    description: 'Suit les préférences du système',
    icon: '🔄'
  }
];

// Provider du contexte
export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState('dark');
  const [effectiveTheme, setEffectiveTheme] = useState('dark'); // Le thème réellement appliqué

  // Charger le thème depuis le localStorage au démarrage
  useEffect(() => {
    const savedTheme = localStorage.getItem('preferredTheme');
    if (savedTheme && availableThemes.find(t => t.value === savedTheme)) {
      setThemeState(savedTheme);
      applyTheme(savedTheme);
    } else {
      // Définir 'dark' comme thème par défaut si rien n'est trouvé
      setThemeState('dark');
      localStorage.setItem('preferredTheme', 'dark');
      applyTheme('dark');
    }
  }, []);

  // Écouter les changements de préférences système pour le mode auto
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemThemeChange = () => {
      if (theme === 'auto') {
        applyTheme('auto');
      }
    };
    
    // Utilisation de addEventListener et removeEventListener pour les media queries
    // C'est la méthode moderne et recommandée.
    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, [theme]);

  // Fonction pour appliquer le thème
  const applyTheme = (themeValue) => {
    const root = document.documentElement;
    const body = document.body;
    
    // Nettoyer les classes existantes
    root.classList.remove('dark', 'light');
    body.classList.remove('dark', 'light');
    
    let appliedTheme = 'dark';
    
    switch (themeValue) {
      case 'light':
        root.classList.add('light');
        body.classList.add('light');
        appliedTheme = 'light';
        break;
      case 'dark':
        root.classList.add('dark');
        body.classList.add('dark');
        appliedTheme = 'dark';
        break;
      case 'auto':
        // Détecter la préférence système
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          root.classList.add('dark');
          body.classList.add('dark');
          appliedTheme = 'dark';
        } else {
          root.classList.add('light');
          body.classList.add('light');
          appliedTheme = 'light';
        }
        break;
      default:
        root.classList.add('dark');
        body.classList.add('dark');
        appliedTheme = 'dark';
    }
    
    setEffectiveTheme(appliedTheme);
    
    // Mettre à jour les variables CSS personnalisées
    updateCSSVariables(appliedTheme);
    
    // Déclencher un événement personnalisé pour notifier les composants
    window.dispatchEvent(new CustomEvent('themeChanged', { 
      detail: { theme: themeValue, effectiveTheme: appliedTheme } 
    }));
    
    console.log(`🎨 Thème appliqué: ${themeValue} (effectif: ${appliedTheme})`);
  };

  // Mettre à jour les variables CSS personnalisées
  const updateCSSVariables = (appliedTheme) => {
    const root = document.documentElement;
    
    // Couleurs pour le thème sombre (existantes)
    if (appliedTheme === 'dark') {
      root.style.setProperty('--background-primary', '#0f1828');
      root.style.setProperty('--background-secondary', '#1b2a44');
      root.style.setProperty('--background-card', 'rgba(27, 42, 68, 0.92)');
      root.style.setProperty('--background-input', 'rgba(33, 52, 86, 0.88)');
      root.style.setProperty('--background-modal-card', 'rgba(18, 34, 58, 0.96)');
      root.style.setProperty('--background-gradient', 'linear-gradient(135deg, #0f1828 0%, #1b2a44 52%, #26416b 100%)');
      root.style.setProperty('--sidebar-background', 'linear-gradient(180deg, rgba(15, 24, 40, 0.98), rgba(33, 52, 86, 0.9))');
      root.style.setProperty('--text-primary', '#e2e8f0');
      root.style.setProperty('--text-secondary', '#94a3b8');
      root.style.setProperty('--border-color', 'rgba(90, 126, 189, 0.35)');
      root.style.setProperty('--accent-color-primary', '#3a7bd5');
      root.style.setProperty('--accent-color-secondary', '#f7b046');
      root.style.setProperty('--accent-color-tertiary', '#59c3c3');
      root.style.setProperty('--success-color', '#5ed1b6');
      root.style.setProperty('--error-color', '#f8927e');
      root.style.setProperty('--warning-color', '#fcd34d');
    } else {
      root.style.setProperty('--background-primary', '#fdf6ec');
      root.style.setProperty('--background-secondary', '#f3e4c8');
      root.style.setProperty('--background-card', 'rgba(255, 255, 255, 0.94)');
      root.style.setProperty('--background-input', 'rgba(255, 255, 255, 0.96)');
      root.style.setProperty('--background-modal-card', 'rgba(255, 255, 255, 0.98)');
      root.style.setProperty('--background-gradient', 'linear-gradient(135deg, #fdf6ec 0%, #f1e1c0 50%, #fde4c2 100%)');
      root.style.setProperty('--sidebar-background', 'linear-gradient(180deg, rgba(253, 246, 236, 0.96), rgba(241, 225, 192, 0.88))');
      root.style.setProperty('--text-primary', '#1e293b');
      root.style.setProperty('--text-secondary', '#475569');
      root.style.setProperty('--border-color', 'rgba(29, 79, 145, 0.25)');
      root.style.setProperty('--accent-color-primary', '#1d4f91');
      root.style.setProperty('--accent-color-secondary', '#f68b1f');
      root.style.setProperty('--accent-color-tertiary', '#38a169');
      root.style.setProperty('--success-color', '#38a169');
      root.style.setProperty('--error-color', '#d64545');
      root.style.setProperty('--warning-color', '#f59e0b');
    }
  };

  // Fonction pour changer de thème
  const setTheme = (themeValue) => {
    console.log(`🔄 Changement de thème vers: ${themeValue}`);
    
    if (availableThemes.find(t => t.value === themeValue)) {
      setThemeState(themeValue);
      localStorage.setItem('preferredTheme', themeValue);
      applyTheme(themeValue);
    } else {
      console.error(`❌ Thème non supporté: ${themeValue}`);
    }
  };

  const contextValue = {
    theme,
    effectiveTheme,
    setTheme,
    availableThemes
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook pour utiliser le contexte
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
