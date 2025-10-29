import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Shield, 
  Key, 
  Settings, 
  LogOut, 
  Monitor, 
  UserPlus, 
  ShoppingCart, 
  Package, 
  Calendar,
  BarChart3,
  DollarSign,
  ClipboardList,
  Bell
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';

const Sidebar = ({ expanded, toggleSidebar, isMobile }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { user, hasPermission } = useAuth();
  const { getTranslation } = useLanguage();
  const { effectiveTheme } = useTheme();
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Debug des permissions
  useEffect(() => {
    if (user) {
      console.log('👤 Utilisateur sidebar:', user);
      console.log('🔑 Permissions:', user.role?.permissions);
      console.log('✅ Test ROLES_MANAGE:', hasPermission('ROLES_MANAGE'));
      console.log('✅ Test PERMISSIONS_MANAGE:', hasPermission('PERMISSIONS_MANAGE'));
      console.log('✅ Test USERS_ADMIN:', hasPermission('USERS_ADMIN'));
      console.log('✅ Test FINANCE_VIEW:', hasPermission('FINANCE_VIEW'));
      console.log('✅ Test CATEGORIES_VIEW:', hasPermission('CATEGORIES_VIEW'));
      console.log('✅ Test ADMIN:', hasPermission('ADMIN'));
    }
  }, [user, hasPermission]);

  // Menu principal adapté selon les permissions utilisateur
  const menuItems = [
    { 
      icon: <Home size={20} />, 
      label: getTranslation('navigation.home', 'Accueil'), 
      path: '/dashboard',
      permission: null
    },
    {
      icon: <Calendar size={20} />,
      label: getTranslation('navigation.classrooms', 'Classes'),
      path: '/dashboard/classrooms',
      permission: 'CLASSES_VIEW'
    },
    {
      icon: <BarChart3 size={20} />,
      label: getTranslation('navigation.schoolYears', 'Années Scolaires'),
      path: '/dashboard/school-years',
      permission: 'SCHOOL_YEARS_MANAGE'
    },
    {
      icon: <UserPlus size={20} />,
      label: getTranslation('navigation.students', 'Étudiants'),
      path: '/dashboard/students',
      permission: 'STUDENTS_VIEW'
    },
    {
      icon: <DollarSign size={20} />,
      label: getTranslation('navigation.payments', 'Paiements'),
      path: '/dashboard/payments',
      permission: 'PAYMENTS_VIEW'
    }
  ];

  // Filtrer les éléments du menu principal selon les permissions
  const filteredMenuItems = menuItems.filter(item => 
    !item.permission || hasPermission(item.permission) || hasPermission('ADMIN')
  );

  // Menu administration - avec permissions corrigées et fallback ADMIN
  const adminMenuItems = [
    // ✅ Utilisateurs - USERS_ADMIN ou ADMIN
    ...(hasPermission('USERS_ADMIN') || hasPermission('ADMIN') ? [{
      icon: <Users size={20} />, 
      label: getTranslation('navigation.users', 'Utilisateurs'), 
      path: '/dashboard/users'
    }] : []),
    
    // ✅ Rôles - ROLES_MANAGE ou ADMIN  
    ...(hasPermission('ROLES_MANAGE') || hasPermission('ADMIN') ? [{
      icon: <Shield size={20} />, 
      label: getTranslation('navigation.roles', 'Rôles'), 
      path: '/dashboard/roles'
    }] : []),
    
    // ✅ Permissions - PERMISSIONS_MANAGE ou ADMIN
    ...(hasPermission('PERMISSIONS_MANAGE') || hasPermission('ADMIN') ? [{
      icon: <Key size={20} />, 
      label: getTranslation('navigation.permissions', 'Permissions'), 
      path: '/dashboard/permissions'
    }] : []),
    
    // ✅ Paramètres - SETTINGS_MANAGE ou ADMIN
    ...(hasPermission('SETTINGS_MANAGE') || hasPermission('ADMIN') ? [{ 
      icon: <Settings size={20} />, 
      label: getTranslation('navigation.settings', 'Paramètres'), 
      path: '/dashboard/settings'
    }] : []),
    
    // ✅ Monitoring - MONITORING_VIEW ou ADMIN
    ...(hasPermission('MONITORING_VIEW') || hasPermission('ADMIN') ? [{
      icon: <ClipboardList size={20} />, 
      label: getTranslation('navigation.monitoring', 'Surveillance'), 
      path: '/dashboard/monitoring'
    }] : [])
  ];

  const shouldExpandVisual = expanded || (!isMobile && isHovered);
  const isDarkMode = effectiveTheme === 'dark';

  const sidebarBackground = 'var(--sidebar-background)';
  const sidebarBorderColor = 'var(--border-color)';
  const baseLinkStyle = { color: 'var(--text-secondary)', backgroundColor: 'transparent' };
  const activeLinkStyle = {
    color: '#fff',
    backgroundColor: 'var(--accent-color-primary)',
    boxShadow: isDarkMode
      ? '0 10px 24px rgba(58, 123, 213, 0.35)'
      : '0 10px 24px rgba(29, 79, 145, 0.28)'
  };
  const hoverClass = isDarkMode ? 'hover:bg-[rgba(58,123,213,0.12)]' : 'hover:bg-[rgba(29,79,145,0.12)]';
  const adminTitleColor = isDarkMode ? 'text-[color:var(--accent-color-secondary)]' : 'text-[color:var(--accent-color-primary)]';

  const handleNavigation = (e, path) => {
    e.preventDefault();
    
    // Fermer le sidebar sur mobile après navigation
    if (isMobile && expanded) {
      toggleSidebar();
    }
    
    navigate(path);
  };

  // Styles fixes pour le sidebar (toujours thème sombre)
  return (
    <>
      <aside
        className={`
          transition-all duration-300 ease-in-out
          ${shouldExpandVisual ? 'w-64' : 'w-16'}
          ${isMobile ?
            (expanded ? 'fixed inset-y-0 left-0 w-64 z-50' : 'hidden')
            : 'relative h-full'
          }
          flex flex-col
          overflow-y-auto
          overflow-x-hidden
          border-r
        `}
        style={{
          background: sidebarBackground,
          backdropFilter: 'blur(15px)',
          borderColor: sidebarBorderColor
        }}
        onMouseEnter={() => !isMobile && !expanded && setIsHovered(true)}
        onMouseLeave={() => !isMobile && !expanded && setIsHovered(false)}
      >
        {/* Menu principal */}
        <nav className="flex-1 py-4">
          {/* Menu général */}
          <div className="px-3">
            <ul className="space-y-1">
              {filteredMenuItems.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.path}
                    className={`
                      flex items-center py-3 px-3 rounded-lg
                      ${location.pathname === item.path || 
                        (location.pathname === '/dashboard' && item.path === '/dashboard') ? 
                        'shadow-lg' : 
                        `${hoverClass}`}
                      transition-all duration-200
                      ${!shouldExpandVisual && 'justify-center'}
                    `}
                    title={!shouldExpandVisual ? item.label : ''}
                    style={location.pathname === item.path || (location.pathname === '/dashboard' && item.path === '/dashboard') ? activeLinkStyle : baseLinkStyle}
                    onClick={(e) => handleNavigation(e, item.path)}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    {shouldExpandVisual && <span className="ml-3 font-medium">{item.label}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Section Administration - uniquement si l'utilisateur a des permissions admin */}
          {adminMenuItems.length > 0 && (
            <>
              <div className="mx-3 my-4">
                <div className="border-t" style={{ borderColor: sidebarBorderColor }}></div>
              </div>
              
              <div className="px-3">
                {shouldExpandVisual && (
                  <h3 className={`${adminTitleColor} font-semibold text-xs uppercase tracking-wider mb-3 px-3`}>
                    {getTranslation('navigation.administration', 'Administration')}
                  </h3>
                )}
                <ul className="space-y-1">
                  {adminMenuItems.map((item, index) => (
                    <li key={`admin-${index}`}>
                      <Link
                        to={item.path}
                        className={`
                          flex items-center py-3 px-3 rounded-lg
                          ${location.pathname === item.path ? 'shadow-lg' : `${hoverClass}`}
                          transition-all duration-200
                          ${!shouldExpandVisual && 'justify-center'}
                        `}
                        title={!shouldExpandVisual ? item.label : ''}
                        style={location.pathname === item.path ? activeLinkStyle : baseLinkStyle}
                        onClick={(e) => handleNavigation(e, item.path)}
                      >
                        <span className="flex-shrink-0">{item.icon}</span>
                        {shouldExpandVisual && <span className="ml-3 font-medium">{item.label}</span>}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </nav>

        {/* Section inférieure - Déconnexion */}
      
      </aside>

      {/* Overlay pour mobile */}
      {isMobile && expanded && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;