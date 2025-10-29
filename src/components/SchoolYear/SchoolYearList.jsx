import React, { useContext, useState } from 'react';
import { Edit3, Trash2, CheckCircle } from 'lucide-react';
import { SchoolYearContext } from '../../contexts/SchoolYearContext';
import SchoolYearService from '../../services/SchoolYearService';
import ConfirmationDialog from '../ConfirmationDialog/ConfirmationDialog';

const SchoolYearList = ({ onEdit }) => {
  const { schoolYears, setSchoolYears } = useContext(SchoolYearContext);
  const [confirmDialog, setConfirmDialog] = useState({ show: false, schoolYear: null, type: '' });

  const handleDelete = (schoolYear) => {
    setConfirmDialog({ show: true, schoolYear, type: 'delete' });
  };

  const handleActivate = (schoolYear) => {
    setConfirmDialog({ show: true, schoolYear, type: 'activate' });
  };

  const confirmAction = () => {
    const { schoolYear, type } = confirmDialog;
    if (type === 'delete') {
      SchoolYearService.delete(schoolYear.id).then(() => {
        setSchoolYears(schoolYears.filter((sy) => sy.id !== schoolYear.id));
        setConfirmDialog({ show: false, schoolYear: null, type: '' });
      });
    } else if (type === 'activate') {
      SchoolYearService.activate(schoolYear.id).then((updatedSchoolYear) => {
        setSchoolYears(
          schoolYears.map((sy) => (sy.id === updatedSchoolYear.id ? updatedSchoolYear : { ...sy, isActive: false }))
        );
        setConfirmDialog({ show: false, schoolYear: null, type: '' });
      });
    }
  };

  return (
    <>
      <div className="rounded-lg border border-primary-400/20 overflow-hidden bg-card backdrop-blur-sm">
        <table className="w-full">
          <thead className="bg-secondary-700/50 border-b border-primary-400/20">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Nom de l'Année Scolaire</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary-700/50">
            {schoolYears.map((schoolYear) => (
              <tr key={schoolYear.id} className="hover:bg-secondary-700/30">
                <td className="px-6 py-4 whitespace-nowrap text-text-main">{schoolYear.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${schoolYear.isActive ? 'bg-success-600/20 text-success-300' : 'bg-secondary-600/20 text-secondary-300'}`}>
                    {schoolYear.isActive ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    {!schoolYear.isActive && (
                      <button
                        onClick={() => handleActivate(schoolYear)}
                        className="p-2 text-success-400 hover:text-success-300 hover:bg-success-600/20 rounded-lg transition-colors"
                      >
                        <CheckCircle size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => onEdit(schoolYear)}
                      className="p-2 text-accent-400 hover:text-accent-300 hover:bg-accent-600/20 rounded-lg transition-colors"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(schoolYear)}
                      className="p-2 text-error-400 hover:text-error-300 hover:bg-error-600/20 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ConfirmationDialog
        isOpen={confirmDialog.show}
        title={confirmDialog.type === 'delete' ? 'Supprimer l\'Année Scolaire' : 'Activer l\'Année Scolaire'}
        message={`Êtes-vous sûr de vouloir ${confirmDialog.type === 'delete' ? 'supprimer' : 'activer'} l'année scolaire "${confirmDialog.schoolYear?.name}" ?`}
        onConfirm={confirmAction}
        onCancel={() => setConfirmDialog({ show: false, schoolYear: null, type: '' })}
      />
    </>
  );
};

export default SchoolYearList;
