import React, { useState, useContext, useEffect } from 'react';
import { StudentContext } from '../../contexts/StudentContext';
import StudentService from '../../services/StudentService';
import { NotificationContext } from '../../contexts/NotificationContext';

const StudentForm = ({ student, schoolYears = [], classrooms = [], onClose }) => {
  const { addStudent, updateStudent } = useContext(StudentContext);
  const { showSuccess, showError } = useContext(NotificationContext);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [otherNames, setOtherNames] = useState('');
  const [gender, setGender] = useState('M');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [schoolYearId, setSchoolYearId] = useState('');
  const [classroomId, setClassroomId] = useState('');
  const [reductionPercent, setReductionPercent] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (student) {
      setFirstName(student.firstName);
      setLastName(student.lastName);
      setOtherNames(student.otherNames || '');
      setGender(student.gender || 'M');
      setDateOfBirth(student.dateOfBirth || '');
      setGuardianName(student.guardianName || '');
      setGuardianPhone(student.guardianPhone || '');
      setSchoolYearId(student.schoolYearId || '');
      setClassroomId(student.classroomId || '');
      setReductionPercent(student.reductionPercent || 0);
    } else {
      const activeSchoolYear = schoolYears.find(sy => sy.isActive);
      if (activeSchoolYear) {
        setSchoolYearId(activeSchoolYear.id);
      }
      setFirstName('');
      setLastName('');
      setOtherNames('');
      setGender('M');
      setDateOfBirth('');
      setGuardianName('');
      setGuardianPhone('');
      setClassroomId('');
      setReductionPercent(0);
    }
  }, [student, schoolYears]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const studentData = { 
      firstName, 
      lastName,
      otherNames: otherNames || null,
      gender,
      dateOfBirth: dateOfBirth || null,
      guardianName: guardianName || null,
      guardianPhone: guardianPhone || null,
      schoolYearId: schoolYearId || null,
      classroomId: classroomId || null,
      reductionPercent: parseFloat(reductionPercent) || 0
    };

    const handleResponse = (response) => {
      if (response && response.data) {
        const action = student ? 'mis à jour' : 'créé';
        showSuccess(`L'étudiant a été ${action} avec succès.`);
        if (student) {
          updateStudent(response.data);
        } else {
          addStudent(response.data);
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

    if (student) {
      StudentService.update(student.id, studentData)
        .then(handleResponse)
        .catch(handleError)
        .finally(() => setIsLoading(false));
    } else {
      StudentService.create(studentData)
        .then(handleResponse)
        .catch(handleError)
        .finally(() => setIsLoading(false));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-card p-8 rounded-lg shadow-lg w-full max-w-6xl my-8">
        <h2 className="text-2xl font-bold text-text-main mb-6">{student ? 'Modifier l\'Étudiant' : 'Nouvel Étudiant'}</h2>
        <form onSubmit={handleSubmit}>
          {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-6">{error}</div>}
          
          {/* Informations Personnelles */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-text-main mb-4 border-b border-secondary-600 pb-2">Informations Personnelles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label htmlFor="firstName" className="block text-sm font-medium text-text-muted mb-1">Prénom *</label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-2 bg-secondary-700/50 border border-secondary-600 rounded-lg text-text-main focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-text-muted mb-1">Nom *</label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-2 bg-secondary-700/50 border border-secondary-600 rounded-lg text-text-main focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="otherNames" className="block text-sm font-medium text-text-muted mb-1">Autres Noms</label>
                <input
                  id="otherNames"
                  type="text"
                  value={otherNames}
                  onChange={(e) => setOtherNames(e.target.value)}
                  className="w-full px-4 py-2 bg-secondary-700/50 border border-secondary-600 rounded-lg text-text-main focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-text-muted mb-1">Genre *</label>
                <select
                  id="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-4 py-2 bg-secondary-700/50 border border-secondary-600 rounded-lg text-text-main focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                >
                  <option value="M">Masculin</option>
                  <option value="F">Féminin</option>
                </select>
              </div>
              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-text-muted mb-1">Date de Naissance</label>
                <input
                  id="dateOfBirth"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full px-4 py-2 bg-secondary-700/50 border border-secondary-600 rounded-lg text-text-main focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Informations du Tuteur */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-text-main mb-4 border-b border-secondary-600 pb-2">Informations du Tuteur</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="guardianName" className="block text-sm font-medium text-text-muted mb-1">Nom du Tuteur</label>
                <input
                  id="guardianName"
                  type="text"
                  value={guardianName}
                  onChange={(e) => setGuardianName(e.target.value)}
                  className="w-full px-4 py-2 bg-secondary-700/50 border border-secondary-600 rounded-lg text-text-main focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label htmlFor="guardianPhone" className="block text-sm font-medium text-text-muted mb-1">Téléphone du Tuteur</label>
                <input
                  id="guardianPhone"
                  type="tel"
                  value={guardianPhone}
                  onChange={(e) => setGuardianPhone(e.target.value)}
                  className="w-full px-4 py-2 bg-secondary-700/50 border border-secondary-600 rounded-lg text-text-main focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Informations Scolaires */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-text-main mb-4 border-b border-secondary-600 pb-2">Informations Scolaires</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="schoolYear" className="block text-sm font-medium text-text-muted mb-1">Année Scolaire</label>
                <select
                  id="schoolYear"
                  value={schoolYearId}
                  onChange={(e) => setSchoolYearId(e.target.value)}
                  className="w-full px-4 py-2 bg-secondary-700/50 border border-secondary-600 rounded-lg text-text-main focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Sélectionner une année scolaire</option>
                  {schoolYears.map((sy) => (
                    <option key={sy.id} value={sy.id}>{sy.name} {sy.isActive ? '(Active)' : ''}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="classroom" className="block text-sm font-medium text-text-muted mb-1">Classe</label>
                <select
                  id="classroom"
                  value={classroomId}
                  onChange={(e) => setClassroomId(e.target.value)}
                  className="w-full px-4 py-2 bg-secondary-700/50 border border-secondary-600 rounded-lg text-text-main focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Sélectionner une classe</option>
                  {classrooms.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="reductionPercent" className="block text-sm font-medium text-text-muted mb-1">Réduction (%)</label>
                <input
                  id="reductionPercent"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={reductionPercent}
                  onChange={(e) => setReductionPercent(e.target.value)}
                  className="w-full px-4 py-2 bg-secondary-700/50 border border-secondary-600 rounded-lg text-text-main focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
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
              {isLoading ? 'Chargement...' : (student ? 'Mettre à jour' : 'Créer')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;
