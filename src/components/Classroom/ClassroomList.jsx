import React, { useContext, useState, useMemo } from 'react';
import { Edit3, Trash2 } from 'lucide-react';
import { ClassroomContext } from '../../contexts/ClassroomContext';
import { ActiveSchoolYearContext } from '../../contexts/ActiveSchoolYearContext';
import ClassroomService from '../../services/ClassroomService';
import ConfirmationDialog from '../ConfirmationDialog/ConfirmationDialog';

const ClassroomList = ({ onEdit }) => {
  const { classrooms, deleteClassroom } = useContext(ClassroomContext);
  const { activeSchoolYear } = useContext(ActiveSchoolYearContext);
  const [confirmDialog, setConfirmDialog] = useState({ show: false, classroom: null });

  const handleDelete = (classroom) => {
    setConfirmDialog({ show: true, classroom });
  };

  const confirmDelete = () => {
    const { classroom } = confirmDialog;
    ClassroomService.delete(classroom.id).then(() => {
      deleteClassroom(classroom.id);
      setConfirmDialog({ show: false, classroom: null });
    });
  };

  // Filtrer les classes par année scolaire active
  const filteredClassrooms = useMemo(() => {
    if (!activeSchoolYear) return classrooms;
    return classrooms.filter(classroom => classroom.schoolYearId === activeSchoolYear.id);
  }, [classrooms, activeSchoolYear]);

  return (
    <>
      <div className="rounded-lg border border-primary-400/20 overflow-hidden bg-card backdrop-blur-sm">
        <table className="w-full">
          <thead className="bg-secondary-700/50 border-b border-primary-400/20">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Nom de la Classe</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary-700/50">
            {filteredClassrooms.length === 0 ? (
              <tr>
                <td colSpan="2" className="px-6 py-8 text-center text-text-muted">
                  {activeSchoolYear 
                    ? `Aucune classe pour l'année ${activeSchoolYear.name}` 
                    : 'Aucune classe trouvée'}
                </td>
              </tr>
            ) : (
              filteredClassrooms.map((classroom) => (
              <tr key={classroom.id} className="hover:bg-secondary-700/30">
                <td className="px-6 py-4 whitespace-nowrap text-text-main">{classroom.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onEdit(classroom)}
                      className="p-2 text-accent-400 hover:text-accent-300 hover:bg-accent-600/20 rounded-lg transition-colors"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(classroom)}
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
        title="Supprimer la Classe"
        message={`Êtes-vous sûr de vouloir supprimer la classe "${confirmDialog.classroom?.name}" ?`}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmDialog({ show: false, classroom: null })}
      />
    </>
  );
};

export default ClassroomList;
