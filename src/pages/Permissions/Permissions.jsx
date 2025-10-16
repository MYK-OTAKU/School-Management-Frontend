import React, { useState, useMemo } from 'react';
import { Shield, Search, Plus, Edit3, Trash2, Lock } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { usePermissions, useDeletePermission } from '../../hooks/usePermissions';
import PermissionForm from './PermissionForm';
import ConfirmationDialog from '../../components/ConfirmationDialog/ConfirmationDialog';

const Permissions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showPermissionForm, setShowPermissionForm] = useState(false);
  const [editingPermission, setEditingPermission] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ 
    show: false, 
    permission: null, 
    title: '', 
    message: '' 
  });

  // ✅ i18n: Utilise getTranslation pour cohérence avec LanguageContext
  const { getTranslation } = useLanguage();
  const { hasPermission } = useAuth();
  const { effectiveTheme } = useTheme();
  
  const { data: permissions, isLoading, error } = usePermissions();
  const deletePermissionMutation = useDeletePermission();

  const isDarkMode = effectiveTheme === 'dark';

  const canViewPermissions = hasPermission('PERMISSIONS_VIEW');
  const canManagePermissions = hasPermission('PERMISSIONS_MANAGE') || hasPermission('ADMIN');

  const criticalPermissions = ['ADMIN', 'ROLES_MANAGE', 'PERMISSIONS_MANAGE', 'USERS_ADMIN'];

  console.log('🔍 Debug Permissions Component:', { permissions, isLoading, error, canManagePermissions, isDarkMode });
  
  const filteredPermissions = useMemo(() => {
    if (!Array.isArray(permissions)) return [];
    
    return permissions.filter(permission => 
      (getTranslation(`permissions.permissionNames.${permission.name}`, permission.name))?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permission.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [permissions, searchTerm, getTranslation]);

  const groupPermissionsByCategory = (perms) => {
    const permissionGroups = {
      system: [],
      users: [],
      roles: [],
      permissions: [],
      postes: [],
      customers: [],
      sales: [],
      inventory: [],
      finance: [],
      events: [],
      monitoring: [],
      sessions: [],
      typesPostes: [],
      other: []
    };
    
    perms.forEach(permission => {
      const name = permission.name?.toUpperCase() || '';
      
      if (name === 'ADMIN') {
        permissionGroups.system.unshift(permission);
      } else if (name.startsWith('USERS_')) {
        permissionGroups.users.push(permission);
      } else if (name.startsWith('ROLES_')) {
        permissionGroups.roles.push(permission);
      } else if (name.startsWith('PERMISSIONS_')) {
        permissionGroups.permissions.push(permission);
      } else if (name.startsWith('POSTES_')) {
        permissionGroups.postes.push(permission);
      } else if (name.startsWith('CUSTOMERS_')) {
        permissionGroups.customers.push(permission);
      } else if (name.startsWith('SALES_')) {
        permissionGroups.sales.push(permission);
      } else if (name.startsWith('INVENTORY_')) {
        permissionGroups.inventory.push(permission);
      } else if (name.startsWith('FINANCE_')) {
        permissionGroups.finance.push(permission);
      } else if (name.startsWith('EVENTS_')) {
        permissionGroups.events.push(permission);
      } else if (name.startsWith('MONITORING_')) {
        permissionGroups.monitoring.push(permission);
      } else if (name.startsWith('SESSIONS_')) {
        permissionGroups.sessions.push(permission);
      } else if (name.startsWith('TYPES_POSTES_')) {
        permissionGroups.typesPostes.push(permission);
      } else {
        permissionGroups.other.push(permission);
      }
    });
    
    return permissionGroups;
  };

  const groupedPermissions = groupPermissionsByCategory(filteredPermissions);

  const handleCreatePermission = () => {
    if (!canManagePermissions) {
      return;
    }
    console.log('➕ Création permission');
    setEditingPermission(null);
    setShowPermissionForm(true);
  };

  const handleEditPermission = (permission) => {
    if (!canManagePermissions) {
      return;
    }
    if (criticalPermissions.includes(permission.name)) {
      return;
    }
    console.log('✏️ Édition permission:', permission);
    setEditingPermission(permission);
    setShowPermissionForm(true);
  };

  const handleDeletePermission = (permission) => {
    if (!canManagePermissions) {
      return;
    }
    if (criticalPermissions.includes(permission.name)) {
      return;
    }
    console.log('🗑️ Suppression permission:', permission);
    setConfirmDialog({
      show: true,
      permission,
      // ✅ i18n: Utilise getTranslation pour titre
      title: getTranslation('permissions.deletePermission', 'Supprimer la permission'),
      // ✅ i18n: Interpolation pour message dynamique
      message: `${getTranslation('permissions.deletePermissionConfirmation', 'Êtes-vous sûr de vouloir supprimer définitivement cette permission')} "${getTranslation(`permissions.permissionNames.${permission.name}`, permission.name)}" ? ${getTranslation('permissions.thisActionCannot', 'Cette action est irréversible.')}`
    });
  };

  const confirmDeletePermission = () => {
    const { permission } = confirmDialog;
    console.log('✅ Confirmation suppression permission:', permission);
    
    deletePermissionMutation.mutate(permission.id);
    
    setConfirmDialog({ 
      show: false, 
      permission: null, 
      title: '', 
      message: '' 
    });
  };

  const cancelDeletePermission = () => {
    console.log('❌ Suppression annulée');
    setConfirmDialog({ 
      show: false, 
      permission: null, 
      title: '', 
      message: '' 
    });
  };

  const closePermissionForm = () => {
    console.log('❌ Fermeture formulaire');
    setShowPermissionForm(false);
    setEditingPermission(null);
  };

  const isCriticalPermission = (permissionName) => {
    return criticalPermissions.includes(permissionName);
  };

  const categoryLabels = {
    system: getTranslation('permissions.permissionCategories.system', 'Système'),
    users: getTranslation('permissions.permissionCategories.users', 'Utilisateurs'),
    roles: getTranslation('permissions.permissionCategories.roles', 'Rôles'), 
    permissions: getTranslation('permissions.permissionCategories.permissions', 'Permissions'),
    postes: getTranslation('permissions.permissionCategories.postes', 'Postes'),
    customers: getTranslation('permissions.permissionCategories.customers', 'Clients'),
    sales: getTranslation('permissions.permissionCategories.sales', 'Ventes'),
    inventory: getTranslation('permissions.permissionCategories.inventory', 'Inventaire'),
    finance: getTranslation('permissions.permissionCategories.finance', 'Finances'),
    events: getTranslation('permissions.permissionCategories.events', 'Événements'),
    monitoring: getTranslation('permissions.permissionCategories.monitoring', 'Surveillance'),
    sessions: getTranslation('permissions.permissionCategories.sessions', 'Sessions'),
    typesPostes: getTranslation('permissions.permissionCategories.typesPostes', 'Types de postes'),
    other: getTranslation('permissions.permissionCategories.other', 'Autres')
  };

  // Styles dynamiques basés sur le thème
  const textColor = 'text-text-main';
  const secondaryTextColor = 'text-text-muted';
  const borderColor = 'border-primary-400/20';
  const inputBorder = 'border-secondary-600';
  const inputBg = 'bg-secondary-700/50';
  const inputText = 'text-text-main';
  const inputPlaceholder = 'placeholder-secondary-400';
  const inputFocusRing = 'focus:ring-primary-500';
  const accentColor = 'text-primary-400';
  const buttonBg = 'bg-primary-600';
  const buttonHoverBg = 'hover:bg-primary-700';
  const successColor = 'text-success-300';
  const successBg = 'bg-success-600/20';
  const errorColor = 'text-error-400';
  const errorBg = 'hover:bg-error-600/20';
  const warningColor = 'text-warning-400';
  const warningBg = 'bg-warning-600/20';

  if (!canViewPermissions) {
    return (
      <div className="space-y-6 w-full max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className={`text-3xl font-bold ${textColor}`}>
            {getTranslation('permissions.title', 'Gestion des Permissions')}
          </h1>
        </div>
        <div className="text-center py-12">
          <div className={`${secondaryTextColor} text-lg mb-4`}>
            {getTranslation('permissions.accessDenied', 'Accès refusé')}
          </div>
          <div className={secondaryTextColor}>
            {getTranslation('permissions.noAccessMessage', 'Vous n\'avez pas les permissions pour accéder à cette page.')}
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6 w-full max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className={`text-3xl font-bold ${textColor}`}>
            {getTranslation('permissions.title', 'Gestion des Permissions')}
          </h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className={`animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600`}></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 w-full max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className={`text-3xl font-bold ${textColor}`}>
            {getTranslation('permissions.title', 'Gestion des Permissions')}
          </h1>
        </div>
        <div className="text-center py-12">
          <div className={`${secondaryTextColor} text-lg mb-4`}>
            {getTranslation('permissions.errorLoadingPermissions', 'Erreur lors du chargement des permissions')}
          </div>
          <div className={secondaryTextColor}>
            {error.message || getTranslation('common.unknownError', 'Une erreur est survenue')}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Shield className={`h-8 w-8 ${accentColor}`} />
          <h1 className={`text-3xl font-bold ${textColor}`}>
            {getTranslation('permissions.title', 'Gestion des Permissions')}
          </h1>
        </div>
        
        {canManagePermissions && (
          <button
            onClick={handleCreatePermission}
            className={`flex items-center space-x-2 px-4 py-2 ${buttonBg} text-white rounded-lg ${buttonHoverBg} transition-colors disabled:opacity-50`}
            disabled={showPermissionForm}
          >
            <Plus size={16} />
            <span>{getTranslation('permissions.addPermission', 'Nouvelle Permission')}</span>
          </button>
        )}
      </div>

      {/* Barre de recherche */}
      <div className={`p-6 rounded-lg border ${borderColor} bg-card backdrop-blur-sm`}>
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${secondaryTextColor}`} size={16} />
          <input
            type="text"
            placeholder={getTranslation('permissions.searchPermissions', 'Rechercher une permission...')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 ${inputBg} border ${inputBorder} rounded-lg ${inputText} ${inputPlaceholder} focus:outline-none focus:ring-2 ${inputFocusRing}`}
          />
        </div>
      </div>
        
      {/* Affichage des permissions par catégorie */}
      <div className="space-y-6">
        {Object.entries(groupedPermissions).map(([category, perms]) => {
          if (perms.length === 0) return null;
          
          const categoryTitle = categoryLabels[category] || category;
          
          return (
            <div key={category} className={`rounded-lg border ${borderColor} bg-card backdrop-blur-sm`}>
              <div className={`px-6 py-4 border-b ${borderColor}`}>
                <h2 className={`text-xl font-semibold ${textColor}`}>
                  {categoryTitle} ({perms.length})
                </h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={inputBg}>
                    <tr>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${secondaryTextColor} uppercase tracking-wider`}>
                        {getTranslation('common.name', 'Nom')}
                      </th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${secondaryTextColor} uppercase tracking-wider`}>
                        {getTranslation('common.description', 'Description')}
                      </th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${secondaryTextColor} uppercase tracking-wider`}>
                        {getTranslation('common.status', 'Statut')}
                      </th>
                      {canManagePermissions && (
                        <th className={`px-6 py-3 text-left text-xs font-medium ${secondaryTextColor} uppercase tracking-wider`}>
                          {getTranslation('common.actions', 'Actions')}
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${borderColor}`}>
                    {perms.map(permission => {
                      const isCritical = isCriticalPermission(permission.name);
                      
                      return (
                        <tr key={permission.id} className="hover:bg-secondary-700/30">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <div className={`font-medium ${textColor}`}>
                                {getTranslation(`permissions.permissionNames.${permission.name}`, permission.name)}
                              </div>
                              {isCritical && (
                                <div className={`flex items-center px-2 py-1 text-xs rounded ${warningBg} ${warningColor}`}>
                                  <Lock className="w-3 h-3 mr-1" />
                                  {getTranslation('permissions.systemBadge', 'Système')}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className={`text-sm ${secondaryTextColor}`}>
                              {permission.description}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs rounded ${isCritical ? `${warningBg} ${warningColor}` : `${successBg} ${successColor}`}`}>
                              {isCritical ? getTranslation('permissions.systemStatus', 'Système') : getTranslation('permissions.modifiableStatus', 'Modifiable')}
                            </span>
                          </td>
                          {canManagePermissions && (
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleEditPermission(permission)}
                                  className={`p-2 rounded-lg transition-colors ${isCritical ? `text-gray-500 cursor-not-allowed` : `text-accent-400 hover:bg-accent-600/20`}`}
                                  title={isCritical ? getTranslation('permissions.permissionSystemNotModifiable', 'Permission système non modifiable') : getTranslation('common.edit', 'Modifier')}
                                  disabled={showPermissionForm || isCritical}
                                >
                                  <Edit3 size={16} />
                                </button>
                                <button
                                  onClick={() => handleDeletePermission(permission)}
                                  className={`p-2 rounded-lg transition-colors ${isCritical ? `text-gray-500 cursor-not-allowed` : `${errorColor} ${errorBg}`}`}
                                  title={isCritical ? getTranslation('permissions.permissionSystemNotDeletable', 'Permission système non supprimable') : getTranslation('common.delete', 'Supprimer')}
                                  disabled={isCritical || deletePermissionMutation.isLoading}
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Message si aucune permission */}
      {filteredPermissions.length === 0 && (
        <div className="text-center py-12">
          <Shield className={`h-12 w-12 ${secondaryTextColor} mx-auto mb-4`} />
          <p className={`${secondaryTextColor} text-lg`}>
            {searchTerm ? 
              getTranslation('permissions.noPermissionsFound', 'Aucune permission trouvée') :
              getTranslation('permissions.noPermissions', 'Aucune permission disponible')
            }
          </p>
          {searchTerm && (
            <p className={`${secondaryTextColor} text-sm`}>
              {getTranslation('permissions.tryModifySearch', 'Essayez de modifier votre recherche')}
            </p>
          )}
        </div>
      )}
      
      {/* Formulaire de permission */}
      {showPermissionForm && (
        <PermissionForm
          permission={editingPermission}
          onClose={closePermissionForm}
        />
      )}
      
      {/* Dialog de confirmation */}
      <ConfirmationDialog
        isOpen={confirmDialog.show}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDeletePermission}
        onCancel={cancelDeletePermission}
        // ✅ i18n: Textes de boutons traduits
        confirmText={getTranslation('common.delete', 'Supprimer')}
        cancelText={getTranslation('common.cancel', 'Annuler')}
        type="danger"
        loading={deletePermissionMutation.isLoading}
      />
    </div>
  );
};

export default Permissions;