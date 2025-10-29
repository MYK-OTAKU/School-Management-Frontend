import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// ✅ CORRECTION: Import synchrone de TOUTES les pages pour éviter les problèmes de navigation
import HomePage from './pages/Home/Home';
import UsersPage from './pages/Users/Users';
import MonitoringPage from './pages/Monitoring/Monitoring';
import SettingsPage from './pages/Settings/Settings';
import RolesPage from './pages/Roles/Roles';
import PermissionsPage from './pages/Permissions/Permissions';
import NotificationsPage from './pages/Notifications/Notifications';
import ClassroomPage from './pages/Classroom/ClassroomPage';
import SchoolYearPage from './pages/SchoolYear/SchoolYearPage';
import StudentPage from './pages/Student/StudentPage';
import PaymentPage from './pages/Payment/PaymentPage';

// Composant de chargement invisible - aucun flash  
const InvisibleLoader = () => null;

// Ce composant définit les routes internes au Dashboard
const AppRoutes = () => {
  const { hasPermission } = useAuth();

  return (
    <Suspense fallback={<InvisibleLoader />}>
      <Routes>
        {/* Route racine - correspond à /dashboard dans l'URL du navigateur */}
        <Route path="/" element={<HomePage />} />
        

        {/* Routes for the classrooms */}
        <Route path="/classrooms" element={
          hasPermission('CLASSES_VIEW') 
            ? <ClassroomPage /> 
            : <Navigate to="/" replace />
        } />

        {/* Routes for the school years */}
        <Route path="/school-years" element={
          hasPermission('SCHOOL_YEARS_MANAGE')
            ? <SchoolYearPage />
            : <Navigate to="/" replace />
        } />

        {/* Routes for the students */}
        <Route path="/students" element={
          hasPermission('STUDENTS_VIEW')
            ? <StudentPage />
            : <Navigate to="/" replace />
        } />

        {/* Routes for the payments */}
        <Route path="/payments" element={
          hasPermission('PAYMENTS_VIEW')
            ? <PaymentPage />
            : <Navigate to="/" replace />
        } />
        
        {/* Monitoring - pour les admins ou permission spécifique */}
        <Route path="/monitoring" element={
          (hasPermission('MONITORING_VIEW') || hasPermission('ADMIN'))
            ? <MonitoringPage />
            : <Navigate to="/" replace />
        } />
        
        {/* Routes pour l'administration système */}
        <Route path="/users" element={
          hasPermission('USERS_VIEW') 
            ? <UsersPage /> 
            : <Navigate to="/" replace />
        } />
        
        <Route path="/roles" element={
          hasPermission('ROLES_VIEW')
            ? <RolesPage /> 
            : <Navigate to="/" replace />
        } />
        
        <Route path="/permissions" element={
          hasPermission('PERMISSIONS_VIEW')
            ? <PermissionsPage /> 
            : <Navigate to="/" replace />
        } />
        
        {/* Page de notifications accessible à tous les utilisateurs connectés */}
        <Route path="/notifications" element={<NotificationsPage />} />
        
        {/* Paramètres - accessible à tous */}
        <Route path="/settings" element={<SettingsPage />} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;