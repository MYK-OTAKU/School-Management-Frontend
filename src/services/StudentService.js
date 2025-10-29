import { api } from '../api/apiService';

const StudentService = {
  getAll: async () => {
    const response = await api.get('/students');
    return response;
  },

  getById: async (id) => {
    const response = await api.get(`/students/${id}`);
    return response;
  },

  create: async (student) => {
    const response = await api.post('/students', student);
    return response;
  },

  update: async (id, student) => {
    const response = await api.put(`/students/${id}`, student);
    return response;
  },

  delete: async (id) => {
    const response = await api.delete(`/students/${id}`);
    return response;
  },

  enroll: async (id, enrollment) => {
    const response = await api.post(`/students/${id}/enroll`, enrollment);
    return response;
  },
};

export default StudentService;
