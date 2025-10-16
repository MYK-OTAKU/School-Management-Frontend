import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Globe, 
  Palette, 
  Save,
  Bell,
  Monitor,
  Database,
  Download,
  Check
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useSearchParams } from 'react-router-dom';
import NotificationSettings from '../../components/settings/NotificationSettings';

const Settings = () => {
  const { user } = useAuth();
  // ✅ i18n: Utilise getTranslation pour cohérence avec LanguageContext (supprime translations non exposé)
  const { getTranslation, currentLanguage, setLanguage, availableLanguages } = useLanguage();
  const { theme, setTheme, availableThemes } = useTheme();
  const [searchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    notifications: true,
    autoSave: true,
    sessionTimeout: 60,
    theme: theme?.mode || theme || 'dark',
    language: currentLanguage || 'fr'
  });

  // Synchroniser l'état local avec les contextes au montage et quand ils changent
  useEffect(() => {
    const currentThemeValue = theme?.mode || theme || 'dark';
    const currentLang = currentLanguage || 'fr';
    
    console.log('🏁 [SETTINGS] Initialisation/Sync:', { currentThemeValue, currentLang });
    
    setSettings(prev => ({
      ...prev,
      theme: currentThemeValue,
      language: currentLang
    }));
  }, [theme, currentLanguage]); // Réagir aux changements de contexte

  // ✅ DIAGNOSTIC pour identifier la structure du thème
  useEffect(() => {
    console.log('🔍 [SETTINGS] Diagnostic thème:', {
      theme,
      themeMode: theme?.mode,
      themeType: typeof theme,
      currentLanguage,
      availableThemes,
      availableLanguages
    });
  }, [theme, currentLanguage, availableThemes, availableLanguages]);

  // Gérer l'onglet depuis les paramètres d'URL
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && ['general', 'appearance', 'language', 'notifications', 'account', 'system'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  const handleSettingChange = (key, value) => {
    console.log(`🔧 [SETTINGS] Changement ${key}:`, value);
    
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    
    // Appliquer immédiatement pour thème et langue via les contextes
    if (key === 'theme') {
      setTheme(value);
    } else if (key === 'language') {
      setLanguage(value);
    }
  };

  const handleSave = () => {
    console.log('💾 [SETTINGS] Sauvegarde des paramètres:', settings);
  };

  // ✅ i18n: Tabs avec getTranslation pour labels
  const tabs = [
    { id: 'general', label: getTranslation('settings.generalTab', 'Général'), icon: <SettingsIcon size={16} /> },
    { id: 'appearance', label: getTranslation('settings.appearanceTab', 'Apparence'), icon: <Palette size={16} /> },
    { id: 'language', label: getTranslation('settings.languageTab', 'Langue'), icon: <Globe size={16} /> },
    { id: 'notifications', label: getTranslation('settings.notificationsTab', 'Notifications'), icon: <Bell size={16} /> },
    { id: 'account', label: getTranslation('settings.accountTab', 'Compte'), icon: <User size={16} /> },
    { id: 'system', label: getTranslation('settings.systemTab', 'Système'), icon: <Database size={16} /> }
  ];

  // ✅ CORRECTION: Détection plus robuste du mode sombre
  const currentTheme = theme?.mode || theme || 'dark';
  const isDarkMode = currentTheme === 'dark';

  console.log('🎨 [SETTINGS] Mode actuel:', { currentTheme, isDarkMode });

  // ✅ HARMONISATION: Styles identiques au Dashboard
  const containerBg = 'bg-card';
  const containerBorder = 'border-primary-400/20';
  const textColor = 'text-text-main';
  const secondaryTextColor = 'text-text-muted';
  const inputBg = 'bg-secondary-700/50';
  const inputBorder = 'border-secondary-600 focus:border-primary-500';
  const primaryButtonBg = 'bg-primary-600 hover:bg-primary-700';
  const tabButtonActiveBg = 'bg-primary-600 text-white shadow-lg';
  const tabButtonInactiveBg = 'text-text-muted hover:text-text-main hover:bg-primary-600/20';
  const iconColor = 'text-primary-400';
  const checkboxColor = 'text-primary-600 focus:ring-primary-500';

  // ✅ CORRECTION: Styles de sélection beaucoup plus contrastés
  const optionSelectedStyle = (value, type) => {
    const isSelected = (type === 'theme' && settings.theme === value) || (type === 'language' && settings.language === value);
    return isSelected
      ? 'border-primary-500 bg-primary-500/20 shadow-lg ring-2 ring-primary-400/30'
      : 'border-secondary-600 bg-secondary-700/50 hover:border-primary-500 hover:bg-primary-500/10';
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <h3 className={`text-lg font-semibold ${textColor} mb-4 transition-colors duration-300`}>
              {getTranslation('settings.generalSettingsTitle', 'Paramètres généraux')}
            </h3>
            
            <div className="space-y-6">
              <div className={`flex items-center justify-between p-4 rounded-lg ${inputBg}`}>
                <div>
                  <label className={`${textColor} font-medium transition-colors duration-300`}>
                    {getTranslation('settings.autoSaveLabel', 'Sauvegarde automatique')}
                  </label>
                  <p className={`${secondaryTextColor} text-sm transition-colors duration-300`}>
                    {getTranslation('settings.autoSaveDescription', 'Sauvegarder automatiquement les modifications')}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoSave}
                  onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
                  className={`w-5 h-5 rounded ${checkboxColor} transition-colors duration-300`}
                />
              </div>
              
              <div className={`p-4 rounded-lg ${inputBg}`}>
                <label className={`block ${textColor} font-medium mb-3 transition-colors duration-300`}>
                  {getTranslation('settings.sessionTimeoutLabel', 'Délai d\'expiration de session')}
                </label>
                <select
                  value={settings.sessionTimeout}
                  onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                  className={`w-full p-3 rounded-lg ${inputBg} ${textColor} border ${inputBorder} focus:outline-none transition-all duration-300`}
                >
                  <option value={30}>30 {getTranslation('settings.minutes', 'minutes')}</option>
                  <option value={60}>1 {getTranslation('settings.hour', 'heure')}</option>
                  <option value={120}>2 {getTranslation('settings.hours', 'heures')}</option>
                  <option value={240}>4 {getTranslation('settings.hours', 'heures')}</option>
                  <option value={480}>8 {getTranslation('settings.hours', 'heures')}</option>
                </select>
              </div>
            </div>
          </div>
        );
        
      case 'appearance':
        return (
          <div className="space-y-6">
            <h3 className={`text-lg font-semibold ${textColor} mb-4 transition-colors duration-300`}>
              {getTranslation('settings.appearanceTitle', 'Apparence')}
            </h3>
            
            <div>
              <label className={`block ${textColor} font-medium mb-4 transition-colors duration-300`}>
                {getTranslation('settings.themeLabel', 'Thème')}
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(availableThemes || [
                  { value: 'light', label: getTranslation('settings.themeLight', 'Clair'), description: getTranslation('settings.themeLightDesc', 'Interface claire') },
                  { value: 'dark', label: getTranslation('settings.themeDark', 'Sombre'), description: getTranslation('settings.themeDarkDesc', 'Interface sombre') },
                  { value: 'auto', label: getTranslation('settings.themeAuto', 'Auto'), description: getTranslation('settings.themeAutoDesc', 'Selon le système') }
                ]).map((themeOption) => {
                  const isSelected = settings.theme === themeOption.value;
                  return (
                    <button
                      key={themeOption.value}
                      onClick={() => handleSettingChange('theme', themeOption.value)}
                      className={`relative p-4 rounded-lg border-2 transition-all duration-300 ${optionSelectedStyle(themeOption.value, 'theme')}`}
                    >
                      {isSelected && (
                        <div className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center bg-primary-500`}>
                          <Check size={14} className="text-white" />
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-3">
                        <Palette size={20} className={`${iconColor} transition-colors duration-300`} />
                        <div className="text-left">
                          <p className={`${textColor} font-medium transition-colors duration-300`}>
                            {themeOption.label}
                          </p>
                          <p className={`${secondaryTextColor} text-sm transition-colors duration-300`}>
                            {themeOption.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              
              <div className="mt-6 p-4 rounded-lg border-2 border-dashed border-primary-500/50 bg-primary-500/10">
                <p className={`${textColor} text-sm font-medium mb-2`}>
                  {getTranslation('settings.currentThemePreview', 'Aperçu du thème actuel')} : <span className={`${iconColor} font-semibold`}>
                    {isDarkMode ? '🌙 ' + getTranslation('settings.themeDark', 'Sombre') : '☀️ ' + getTranslation('settings.themeLight', 'Clair')}
                  </span>
                </p>
                <p className={`${secondaryTextColor} text-xs`}>
                  {getTranslation('settings.themePreviewDescription', 'Cette prévisualisation reflète le thème actuellement appliqué')}
                </p>
              </div>
            </div>
          </div>
        );
        
      case 'language':
        return (
          <div className="space-y-6">
            <h3 className={`text-lg font-semibold ${textColor} mb-4 transition-colors duration-300`}>
              {getTranslation('settings.languageTab', 'Langue')}
            </h3>
            
            <div>
              <label className={`block ${textColor} font-medium mb-4 transition-colors duration-300`}>
                {getTranslation('settings.languageInterfaceLabel', 'Langue de l\'interface')}
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(availableLanguages || [
                  { code: 'fr', name: 'Français', nativeName: 'Français' },
                  { code: 'en', name: 'English', nativeName: 'English' },
                  { code: 'ar', name: 'العربية', nativeName: 'العربية' }
                ]).map((lang) => {
                  // ✅ Utiliser currentLanguage du contexte au lieu de settings.language pour éviter les désynchronisations
                  const isSelected = currentLanguage === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => handleSettingChange('language', lang.code)}
                      className={`relative p-4 rounded-lg border-2 transition-all duration-300 ${optionSelectedStyle(lang.code, 'language')}`}
                    >
                      {isSelected && (
                        <div className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center bg-primary-500`}>
                          <Check size={14} className="text-white" />
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-3">
                        <Globe size={20} className={`${iconColor} transition-colors duration-300`} />
                        <div className="text-left">
                          <p className={`${textColor} font-medium transition-colors duration-300`}>
                            {lang.name}
                          </p>
                          <p className={`${secondaryTextColor} text-sm transition-colors duration-300`}>
                            {lang.nativeName}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              
              <div className="mt-6 p-4 rounded-lg border-2 border-dashed border-primary-500/50 bg-primary-500/10">
                <p className={`${textColor} text-sm font-medium mb-2`}>
                  {getTranslation('settings.currentLanguagePreview', 'Langue actuelle')} : <span className={`${iconColor} font-semibold`}>
                    {/* ✅ Utiliser currentLanguage du contexte pour affichage correct */}
                    {currentLanguage?.toUpperCase()} - {
                      availableLanguages?.find(l => l.code === currentLanguage)?.name || currentLanguage
                    }
                  </span>
                </p>
                <p className={`${secondaryTextColor} text-xs`}>
                  {getTranslation('settings.languageChangesImmediate', 'Les changements de langue sont appliqués immédiatement')}
                </p>
              </div>
            </div>
          </div>
        );
        
      case 'notifications':
        return <NotificationSettings />;
        
      case 'account':
        return (
          <div className="space-y-6">
            <h3 className={`text-lg font-semibold ${textColor} mb-4 transition-colors duration-300`}>
              {getTranslation('settings.accountInfoTitle', 'Informations du compte')}
            </h3>
            
            <div className={`${inputBg} rounded-lg p-6 space-y-4 transition-colors duration-300 border border-primary-500/30`}>
              <div className="flex items-center space-x-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-r from-primary-500 to-accent-500`}>
                  <span className="text-white font-bold text-lg">
                    {user?.firstName?.charAt(0) || 'U'}{user?.lastName?.charAt(0) || 'U'}
                  </span>
                </div>
                <div>
                  <p className={`${textColor} font-semibold text-lg transition-colors duration-300`}>
                    {user?.firstName || 'Utilisateur'} {user?.lastName || ''}
                  </p>
                  <p className={`${secondaryTextColor} transition-colors duration-300`}>
                    {user?.email || 'email@exemple.com'}
                  </p>
                  <p className={`${iconColor} text-sm font-medium transition-colors duration-300`}>
                    {user?.role?.name || 'Utilisateur'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'system':
        return (
          <div className="space-y-6">
            <h3 className={`text-lg font-semibold ${textColor} mb-4 transition-colors duration-300`}>
              {getTranslation('settings.systemInfoTitle', 'Informations système')}
            </h3>
            
            <div className="space-y-4">
              <div className={`${inputBg} rounded-lg p-4 transition-colors duration-300 border border-primary-500/20`}>
                <div className="flex items-center space-x-3 mb-2">
                  <Database size={16} className={`${iconColor}`} />
                  <span className={`${textColor} font-medium transition-colors duration-300`}>
                    {getTranslation('settings.databaseLabel', 'Base de données')}
                  </span>
                </div>
                <p className={`${secondaryTextColor} text-sm transition-colors duration-300`}>
                  {getTranslation('settings.databaseDescription', 'SQLite - Stockage local')}
                </p>
              </div>
              
              <div className={`${inputBg} rounded-lg p-4 transition-colors duration-300 border border-primary-500/20`}>
                <div className="flex items-center space-x-3 mb-2">
                  <Monitor size={16} className={`${iconColor}`} />
                  <span className={`${textColor} font-medium transition-colors duration-300`}>
                    {getTranslation('settings.appVersionLabel', 'Version de l\'application')}
                  </span>
                </div>
                <p className={`${secondaryTextColor} text-sm transition-colors duration-300`}>
                  {getTranslation('settings.appVersionValue', 'Dashboard Template v1.0.0')}
                </p>
              </div>
              
              <button className={`flex items-center space-x-2 px-6 py-3 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl ${primaryButtonBg}`}>
                <Download size={16} />
                <span>{getTranslation('settings.exportDataButton', 'Exporter les données')}</span>
              </button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div 
      className="w-full h-full space-y-6 p-6 min-h-full flex flex-col transition-all duration-500 bg-transparent"
    >
      {/* ✅ NOUVEAU: Container interne avec padding minimal */}
      <div className="flex-1 w-full p-4">
        {/* En-tête */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className={`text-3xl font-bold ${textColor} transition-colors duration-300`}>
              {getTranslation('settings.settingsTitle', 'Paramètres')}
            </h1>
            <p className={`${secondaryTextColor} mt-1 transition-colors duration-300`}>
              {getTranslation('settings.settingsDescription', 'Personnalisez votre expérience')}
            </p>
          </div>
          <button
            onClick={handleSave}
            className={`flex items-center space-x-2 px-6 py-3 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl ${primaryButtonBg}`}
          >
            <Save size={16} />
            <span>{getTranslation('settings.saveButton', 'Sauvegarder')}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Navigation des onglets */}
          <div className="lg:col-span-1">
            <div className={`rounded-lg border ${containerBorder} p-4 transition-all duration-300 shadow-lg ${containerBg} backdrop-blur-sm`}>
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 font-medium ${
                      activeTab === tab.id
                        ? tabButtonActiveBg
                        : tabButtonInactiveBg
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Contenu de l'onglet */}
          <div className="lg:col-span-3">
            <div className={`rounded-lg border ${containerBorder} p-8 transition-all duration-300 shadow-lg ${containerBg} backdrop-blur-sm`}>
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;