import React, { useState, useContext, useEffect } from 'react';
import { SchoolYearContext } from '../../contexts/SchoolYearContext';
import SchoolYearService from '../../services/SchoolYearService';
import { NotificationContext } from '../../contexts/NotificationContext';

const SchoolYearForm = ({ schoolYear, onClose }) => {
  const { addSchoolYear, updateSchoolYear } = useContext(SchoolYearContext);
  const { showSuccess, showError } = useContext(NotificationContext);
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (schoolYear) {
      setName(schoolYear.name);
    } else {
      setName('');
    }
  }, [schoolYear]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const schoolYearData = { name };

    const handleResponse = (response) => {
      if (response && response.data) {
        const action = schoolYear ? 'mise à jour' : 'créée';
        showSuccess(`L'année scolaire a été ${action} avec succès.`);
        if (schoolYear) {
          updateSchoolYear(response.data);
        } else {
          addSchoolYear(response.data);
        }
        onClose();
      } else {
        showError('La réponse du serveur est invalide.');
        setError('La réponse du serveur est invalide.');
      }
    };

    const handleError = (err) => {
      const errorMessage = err.response?.data?.message || err.message || 'Une erreur est survenue.';
      showError(errorMessage);
      setError(errorMessage);
    };

    if (schoolYear) {
      SchoolYearService.update(schoolYear.id, schoolYearData)
        .then(handleResponse)
        .catch(handleError)
        .finally(() => setIsLoading(false));
    } else {
      SchoolYearService.create(schoolYearData)
        .then(handleResponse)
        .catch(handleError)
        .finally(() => setIsLoading(false));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-card p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-text-main mb-6">{schoolYear ? 'Modifier l\'Année Scolaire' : 'Nouvelle Année Scolaire'}</h2>
        <form onSubmit={handleSubmit}>
          {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-4">{error}</div>}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-text-muted mb-1">Nom de l'année scolaire</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 bg-secondary-700/50 border border-secondary-600 rounded-lg text-text-main focus:outline-none focus:ring-2 focus:ring-primary-500"
              pattern="\d{4}-\d{4}"
              title="Le format doit être AAAA-AAAA (ex: 2024-2025)"
              required
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-secondary-600 text-text-main rounded-lg hover:bg-secondary-700 transition-colors"
              disabled={isLoading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Chargement...' : (schoolYear ? 'Mettre à jour' : 'Créer')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SchoolYearForm;
