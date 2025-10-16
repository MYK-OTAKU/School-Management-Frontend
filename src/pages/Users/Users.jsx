import React, { useState } from 'react';
import { 
  Users as UsersIcon, 
  UserPlus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  UserCheck, 
  UserX,
  Shield,
  Eye,
  EyeOff
} from 'lucide-react';
import { useUsers, useToggleUserStatus, useDeleteUser, useChangeUserRole } from '../../hooks/useUsers';
import { useRoles } from '../../hooks/useRoles';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import UserForm from './UserForm';
import ConfirmationDialog from '../../components/ConfirmationDialog/ConfirmationDialog';

const Users = () => {
  const { user: currentUser, hasPermission } = useAuth();
  const { getTranslation } = useLanguage();
  const { effectiveTheme } = useTheme();
  const { data: users, isLoading, error } = useUsers();
  const { data: roles } = useRoles();
  const toggleUserStatus = useToggleUserStatus();
  const deleteUser = useDeleteUser();
  const changeUserRole = useChangeUserRole();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    show: false, 
    type: '', 
    user: null, 
    title: '', 
    message: '' 
  });
  const [showInactive, setShowInactive] = useState(false);

  const isDarkMode = effectiveTheme === 'dark';

  const filteredUsers = users?.filter(user => {
    const matchesSearch = user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = !selectedRole || user.role?.name === selectedRole;
    const matchesStatus = showInactive || user.isActive;
    
    return matchesSearch && matchesRole && matchesStatus;
  }) || [];

  const handleToggleStatus = (user) => {
    setConfirmDialog({
      show: true,
      type: 'toggleStatus',
      user,
      title: user.isActive ? 
        getTranslation('users.deactivateUser', 'Désactiver l\'utilisateur') : 
        getTranslation('users.activateUser', 'Activer l\'utilisateur'),
      message: `${getTranslation('users.confirmToggleStatus', 'Êtes-vous sûr de vouloir')} ${user.isActive ? 
        getTranslation('users.deactivate', 'désactiver') : 
        getTranslation('users.activate', 'activer')} ${getTranslation('users.theUser', 'l\'utilisateur')} ${user.firstName} ${user.lastName} ?`
    });
  };

  const handleDelete = (user) => {
    setConfirmDialog({
      show: true,
      type: 'delete',
      user,
      title: getTranslation('users.deleteUser', 'Supprimer l\'utilisateur'),
      message: `${getTranslation('users.deleteUserConfirmation', 'Êtes-vous sûr de vouloir supprimer définitivement l\'utilisateur')} ${user.firstName} ${user.lastName} ? ${getTranslation('users.thisActionCannot', 'Cette action est irréversible.')}`
    });
  };

  const handleRoleChange = (user, newRoleId) => {
    if (parseInt(newRoleId) === user.roleId) {
      return;
    }
    
    changeUserRole.mutate({
      userId: user.id, 
      roleId: parseInt(newRoleId) 
    });
  };

  const confirmAction = () => {
    const { type, user } = confirmDialog;
    
    switch (type) {
      case 'toggleStatus':
        toggleUserStatus.mutate({
          userId: user.id, 
          activate: !user.isActive 
        });
        break;
      case 'delete':
        deleteUser.mutate(user.id);
        break;
      default:
        console.warn('Type d\'action inconnu:', type);
    }
    
    setConfirmDialog({
      show: false, 
      type: '', 
      user: null, 
      title: '', 
      message: '' 
    });
  };

  const cancelAction = () => {
    setConfirmDialog({
      show: false, 
      type: '', 
      user: null, 
      title: '', 
      message: '' 
    });
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowUserForm(true);
  };

  const handleCreateUser = () => {
    setEditingUser(null);
    setShowUserForm(true);
  };

  const closeUserForm = () => {
    setShowUserForm(false);
    setEditingUser(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-text-main">
            {getTranslation('users.title', 'Gestion des Utilisateurs')}
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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-text-main">
            {getTranslation('users.title', 'Gestion des Utilisateurs')}
          </h1>
        </div>
        <div className="text-center py-12">
          <div className="text-text-muted text-lg mb-4">
            {getTranslation('users.errorLoadingUsers', 'Erreur lors du chargement des utilisateurs')}
          </div>
          <div className="text-text-muted">
            {error.message || getTranslation('messages.errorOccurred', 'Une erreur est survenue')}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <UsersIcon className="h-8 w-8 text-primary-400" />
          <h1 className="text-3xl font-bold text-text-main">
            {getTranslation('users.title', 'Gestion des Utilisateurs')}
          </h1>
        </div>
        
        {hasPermission('USERS_ADMIN') && (
          <button
            onClick={handleCreateUser}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
            disabled={showUserForm}
          >
            <UserPlus size={16} />
            <span>{getTranslation('users.addUser', 'Nouvel Utilisateur')}</span>
          </button>
        )}
      </div>

      {/* Filtres */}
      <div 
        className="p-6 rounded-lg border border-primary-400/20 bg-card backdrop-blur-sm"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" size={16} />
            <input
              type="text"
              placeholder={getTranslation('users.searchUsersPlaceholder', 'Rechercher un utilisateur...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-secondary-700/50 border border-secondary-600 rounded-lg text-text-main placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Filtre par rôle */}
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full px-4 py-2 bg-secondary-700/50 border border-secondary-600 rounded-lg text-text-main focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="" className="bg-card text-text-main">{getTranslation('users.allRoles', 'Tous les rôles')}</option>
            {roles?.map(role => (
              <option key={role.id} value={role.name} className="bg-card text-text-main">
                {getTranslation(`users.roleNames.${role.name}`, role.name)}
              </option>
            ))}
          </select>

          {/* Toggle utilisateurs inactifs */}
          <button
            onClick={() => setShowInactive(!showInactive)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${showInactive ? "bg-primary-600 text-white" : "bg-secondary-700/50 text-text-muted hover:text-text-main"}`}
          >
            {showInactive ? <Eye size={16} /> : <EyeOff size={16} />}
            <span>{getTranslation('users.showInactiveUsers', 'Utilisateurs inactifs')}</span>
          </button>

          {/* Statistiques */}
          <div className="text-text-muted text-sm">
            <div>{getTranslation('common.total', 'Total')}: {users?.length || 0} {getTranslation('users.usersCount', 'utilisateurs')}</div>
            <div>{getTranslation('users.activeCount', 'Actifs')}: {users?.filter(u => u.isActive).length || 0}</div>
          </div>
        </div>
      </div>

      {/* Liste des utilisateurs */}
      <div 
        className="rounded-lg border border-primary-400/20 overflow-hidden bg-card backdrop-blur-sm"
      >
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <UsersIcon className="h-12 w-12 text-text-muted mx-auto mb-4" />
            <p className="text-text-muted text-lg">{getTranslation('users.noUsersFound', 'Aucun utilisateur trouvé')}</p>
            <p className="text-text-muted text-sm">
              {searchTerm || selectedRole ? 
                getTranslation('users.tryModifyFilters', 'Essayez de modifier vos filtres') : 
                getTranslation('users.startByCreatingUser', 'Commencez par créer un utilisateur')
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary-700/50 border-b border-primary-400/20">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    {getTranslation('users.userHeader', 'Utilisateur')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    {getTranslation('users.roleHeader', 'Rôle')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    {getTranslation('users.statusHeader', 'Statut')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    {getTranslation('users.lastLoginHeader', 'Dernière connexion')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    {getTranslation('common.actions', 'Actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-700/50">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-secondary-700/30">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-r from-primary-500 to-accent-500">
                          <span className="text-white font-semibold text-sm">
                            {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-3">
                          <div className="font-medium text-text-main">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-text-muted">
                            {user.username} • {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {hasPermission('USERS_ADMIN') ? (
                        <select
                          value={user.roleId}
                          onChange={(e) => handleRoleChange(user, e.target.value)}
                          disabled={user.id === currentUser?.id || changeUserRole.isLoading}
                          className="bg-secondary-700/50 border border-secondary-600 rounded px-2 py-1 text-text-main text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
                        >
                          {roles?.map(role => (
                            <option key={role.id} value={role.id} className="bg-card text-text-main">
                              {getTranslation(`users.roleNames.${role.name}`, role.name)}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-600/20 text-primary-300">
                          <Shield size={12} className="mr-1" />
                          {getTranslation(`users.roleNames.${user.role?.name}`, user.role?.name)}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.isActive ? 'bg-success-600/20 text-success-300' : 'bg-error-600/20 text-error-300'}`}>
                        {user.isActive ? <UserCheck size={12} className="mr-1" /> : <UserX size={12} className="mr-1" />}
                        {user.isActive ? 
                          getTranslation('common.active', 'Actif') : 
                          getTranslation('common.inactive', 'Inactif')
                        }
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted">
                      {user.lastLoginDate 
                        ? new Date(user.lastLoginDate).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : getTranslation('users.neverConnected', 'Jamais connecté')
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {hasPermission('USERS_ADMIN') && (
                          <>
                            <button
                              onClick={() => handleEditUser(user)}
                              className="p-2 text-accent-400 hover:text-accent-300 hover:bg-accent-600/20 rounded-lg transition-colors"
                              title={getTranslation('common.edit', 'Modifier')}
                              disabled={showUserForm}
                            >
                              <Edit3 size={16} />
                            </button>
                            
                            <button
                              onClick={() => handleToggleStatus(user)}
                              disabled={user.id === currentUser?.id || toggleUserStatus.isLoading}
                              className={`p-2 rounded-lg transition-colors ${user.isActive ? "text-warning-400 hover:text-warning-300 hover:bg-warning-600/20" : "text-success-400 hover:text-success-300 hover:bg-success-600/20"} ${user.id === currentUser?.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                              title={user.isActive ? 
                                getTranslation('users.deactivate', 'Désactiver') : 
                                getTranslation('users.activate', 'Activer')
                              }
                            >
                              {user.isActive ? <UserX size={16} /> : <UserCheck size={16} />}
                            </button>
                            
                            <button
                              onClick={() => handleDelete(user)}
                              disabled={user.id === currentUser?.id || deleteUser.isLoading}
                              className={`p-2 text-error-400 hover:text-error-300 hover:bg-error-600/20 rounded-lg transition-colors ${user.id === currentUser?.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                              title={getTranslation('common.delete', 'Supprimer')}
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Formulaire d'utilisateur */}
      {showUserForm && (
        <UserForm
          user={editingUser}
          onClose={closeUserForm}
          roles={roles}
        />
      )}

      {/* Dialog de confirmation */}
      <ConfirmationDialog
        isOpen={confirmDialog.show}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmAction}
        onCancel={cancelAction}
        confirmButtonText={confirmDialog.type === 'delete' ? 
          getTranslation('common.delete', 'Supprimer') : 
          getTranslation('common.confirm', 'Confirmer')
        }
        confirmButtonClassName={confirmDialog.type === 'delete' ? 'bg-error-600 hover:bg-error-700' : 'bg-primary-600 hover:bg-primary-700'}
        loading={
          confirmDialog.type === 'toggleStatus' ? toggleUserStatus.isLoading :
          confirmDialog.type === 'delete' ? deleteUser.isLoading :
          false
        }
      />
    </div>
  );
};

export default Users;