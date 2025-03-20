import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error:', error.response.data);
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
      return Promise.reject({ message: 'No response from server' });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message);
      return Promise.reject({ message: error.message });
    }
  }
);

// Auth services
export const auth = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData)
};

// Maintenance services
export const maintenance = {
  getAll: () => api.get('/maintenance'),
  create: (data) => api.post('/maintenance', data),
  update: (id, data) => api.put(`/maintenance/${id}`, data),
  deleteOne: async (id) => {
    try {
      const response = await api.delete(`/maintenance/${id}`);
      return response;
    } catch (error) {
      console.error('Delete request failed:', error);
      throw error;
    }
  }
};

export default api; 