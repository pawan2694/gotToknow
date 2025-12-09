import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const apiService = {
  // Authentication
  login: async (credentials) => {
    const response = await api.post('/login', credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/register', userData);
    return response.data;
  },

  // User CRUD
  getAllUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  updateUser: async (id, data) => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  // Data CRUD
  getAllData: async () => {
    const response = await api.get('/data');
    return response.data;
  },

  getDataById: async (id) => {
    const response = await api.get(`/data/${id}`);
    return response.data;
  },

  createData: async (data) => {
    const response = await api.post('/data', data);
    return response.data;
  },

  updateData: async (id, data) => {
    const response = await api.put(`/data/${id}`, data);
    return response.data;
  },

  deleteData: async (id) => {
    const response = await api.delete(`/data/${id}`);
    return response.data;
  },

  // Images
  getAllImages: async (category) => {
    const url = category ? `/images?category=${category}` : '/images';
    const response = await api.get(url);
    return response.data;
  },

  getImageById: async (id) => {
    const response = await api.get(`/images/${id}`);
    return response.data;
  },

  uploadImage: async (formData) => {
    const response = await api.post('/images/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteImage: async (id) => {
    const response = await api.delete(`/images/${id}`);
    return response.data;
  }
};

export default api;