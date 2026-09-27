import { create } from 'zustand';

export const useAuthStore = create((set) => {
  const storedUser = localStorage.getItem('helpdesk_user');
  const storedToken = localStorage.getItem('helpdesk_token');

  return {
    user: storedUser ? JSON.parse(storedUser) : null,
    token: storedToken || null,
    isAuthenticated: Boolean(storedToken),
    isLoading: false,
    error: null,

    login: (user, token) => {
      localStorage.setItem('helpdesk_user', JSON.stringify(user));
      localStorage.setItem('helpdesk_token', token);
      set({ user, token, isAuthenticated: true, error: null });
    },

    logout: () => {
      localStorage.removeItem('helpdesk_user');
      localStorage.removeItem('helpdesk_token');
      set({ user: null, token: null, isAuthenticated: false });
    },

    setUser: (user) => {
      localStorage.setItem('helpdesk_user', JSON.stringify(user));
      set({ user });
    },

    setError: (error) => set({ error }),
  };
});
