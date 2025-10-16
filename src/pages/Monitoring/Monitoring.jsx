import React, { useState } from 'react';
import { MonitoringProvider } from '../../contexts/MonitoringContext';
import SessionsList from '../../components/monitoring/SessionsList';
import ActivityLogList from '../../components/monitoring/ActivityLogList';
import ActivityStats from '../../components/monitoring/ActivityStats';
import UserConnectionHistory from '../../components/monitoring/UserConnectionHistory';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  Activity, 
  Users, 
  BarChart3, 
  Clock,
  ArrowLeft
} from 'lucide-react';

const Monitoring = () => {
  const [activeTab, setActiveTab] = useState('sessions');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [currentView, setCurrentView] = useState('main');
  const { translations, getTranslation } = useLanguage();

  // ✅ CORRECTION: Fonction pour sélectionner un utilisateur
  const handleUserSelect = (userId) => {
    setSelectedUserId(userId);
    setCurrentView('user-history');
  };

  // ✅ CORRECTION: Fonction pour revenir à la vue principale
  const handleBackToMain = () => {
    setCurrentView('main');
    setSelectedUserId(null);
  };

  // ✅ Rendu conditionnel selon la vue actuelle
  if (currentView === 'user-history' && selectedUserId) {
    return (
      <MonitoringProvider>
        <div className="p-6">
          <UserConnectionHistory 
            userId={selectedUserId} 
            onBack={handleBackToMain}
          />
        </div>
      </MonitoringProvider>
    );
  }

  // Vue principale du monitoring
  const tabs = [
    {
      id: 'sessions',
      label: translations?.sessions || 'Sessions',
      icon: <Users size={20} />
    },
    {
      id: 'activities',
      label: translations?.activities || 'Activities',
      icon: <Activity size={20} />
    },
    {
      id: 'stats',
      label: translations?.statistics || 'Statistics',
      icon: <BarChart3 size={20} />
    }
  ];

  return (
    <MonitoringProvider>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-text-main flex items-center">
            <Clock className="mr-3 text-primary-500" />
            {getTranslation('monitoring.title', 'Monitoring')}
          </h1>
          <p className="text-text-muted mt-2">
            {getTranslation('monitoring.description', 'Monitor user sessions and activities')}
          </p>
        </div>

        {/* Onglets */}
        <div className="mb-6">
          <div className="border-b border-primary-400/20">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${ 
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-500'
                      : 'border-transparent text-text-muted hover:text-text-main hover:border-secondary-400'
                  }`}
                >
                  {tab.icon}
                  <span className="ml-2">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Contenu des onglets */}
        <div className="min-h-[400px]">
          {activeTab === 'sessions' && (
            <SessionsList onUserSelect={handleUserSelect} />
          )}
          
          {activeTab === 'activities' && (
            <ActivityLogList onUserSelect={handleUserSelect} />
          )}
          
          {activeTab === 'stats' && (
            <ActivityStats />
          )}
        </div>
      </div>
    </MonitoringProvider>
  );
};

export default Monitoring;