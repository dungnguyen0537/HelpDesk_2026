import axiosClient from './axiosClient';

export const ticketApi = {
  getTickets: async (params) => {
    return await axiosClient.get('/tickets', { params });
  },

  getTicketById: async (id) => {
    return await axiosClient.get(`/tickets/${id}`);
  },

  createTicket: async (ticketData) => {
    return await axiosClient.post('/tickets', ticketData);
  },

  updateTicketStatus: async (id, status) => {
    return await axiosClient.patch(`/tickets/${id}/status`, { status });
  },

  assignTicket: async (id, assigneeId) => {
    return await axiosClient.patch(`/tickets/${id}/assign`, { assigneeId });
  },

  addComment: async (id, commentData) => {
    return await axiosClient.post(`/tickets/${id}/comments`, commentData);
  },

  getStats: async () => {
    return await axiosClient.get('/tickets/stats');
  },
};
