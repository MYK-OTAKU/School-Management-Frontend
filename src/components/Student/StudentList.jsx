import React, { useContext, useState, useMemo } from 'react';
import { Edit3, Trash2 } from 'lucide-react';
import { StudentContext } from '../../contexts/StudentContext';
import { ActiveSchoolYearContext } from '../../contexts/ActiveSchoolYearContext';
import StudentService from '../../services/StudentService';
import ConfirmationDialog from '../ConfirmationDialog/ConfirmationDialog';

const StudentList = ({ onEdit }) => {
  const { students, setStudents } = useContext(StudentContext);
  const { activeSchoolYear } = useContext(ActiveSchoolYearContext);
  const [confirmDialog, setConfirmDialog] = useState({ show: false, student: null });

  const handleDelete = (student) => {
    setConfirmDialog({ show: true, student });
  };

  const confirmDelete = () => {
    const { student } = confirmDialog;
    StudentService.delete(student.id).then(() => {
      setStudents(students.filter((s) => s.id !== student.id));
      setConfirmDialog({ show: false, student: null });
    });
  };

  // Filtrer les étudiants par année scolaire active
  const filteredStudents = useMemo(() => {
    if (!activeSchoolYear) return students;
    return students.filter(student => student.schoolYearId === activeSchoolYear.id);
  }, [students, activeSchoolYear]);

  return (
    <>
      <div className="rounded-lg border border-primary-400/20 overflow-hidden bg-card backdrop-blur-sm">
        <table className="w-full">
          <thead className="bg-secondary-700/50 border-b border-primary-400/20">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Prénom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary-700/50">
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="3" className="px-6 py-8 text-center text-text-muted">
                  {activeSchoolYear 
                    ? `Aucun étudiant pour l'année ${activeSchoolYear.name}` 
                    : 'Aucun étudiant trouvé'}
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-secondary-700/30">
                  <td className="px-6 py-4 whitespace-nowrap text-text-main">{student.lastName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-text-main">{student.firstName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onEdit(student)}
                        className="p-2 text-accent-400 hover:text-accent-300 hover:bg-accent-600/20 rounded-lg transition-colors"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(student)}
                        className="p-2 text-error-400 hover:text-error-300 hover:bg-error-600/20 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <ConfirmationDialog
        isOpen={confirmDialog.show}
        title="Supprimer l'Étudiant"
        message={`Êtes-vous sûr de vouloir supprimer l'étudiant "${confirmDialog.student?.firstName} ${confirmDialog.student?.lastName}" ?`}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmDialog({ show: false, student: null })}
      />
    </>
  );
};

export default StudentList;
