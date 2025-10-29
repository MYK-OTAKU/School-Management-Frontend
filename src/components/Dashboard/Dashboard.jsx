import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';

// Pages du dashboard
import Home from '../../pages/Home/Home';
import ClassroomPage from '../../pages/Classroom/ClassroomPage';
import SchoolYearPage from '../../pages/SchoolYear/SchoolYearPage';
import StudentPage from '../../pages/Student/StudentPage';
import PaymentPage from '../../pages/Payment/PaymentPage';
import Users from '../../pages/Users/Users';
import Roles from '../../pages/Roles/Roles';
import Permissions from '../../pages/Permissions/Permissions';
import Settings from '../../pages/Settings/Settings';
import Monitoring from '../../pages/Monitoring/Monitoring';
import Notifications from '../../pages/Notifications/Notifications';

const Dashboard = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { user, hasPermission } = useAuth();
  const { effectiveTheme } = useTheme(); // Utiliser effectiveTheme

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarExpanded(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  // Debug des permissions
  useEffect(() => {
    if (user) {
      console.log('👤 Dashboard - Utilisateur:', {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role?.name,
        permissions: user.role?.permissions?.map(p => p.name || p) // ✅ Gestion des deux formats
      });
    }
  }, [user]);

  // Détection du mode sombre/clair basé sur effectiveTheme
  const isDarkMode = effectiveTheme === 'dark';

  console.log('🎨 [DASHBOARD] Debug thème:', {
    effectiveTheme,
    isDarkMode,
    themeType: typeof effectiveTheme
  });

  // Styles dynamiques harmonisés pour le fond du dashboard
  const dashboardBackground = 'var(--background-gradient)';

  // Le fond du main content sera transparent, les pages géreront leur propre fond
  const mainContentBg = 'transparent'; 
  const mainContentBackdropFilter = 'none'; 

  // Styles pour les éléments décoratifs adaptés au thème
  const decorativeElementsOpacity = isDarkMode ? 0.08 : 0.05;
  const gridOpacity = isDarkMode ? 0.06 : 0.04;

  return (
    <div 
      className="flex flex-col h-screen relative overflow-hidden transition-all duration-500"
      style={{
        background: dashboardBackground,
        minHeight: '100vh'
      }}
    >
      {/* Éléments décoratifs adaptés au thème */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          opacity: decorativeElementsOpacity,
          backgroundImage: `
            radial-gradient(circle at 12% 18%, var(--accent-color-primary) 0%, transparent 55%),
            radial-gradient(circle at 82% 84%, var(--accent-color-secondary) 0%, transparent 55%),
            radial-gradient(circle at 32% 58%, var(--accent-color-tertiary) 0%, transparent 58%)
          `
        }}
      />
      
      {/* Grille de fond adaptée au thème */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          opacity: gridOpacity,
          backgroundImage: isDarkMode ? `
            linear-gradient(rgba(90, 126, 189, 0.11) 1px, transparent 1px),
            linear-gradient(90deg, rgba(89, 195, 195, 0.1) 1px, transparent 1px)
          ` : `
            linear-gradient(rgba(29, 79, 145, 0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(246, 139, 31, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px'
        }}
      />

      {/* Header (couleurs fixes, non affectées par le thème global) */}
      <Header 
        toggleSidebar={toggleSidebar}
        sidebarExpanded={sidebarExpanded}
        isMobile={isMobile}
      />

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden relative z-10">
        {/* Sidebar (couleurs fixes, non affectées par le thème global) */}
        <Sidebar
          expanded={sidebarExpanded}
          toggleSidebar={toggleSidebar}
          isMobile={isMobile}
        />

        {/* Main content transparent - padding minimal */}
        <main 
          className="flex-1 overflow-auto p-7 transition-all duration-500"
          style={{
            backgroundColor: mainContentBg,
            backdropFilter: mainContentBackdropFilter
          }}
        >
          <div className="w-full h-full">
            <Routes>
              <Route path="/" element={<Home />} />
              
              {/* Routes for the school management features */}
              <Route path="/classrooms" element={
                hasPermission('CLASSES_VIEW') ? <ClassroomPage /> : <Navigate to="/dashboard" replace />
              } />

              <Route path="/school-years" element={
                hasPermission('SCHOOL_YEARS_MANAGE') ? <SchoolYearPage /> : <Navigate to="/dashboard" replace />
              } />

              <Route path="/students" element={
                hasPermission('STUDENTS_VIEW') ? <StudentPage /> : <Navigate to="/dashboard" replace />
              } />

              <Route path="/payments" element={
                hasPermission('PAYMENTS_VIEW') ? <PaymentPage /> : <Navigate to="/dashboard" replace />
              } />
              
              {/* ✅ CORRECTION: Utiliser USERS_VIEW */}
              <Route path="/users" element={
                hasPermission('USERS_VIEW') ? <Users /> : <Navigate to="/dashboard" replace />
              } />
              
              {/* ✅ CORRECTION: Utiliser ROLES_VIEW */}
              <Route path="/roles" element={
                hasPermission('ROLES_VIEW') ? <Roles /> : <Navigate to="/dashboard" replace />
              } />
              
              {/* ✅ CORRECTION: Utiliser PERMISSIONS_VIEW */}
              <Route path="/permissions" element={
                hasPermission('PERMISSIONS_VIEW') ? <Permissions /> : <Navigate to="/dashboard" replace />
              } />
              
              {/* Routes monitoring - Permission MONITORING_VIEW */}
              <Route path="/monitoring" element={
                hasPermission('MONITORING_VIEW') ? <Monitoring /> : <Navigate to="/dashboard" replace />
              } />
              
              {/* Settings - accessible à tous */}
              <Route path="/settings" element={<Settings />} />
              <Route path="/notifications" element={<Notifications />} />
              
              {/* Redirection par défaut */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;