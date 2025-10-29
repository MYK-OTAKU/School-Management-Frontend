import React, { createContext, useState, useEffect } from 'react';
import StudentService from '../services/StudentService';

export const StudentContext = createContext();

export const StudentProvider = ({ children }) => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    StudentService.getAll().then((data) => {
      if (Array.isArray(data)) {
        setStudents(data);
      } else if (data && data.data && Array.isArray(data.data.items)) {
        setStudents(data.data.items);
      } else if (data && Array.isArray(data.students)) {
        setStudents(data.students);
      } else if (data && Array.isArray(data.items)) {
        // Structure générique paginée: {items: [...], pagination: {...}}
        setStudents(data.items);
      } else {
        console.error("Invalid data structure for students:", data);
        setStudents([]);
      }
    }).catch(error => {
      console.error("Failed to fetch students:", error);
      setStudents([]);
    });
  }, []);

  const addStudent = (student) => {
    setStudents((prev) => [...prev, student]);
  };

  const updateStudent = (updatedStudent) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === updatedStudent.id ? updatedStudent : student
      )
    );
  };

  const deleteStudent = (id) => {
    setStudents((prev) => prev.filter((student) => student.id !== id));
  };

  return (
    <StudentContext.Provider
      value={{
        students,
        setStudents,
        addStudent,
        updateStudent,
        deleteStudent,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};
