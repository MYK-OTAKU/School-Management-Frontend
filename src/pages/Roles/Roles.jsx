import React, { useState } from 'react';
import { Shield, Plus, Edit3, Trash2, Users, Key } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useRoles, useDeleteRole } from '../../hooks/useRoles';
import { usePermissions } from '../../hooks/usePermissions';
import RoleForm from './RoleForm';
import ConfirmationDialog from '../../components/ConfirmationDialog/ConfirmationDialog';

const Roles = () => {
  const { hasPermission } = useAuth();
  const { getTranslation } = useLanguage();
  const { effectiveTheme } = useTheme();
  
  const { data: roles, isLoading, error } = useRoles();
  const { data: permissions } = usePermissions();
  const deleteRoleMutation = useDeleteRole();

  const [showRoleForm, setShowRoleForm] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ 
    show: false, 
    role: null, 
    title: '', 
    message: '' 
  });

  const isDarkMode = effectiveTheme === 'dark';

  const canViewRoles = hasPermission('ROLES_VIEW');
  const canManageRoles = hasPermission('ADMIN') || hasPermission('ROLES_MANAGE');

  const handleCreateRole = () => {
    if (!canManageRoles) {
      return;
    }
    setEditingRole(null);
    setShowRoleForm(true);
  };

  const handleEditRole = (role) => {
    if (!canManageRoles) {
      return;
    }
    setEditingRole(role);
    setShowRoleForm(true);
  };

  const handleDeleteRole = (role) => {
    if (!canManageRoles) {
      return;
    }
    setConfirmDialog({
      show: true,
      role,
      title: getTranslation('roles.deleteRole', 'Supprimer le rôle'),
      message: `${getTranslation('roles.deleteRoleConfirmation', 'Êtes-vous sûr de vouloir supprimer définitivement ce rôle')} "${role.name}" ? ${getTranslation('roles.thisActionCannot', 'Cette action est irréversible.')}`
    });
  };

  const confirmDeleteRole = () => {
    const { role } = confirmDialog;
    
    deleteRoleMutation.mutate(role.id);
    
    setConfirmDialog({ 
      show: false, 
      role: null, 
      title: '', 
      message: '' 
    });
  };

  const cancelDeleteRole = () => {
    setConfirmDialog({ 
      show: false, 
      role: null, 
      title: '', 
      message: '' 
    });
  };

  const closeRoleForm = () => {
    setShowRoleForm(false);
    setEditingRole(null);
  };

  if (!canViewRoles) {
    return (
      <div className="space-y-6 w-full max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-text-main">
            {getTranslation('roles.title', 'Gestion des Rôles')}
          </h1>
        </div>
        <div className="text-center py-12">
          <div className="text-text-muted text-lg mb-4">
            {getTranslation('roles.accessDenied', 'Accès refusé')}
          </div>
          <div className="text-text-muted">
            {getTranslation('roles.noAccessMessage', 'Vous n\'avez pas les permissions pour accéder à cette page.')}
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6 w-full max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-text-main">
            {getTranslation('roles.title', 'Gestion des Rôles')}
          </h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 w-full max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-text-main">
            {getTranslation('roles.title', 'Gestion des Rôles')}
          </h1>
        </div>
        <div className="text-center py-12">
          <div className="text-text-muted text-lg mb-4">
            {getTranslation('roles.errorLoadingRoles', 'Erreur lors du chargement des rôles')}
          </div>
          <div className="text-text-muted">
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
          <Shield className="h-8 w-8 text-primary-400" />
          <h1 className="text-3xl font-bold text-text-main">
            {getTranslation('roles.title', 'Gestion des Rôles')}
          </h1>
        </div>
        
        {canManageRoles && (
          <button
            onClick={handleCreateRole}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
            disabled={showRoleForm}
          >
            <Plus size={16} />
            <span>{getTranslation('roles.addRole', 'Nouveau Rôle')}</span>
          </button>
        )}
      </div>

      {/* Liste des rôles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles?.map(role => (
          <div
            key={role.id}
            className="rounded-lg border border-primary-400/20 p-6 bg-card backdrop-blur-sm"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-r from-primary-500 to-accent-500">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text-main">{role.name}</h3>
                  <p className="text-sm text-text-muted">{role.description}</p>
                </div>
              </div>
              
              {canManageRoles && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEditRole(role)}
                    className="p-2 text-accent-400 hover:bg-accent-600/20 rounded-lg transition-colors"
                    title={getTranslation('common.edit', 'Modifier')}
                    disabled={showRoleForm}
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteRole(role)}
                    className="p-2 text-error-400 hover:bg-error-600/20 rounded-lg transition-colors"
                    title={getTranslation('common.delete', 'Supprimer')}
                    disabled={deleteRoleMutation.isLoading}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* Statistiques du rôle */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center space-x-2 text-text-muted">
                  <Users size={14} />
                  <span>{getTranslation('roles.usersStat', 'Utilisateurs')}</span>
                </span>
                <span className="font-medium text-text-main">
                  {role.userCount || 0}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center space-x-2 text-text-muted">
                  <Key size={14} />
                  <span>{getTranslation('roles.permissionsStat', 'Permissions')}</span>
                </span>
                <span className="font-medium text-text-main">
                  {role.permissions?.length || 0}
                </span>
              </div>
            </div>

            {/* Aperçu des permissions */}
            {role.permissions && role.permissions.length > 0 && (
              <div className="mt-4">
                <div className="text-xs mb-2 text-text-muted">
                  {getTranslation('roles.mainPermissions', 'Permissions principales')}
                </div>
                <div className="flex flex-wrap gap-1">
                  {role.permissions.slice(0, 3).map(permission => (
                    <span
                      key={permission.id}
                      className="inline-block px-2 py-1 text-xs rounded bg-primary-600/20 text-primary-300"
                    >
                      {getTranslation(`permissions.permissionNames.${permission.name}`, permission.name)}
                    </span>
                  ))}
                  {role.permissions.length > 3 && (
                    <span className="inline-block px-2 py-1 text-xs rounded bg-secondary-600/20 text-secondary-400">
                      +{role.permissions.length - 3} {getTranslation('roles.others', 'autres')}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Message si aucun rôle */}
      {(!roles || roles.length === 0) && (
        <div className="text-center py-12">
          <Shield className="h-12 w-12 text-text-muted mx-auto mb-4" />
          <p className="text-text-muted text-lg">
            {getTranslation('roles.noRolesFound', 'Aucun rôle trouvé')}
          </p>
          <p className="text-text-muted text-sm">
            {getTranslation('roles.startByCreatingRole', 'Commencez par créer un rôle')}
          </p>
        </div>
      )}

      {/* Formulaire de rôle */}
      {showRoleForm && (
        <RoleForm
          role={editingRole}
          permissions={permissions}
          onClose={closeRoleForm}
        />
      )}

      {/* Dialog de confirmation */}
      <ConfirmationDialog
        isOpen={confirmDialog.show}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDeleteRole}
        onCancel={cancelDeleteRole}
        confirmText={getTranslation('common.delete', 'Supprimer')}
        cancelText={getTranslation('common.cancel', 'Annuler')}
        type="danger"
        loading={deleteRoleMutation.isLoading}
      />
    </div>
  );
};

export default Roles;
