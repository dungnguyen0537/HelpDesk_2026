import axiosClient from './axiosClient';

export const authApi = {
  login: async (credentials) => {
    // credentials: { usernameOrEmail, password }
    return await axiosClient.post('/auth/login', credentials);
  },

  register: async (userData) => {
    // userData: { username, email, password, fullName, phoneNumber, departmentId }
    return await axiosClient.post('/auth/register', userData);
  },

  getCurrentUser: async () => {
    return await axiosClient.get('/auth/me');
  },

  logout: async () => {
    return await axiosClient.post('/auth/logout');
  },
};
