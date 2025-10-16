import React, { useState, useEffect } from 'react';
import { X, Save, Shield } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useCreateRole, useUpdateRole } from '../../hooks/useRoles';
import { useNotification } from '../../hooks/useNotification';

const RoleForm = ({ role, permissions, onClose }) => {
  // ✅ i18n: Utilise getTranslation pour cohérence avec LanguageContext
  const { getTranslation } = useLanguage();
  const { showSuccess, showError } = useNotification();
  const { effectiveTheme } = useTheme();
  
  const isEdit = !!role;
  // ✅ i18n: Title dynamique avec getTranslation
  const title = isEdit ? 
    getTranslation('rolesForm.editRole', 'Modifier le rôle') : 
    getTranslation('rolesForm.addRole', 'Ajouter un rôle');

  const createRoleMutation = useCreateRole();
  const updateRoleMutation = useUpdateRole();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: []
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDarkMode = effectiveTheme === 'dark';



  useEffect(() => {
    if (isEdit && role) {
      setFormData({
        name: role.name || '',
        description: role.description || '',
        permissions: role.permissions ? role.permissions.map(p => p.id) : []
      });
    } else {
      setFormData({
        name: '',
        description: '',
        permissions: []
      });
    }
    setValidationErrors({});
  }, [isEdit, role]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handlePermissionToggle = (permissionId) => {
    setFormData(prev => {
      const currentIds = prev.permissions || [];
      return {
        ...prev,
        permissions: currentIds.includes(permissionId)
          ? currentIds.filter(id => id !== permissionId)
          : [...currentIds, permissionId]
      };
    });
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = getTranslation('rolesForm.nameRequired', 'Le nom est requis');
    } else if (formData.name.length < 3) {
      errors.name = getTranslation('rolesForm.nameTooShort', 'Le nom doit contenir au moins 3 caractères');
    }

    if (!formData.description.trim()) {
      errors.description = getTranslation('rolesForm.descriptionRequired', 'La description est requise');
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const dataToSubmit = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        permissions: formData.permissions
      };

      console.log('📝 Data to submit:', dataToSubmit);
      console.log('📝 Role ID:', role?.id);
      console.log('📝 Is Edit Mode:', isEdit);
      console.log('📝 Selected permissions:', formData.permissions);

      if (isEdit) {
        console.log(`✏️ [ROLES] Updating role: ${role.name}`);
        await updateRoleMutation.mutateAsync({ id: role.id, data: dataToSubmit });
      } else {
        console.log(`➕ [ROLES] Creating role: ${dataToSubmit.name}`);
        await createRoleMutation.mutateAsync(dataToSubmit);
      }
      
      onClose();

    } catch (error) {
      console.error(`❌ [ROLES] Error ${isEdit ? 'updating' : 'creating'} role:`, error);
      if (error.response?.data?.validationErrors) {
        setValidationErrors(error.response.data.validationErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const groupedPermissions = React.useMemo(() => {
    if (!permissions || permissions.length === 0) return {};
    
    return permissions.reduce((groups, permission) => {
      const prefix = permission.name.split('_')[0] || 'GENERAL';
      if (!groups[prefix]) {
        groups[prefix] = [];
      }
      groups[prefix].push(permission);
      return groups;
    }, {});
  }, [permissions]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && !isSubmitting) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose, isSubmitting]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        className="rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-secondary-600 bg-card backdrop-blur-sm"
      >
        {/* Header */}
        <div className="p-6 border-b border-secondary-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-6 w-6 text-primary-400" />
              <h2 className="text-xl font-semibold text-text-main">{title}</h2>
            </div>
            <button
              onClick={onClose}
              className="transition-colors text-text-muted hover:text-text-main"
              disabled={isSubmitting}
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* General error */}
          {validationErrors.general && (
            <div className="p-3 rounded-md border bg-error-600/20 border-error-500/50 text-error-400">
              {validationErrors.general}
            </div>
          )}

          {/* Role name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2 text-text-muted">
              {getTranslation('rolesForm.roleName', 'Nom du rôle')} *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full rounded-md border py-2 px-3 focus:outline-none focus:ring-2 bg-secondary-700/50 text-text-main placeholder-secondary-400
                ${validationErrors.name ? 'border-error-500/50' : 'border-secondary-500'} focus:ring-primary-500`}
              placeholder={getTranslation('rolesForm.roleNamePlaceholder', 'Nom du rôle')}
              disabled={isSubmitting}
            />
            {validationErrors.name && (
              <p className="mt-1 text-sm text-error-400">{validationErrors.name}</p>
            )}
          </div>
          
          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2 text-text-muted">
              {getTranslation('rolesForm.roleDescription', 'Description du rôle')} *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className={`w-full rounded-md border py-2 px-3 focus:outline-none focus:ring-2 bg-secondary-700/50 text-text-main placeholder-secondary-400
                ${validationErrors.description ? 'border-error-500/50' : 'border-secondary-500'} focus:ring-primary-500`}
              placeholder={getTranslation('rolesForm.descriptionPlaceholder', 'Description du rôle')}
              disabled={isSubmitting}
            />
            {validationErrors.description && (
              <p className="mt-1 text-sm text-error-400">{validationErrors.description}</p>
            )}
          </div>
          
          {/* Permissions */}
          <div>
            <label className="block text-sm font-medium mb-3 text-text-muted">
              {getTranslation('rolesForm.permissions', 'Permissions')}
            </label>
            
            {!permissions || permissions.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : (
              <div className="max-h-80 overflow-y-auto border border-secondary-600 rounded-md p-4 bg-secondary-700/50">
                {Object.entries(groupedPermissions).map(([group, perms]) => (
                  <div key={group} className="mb-6 last:mb-0">
                    <h3 className="text-sm font-semibold mb-3 border-b pb-2 text-primary-300 border-secondary-600">
                      {getTranslation(`rolesForm.permissionCategories.${group.toLowerCase()}`, group)}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {perms.map(permission => (
                        <div key={permission.id} className="flex items-start space-x-3">
                          <input
                            type="checkbox"
                            id={`permission-${permission.id}`}
                            checked={formData.permissions.includes(permission.id)}
                            onChange={() => handlePermissionToggle(permission.id)}
                            disabled={isSubmitting}
                            className="mt-1 h-4 w-4 rounded border border-secondary-500 bg-secondary-700/50 focus:ring-2 focus:ring-primary-500"
                            style={{ color: "var(--color-primary)", "--tw-ring-color": "var(--color-primary)" }}
                          />
                          <label 
                            htmlFor={`permission-${permission.id}`}
                            className="text-sm cursor-pointer flex-1 text-text-muted"
                          >
                            <div className="font-medium text-text-main">
                              {getTranslation(`permissions.permissionNames.${permission.name}`, permission.name)}
                            </div>
                            {permission.description && (
                              <div className="text-xs mt-1 text-text-muted">
                                {permission.description}
                              </div>
                            )}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                
                {Object.keys(groupedPermissions).length === 0 && (
                  <p className="text-center py-4 text-text-muted">
                    {getTranslation('rolesForm.noPermissionsAvailable', 'Aucune permission disponible')}
                  </p>
                )}
              </div>
            )}
            
            {/* Selected permissions count */}
            <div className="mt-2 text-sm text-text-muted">
              {/* ✅ i18n: Interpolation pour compteur dynamique */}
              {formData.permissions.length} {getTranslation('rolesForm.permissionsSelected', 'permissions sélectionnées')}
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-secondary-600">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-secondary-700/50 text-text-muted hover:bg-secondary-600/50"
              disabled={isSubmitting}
            >
              {getTranslation('common.cancel', 'Annuler')}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 flex items-center space-x-2 transition-colors bg-primary-600 hover:bg-primary-700"
              style={{ "--tw-ring-color": "var(--color-primary)" }}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {getTranslation('common.processing', 'Traitement en cours...')}
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>
                    {isEdit 
                      ? getTranslation('common.update', 'Mettre à jour') 
                      : getTranslation('common.create', 'Créer')}
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoleForm;