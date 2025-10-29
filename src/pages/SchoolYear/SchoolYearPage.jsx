import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { SchoolYearProvider } from '../../contexts/SchoolYearContext';
import SchoolYearList from '../../components/SchoolYear/SchoolYearList';
import SchoolYearForm from '../../components/SchoolYear/SchoolYearForm';

const SchoolYearPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingSchoolYear, setEditingSchoolYear] = useState(null);

  const handleCreate = () => {
    setEditingSchoolYear(null);
    setShowForm(true);
  };

  const handleEdit = (schoolYear) => {
    setEditingSchoolYear(schoolYear);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingSchoolYear(null);
  };

  return (
    <SchoolYearProvider>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Calendar className="h-8 w-8 text-primary-400" />
            <h1 className="text-3xl font-bold text-text-main">Gestion des Années Scolaires</h1>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <span>Nouvelle Année Scolaire</span>
          </button>
        </div>
        <SchoolYearList onEdit={handleEdit} />
        {showForm && (
          <SchoolYearForm
            schoolYear={editingSchoolYear}
            onClose={handleCloseForm}
          />
        )}
      </div>
    </SchoolYearProvider>
  );
};

export default SchoolYearPage;
