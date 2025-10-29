import React, { createContext, useState, useEffect } from 'react';
import SchoolYearService from '../services/SchoolYearService';

export const SchoolYearContext = createContext();

export const SchoolYearProvider = ({ children }) => {
  const [schoolYears, setSchoolYears] = useState([]);

  useEffect(() => {
    SchoolYearService.getAll().then((response) => {
      if (Array.isArray(response)) {
        setSchoolYears(response);
      } else if (response && Array.isArray(response.data)) {
        setSchoolYears(response.data);
      } else if (response && Array.isArray(response.schoolYears)) {
        setSchoolYears(response.schoolYears);
      } else if (response && Array.isArray(response.items)) {
        // Structure générique paginée: {items: [...], pagination: {...}}
        setSchoolYears(response.items);
      } else {
        console.error("Invalid data structure for school years:", response);
        setSchoolYears([]);
      }
    }).catch(error => {
      console.error("Failed to fetch school years:", error);
      setSchoolYears([]);
    });
  }, []);

  const addSchoolYear = (schoolYear) => {
    setSchoolYears((prev) => [...prev, schoolYear]);
  };

  const updateSchoolYear = (updatedSchoolYear) => {
    setSchoolYears((prev) =>
      prev.map((schoolYear) =>
        schoolYear.id === updatedSchoolYear.id ? updatedSchoolYear : schoolYear
      )
    );
  };

  const deleteSchoolYear = (id) => {
    setSchoolYears((prev) => prev.filter((schoolYear) => schoolYear.id !== id));
  };

  return (
    <SchoolYearContext.Provider
      value={{
        schoolYears,
        setSchoolYears,
        addSchoolYear,
        updateSchoolYear,
        deleteSchoolYear,
      }}
    >
      {children}
    </SchoolYearContext.Provider>
  );
};
