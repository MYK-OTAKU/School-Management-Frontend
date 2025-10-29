import React, { useState, useEffect } from 'react';
import { Building } from 'lucide-react';
import { ClassroomProvider } from '../../contexts/ClassroomContext';
import ClassroomList from '../../components/Classroom/ClassroomList';
import ClassroomForm from '../../components/Classroom/ClassroomForm';
import SchoolYearService from '../../services/SchoolYearService';

const ClassroomPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingClassroom, setEditingClassroom] = useState(null);
  const [schoolYears, setSchoolYears] = useState([]);

  useEffect(() => {
    SchoolYearService.getAll().then((data) => {
      if (Array.isArray(data)) {
        setSchoolYears(data);
      }
    }).catch((error) => {
      console.error('Erreur lors du chargement des années scolaires:', error);
    });
  }, []);

  const handleCreate = () => {
    setEditingClassroom(null);
    setShowForm(true);
  };

  const handleEdit = (classroom) => {
    setEditingClassroom(classroom);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingClassroom(null);
  };

  return (
    <ClassroomProvider>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Building className="h-8 w-8 text-primary-400" />
            <h1 className="text-3xl font-bold text-text-main">Gestion des Classes</h1>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <span>Nouvelle Classe</span>
          </button>
        </div>
        <ClassroomList onEdit={handleEdit} />
        {showForm && (
          <ClassroomForm
            classroom={editingClassroom}
            schoolYears={schoolYears}
            onClose={handleCloseForm}
          />
        )}
      </div>
    </ClassroomProvider>
  );
};

export default ClassroomPage;
