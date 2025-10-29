import React, { createContext, useState, useEffect } from 'react';
import SchoolYearService from '../services/SchoolYearService';

export const ActiveSchoolYearContext = createContext();

export const ActiveSchoolYearProvider = ({ children }) => {
  const [activeSchoolYear, setActiveSchoolYear] = useState(null);
  const [allSchoolYears, setAllSchoolYears] = useState([]);
  const [loading, setLoading] = useState(true);

  // Charger toutes les années scolaires et identifier l'année active
  const loadSchoolYears = async () => {
    try {
      setLoading(true);
      const data = await SchoolYearService.getAll();
      let schoolYearsArray = [];
      
      if (Array.isArray(data)) {
        schoolYearsArray = data;
      } else if (data && data.data && Array.isArray(data.data.items)) {
        schoolYearsArray = data.data.items;
      } else if (data && Array.isArray(data.schoolYears)) {
        schoolYearsArray = data.schoolYears;
      } else if (data && Array.isArray(data.items)) {
        // Structure générique paginée: {items: [...], pagination: {...}}
        schoolYearsArray = data.items;
      }
      
      setAllSchoolYears(schoolYearsArray);
      const active = schoolYearsArray.find(sy => sy.isActive);
      setActiveSchoolYear(active || null);
    } catch (error) {
      console.error('Erreur lors du chargement des années scolaires:', error);
      setAllSchoolYears([]);
      setActiveSchoolYear(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchoolYears();
  }, []);

  // Changer l'année scolaire active (pour filtrage manuel)
  const changeActiveSchoolYear = (schoolYearId) => {
    const schoolYear = allSchoolYears.find(sy => sy.id === parseInt(schoolYearId));
    setActiveSchoolYear(schoolYear || null);
  };

  // Réinitialiser à l'année active par défaut
  const resetToDefaultActive = () => {
    const active = allSchoolYears.find(sy => sy.isActive);
    setActiveSchoolYear(active || null);
  };

  return (
    <ActiveSchoolYearContext.Provider
      value={{
        activeSchoolYear,
        allSchoolYears,
        loading,
        changeActiveSchoolYear,
        resetToDefaultActive,
        refreshSchoolYears: loadSchoolYears,
      }}
    >
      {children}
    </ActiveSchoolYearContext.Provider>
  );
};
