import { api } from '../api/apiService';

const ClassroomService = {
  getAll: async () => {
    const response = await api.get('/classrooms');
    return response;
  },

  getById: async (id) => {
    const response = await api.get(`/classrooms/${id}`);
    return response;
  },

  create: async (classroom) => {
    const response = await api.post('/classrooms', classroom);
    return response;
  },

  update: async (id, classroom) => {
    const response = await api.put(`/classrooms/${id}`, classroom);
    return response;
  },

  delete: async (id) => {
    const response = await api.delete(`/classrooms/${id}`);
    return response;
  },

  createGroup: async (id, group) => {
    const response = await api.post(`/classrooms/${id}/groups`, group);
    return response;
  },

  updateGroup: async (groupId, group) => {
    const response = await api.put(`/classrooms/groups/${groupId}`, group);
    return response;
  },

  deleteGroup: async (groupId) => {
    const response = await api.delete(`/classrooms/groups/${groupId}`);
    return response;
  },
};

export default ClassroomService;
