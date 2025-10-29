import { api } from '../api/apiService';

const PaymentService = {
  getAll: async () => {
    const response = await api.get('/payments');
    return response.data || response;
  },

  getById: async (id) => {
    const response = await api.get(`/payments/${id}`);
    return response.data || response;
  },

  create: async (payment) => {
    const response = await api.post('/payments', payment);
    return response.data || response;
  },

  update: async (id, payment) => {
    const response = await api.put(`/payments/${id}`, payment);
    return response.data || response;
  },

  delete: async (id) => {
    const response = await api.delete(`/payments/${id}`);
    return response.data || response;
  },
};

export default PaymentService;
