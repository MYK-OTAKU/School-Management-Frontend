import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { StudentProvider } from '../../contexts/StudentContext';
import StudentList from '../../components/Student/StudentList';
import StudentForm from '../../components/Student/StudentForm';
import SchoolYearService from '../../services/SchoolYearService';
import ClassroomService from '../../services/ClassroomService';

const StudentPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [schoolYears, setSchoolYears] = useState([]);
  const [classrooms, setClassrooms] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const yearsData = await SchoolYearService.getAll();
        if (Array.isArray(yearsData)) {
          setSchoolYears(yearsData);
        }
        const classroomsData = await ClassroomService.getAll();
        if (Array.isArray(classroomsData)) {
          setClassrooms(classroomsData);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        // Optionally, show an error message to the user
      }
    };
    fetchData();
  }, []);

  const handleCreate = () => {
    setEditingStudent(null);
    setShowForm(true);
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingStudent(null);
  };

  return (
    <StudentProvider>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Users className="h-8 w-8 text-primary-400" />
            <h1 className="text-3xl font-bold text-text-main">Gestion des Étudiants</h1>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <span>Nouvel Étudiant</span>
          </button>
        </div>
        <StudentList onEdit={handleEdit} />
        {showForm && (
          <StudentForm
            student={editingStudent}
            schoolYears={schoolYears}
            classrooms={classrooms}
            onClose={handleCloseForm}
          />
        )}
      </div>
    </StudentProvider>
  );
};

export default StudentPage;
