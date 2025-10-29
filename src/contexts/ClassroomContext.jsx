import React, { createContext, useState, useEffect } from 'react';
import ClassroomService from '../services/ClassroomService';

export const ClassroomContext = createContext();

export const ClassroomProvider = ({ children }) => {
  const [classrooms, setClassrooms] = useState([]);

  useEffect(() => {
    ClassroomService.getAll().then((data) => {
      // Le backend peut renvoyer soit un tableau direct, soit un objet avec pagination
      if (Array.isArray(data)) {
        setClassrooms(data);
      } else if (data && data.data && Array.isArray(data.data.classrooms)) {
        setClassrooms(data.data.classrooms);
      } else if (data && Array.isArray(data.classrooms)) {
        // Structure paginée: {classrooms: [...], pagination: {...}}
        setClassrooms(data.classrooms);
      } else if (data && Array.isArray(data.items)) {
        // Structure générique paginée: {items: [...], pagination: {...}}
        setClassrooms(data.items);
      } else {
        console.error("Invalid data structure for classrooms:", data);
        setClassrooms([]);
      }
    }).catch(error => {
      console.error("Failed to fetch classrooms:", error);
      setClassrooms([]);
    });
  }, []);

  const addClassroom = (classroom) => {
    setClassrooms((prev) => [...prev, classroom]);
  };

  const updateClassroom = (updatedClassroom) => {
    setClassrooms((prev) =>
      prev.map((classroom) =>
        classroom.id === updatedClassroom.id ? updatedClassroom : classroom
      )
    );
  };

  const deleteClassroom = (id) => {
    setClassrooms((prev) => prev.filter((classroom) => classroom.id !== id));
  };

  return (
    <ClassroomContext.Provider
      value={{
        classrooms,
        setClassrooms,
        addClassroom,
        updateClassroom,
        deleteClassroom,
      }}
    >
      {children}
    </ClassroomContext.Provider>
  );
};
