import React, { useContext } from 'react';
import { Calendar } from 'lucide-react';
import { ActiveSchoolYearContext } from '../../contexts/ActiveSchoolYearContext';

const SchoolYearSelector = () => {
  const { activeSchoolYear, allSchoolYears, changeActiveSchoolYear, loading } = useContext(ActiveSchoolYearContext);

  if (loading) {
    return (
      <div className="flex items-center space-x-2 px-4 py-2 bg-secondary-700/50 border border-secondary-600 rounded-lg">
        <Calendar className="h-5 w-5 text-primary-400" />
        <span className="text-text-muted">Chargement...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 bg-secondary-700/50 border border-secondary-600 rounded-lg px-3 py-2">
      <Calendar className="h-5 w-5 text-primary-400" />
      <select
        value={activeSchoolYear?.id || ''}
        onChange={(e) => changeActiveSchoolYear(e.target.value)}
        className="bg-transparent text-text-main focus:outline-none cursor-pointer"
      >
        {allSchoolYears.map((sy) => (
          <option key={sy.id} value={sy.id}>
            {sy.name} {sy.isActive ? '(Active)' : ''}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SchoolYearSelector;
