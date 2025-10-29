import { api } from '../api/apiService';

const SchoolYearService = {
  getAll: async () => {
    const response = await api.get('/school-years');
    return response;
  },

  getById: async (id) => {
    const response = await api.get(`/school-years/${id}`);
    return response;
  },

  create: async (schoolYear) => {
    const response = await api.post('/school-years', schoolYear);
    return response;
  },

  update: async (id, schoolYear) => {
    const response = await api.put(`/school-years/${id}`, schoolYear);
    return response;
  },

  delete: async (id) => {
    const response = await api.delete(`/school-years/${id}`);
    return response;
  },

  activate: async (id) => {
    const response = await api.post(`/school-years/${id}/activate`);
    return response;
  },
};

export default SchoolYearService;
