import React, { useState, useContext, useEffect } from 'react';
import { ClassroomContext } from '../../contexts/ClassroomContext';
import ClassroomService from '../../services/ClassroomService';
import { NotificationContext } from '../../contexts/NotificationContext';

const ClassroomForm = ({ classroom, schoolYears, onClose }) => {
  const { addClassroom, updateClassroom } = useContext(ClassroomContext);
  const { showSuccess, showError } = useContext(NotificationContext);
  const [name, setName] = useState('');
  const [schoolYearId, setSchoolYearId] = useState('');
  const [level, setLevel] = useState('');
  const [description, setDescription] = useState('');
  const [capacity, setCapacity] = useState(30);
  const [monthlyFee, setMonthlyFee] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (classroom) {
      setName(classroom.name);
      setSchoolYearId(classroom.schoolYearId);
      setLevel(classroom.level || '');
      setDescription(classroom.description || '');
      setCapacity(classroom.capacity || 30);
      setMonthlyFee(classroom.monthlyFee || '');
    } else {
      const activeSchoolYear = schoolYears.find(sy => sy.isActive);
      if (activeSchoolYear) {
        setSchoolYearId(activeSchoolYear.id);
      }
      setName('');
      setLevel('');
      setDescription('');
      setCapacity(30);
      setMonthlyFee('');
    }
  }, [classroom, schoolYears]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const classroomData = { 
      name, 
      schoolYearId,
      level: level || null,
      description: description || null,
      capacity: capacity || 30,
      monthlyFee: monthlyFee ? parseFloat(monthlyFee) : null
    };

    const handleResponse = (response) => {
      if (response && response.data) {
        const action = classroom ? 'mise à jour' : 'créée';
        showSuccess(`La classe a été ${action} avec succès.`);
        if (classroom) {
          updateClassroom(response.data);
        } else {
          addClassroom(response.data);
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

    if (classroom) {
      ClassroomService.update(classroom.id, classroomData)
        .then(handleResponse)
        .catch(handleError)
        .finally(() => setIsLoading(false));
    } else {
      ClassroomService.create(classroomData)
        .then(handleResponse)
        .catch(handleError)
        .finally(() => setIsLoading(false));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-card p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-text-main mb-6">{classroom ? 'Modifier la Classe' : 'Nouvelle Classe'}</h2>
        <form onSubmit={handleSubmit}>
          {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-4">{error}</div>}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-text-muted mb-1">Nom de la classe</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 bg-secondary-700/50 border border-secondary-600 rounded-lg text-text-main focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="schoolYear" className="block text-sm font-medium text-text-muted mb-1">Année Scolaire</label>
            <select
              id="schoolYear"
              value={schoolYearId}
              onChange={(e) => setSchoolYearId(e.target.value)}
              className="w-full px-4 py-2 bg-secondary-700/50 border border-secondary-600 rounded-lg text-text-main focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            >
              <option value="">Sélectionner une année scolaire</option>
              {schoolYears.map((sy) => (
                <option key={sy.id} value={sy.id}>{sy.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="level" className="block text-sm font-medium text-text-muted mb-1">Niveau (optionnel)</label>
            <input
              id="level"
              type="text"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              placeholder="Ex: Primaire, Collège, Lycée"
              className="w-full px-4 py-2 bg-secondary-700/50 border border-secondary-600 rounded-lg text-text-main focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="capacity" className="block text-sm font-medium text-text-muted mb-1">Capacité</label>
            <input
              id="capacity"
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              min="1"
              className="w-full px-4 py-2 bg-secondary-700/50 border border-secondary-600 rounded-lg text-text-main focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="monthlyFee" className="block text-sm font-medium text-text-muted mb-1">Frais Mensuel (optionnel)</label>
            <input
              id="monthlyFee"
              type="number"
              step="0.01"
              value={monthlyFee}
              onChange={(e) => setMonthlyFee(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-2 bg-secondary-700/50 border border-secondary-600 rounded-lg text-text-main focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-text-muted mb-1">Description (optionnel)</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              className="w-full px-4 py-2 bg-secondary-700/50 border border-secondary-600 rounded-lg text-text-main focus:outline-none focus:ring-2 focus:ring-primary-500"
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
              {isLoading ? 'Chargement...' : (classroom ? 'Mettre à jour' : 'Créer')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClassroomForm;
