import axios from 'axios';

// The API is proxied via Nginx or hit directly during development
const API_URL = process.env.REACT_APP_API_URL || '/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const userAPI = {
  getUsers: async () => {
    try {
      const response = await api.get('/users/');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },
  createUser: async (userData) => {
    try {
      const response = await api.post('/users/', userData);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },
  deleteUser: async (userId) => {
    try {
      await api.delete(`/users/${userId}`);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },
};

export const healthAPI = {
  getHealth: async () => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      return { status: 'unhealthy', error: error.message };
    }
  },
};
