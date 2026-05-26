import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authService = {
  register: (username, password) =>
    api.post('/auth/register', { username, password }),
  login: (username, password) =>
    api.post('/auth/login', { username, password }),
};

// Spare Parts API
export const sparePartService = {
  create: (data) => api.post('/spare-parts', data),
  getAll: () => api.get('/spare-parts'),
  getById: (id) => api.get(`/spare-parts/${id}`),
};

// Stock In API
export const stockInService = {
  create: (data) => api.post('/stock-in', data),
  getAll: () => api.get('/stock-in'),
};

// Stock Out API
export const stockOutService = {
  create: (data) => api.post('/stock-out', data),
  getAll: () => api.get('/stock-out'),
  getById: (id) => api.get(`/stock-out/${id}`),
  update: (id, data) => api.put(`/stock-out/${id}`, data),
  delete: (id) => api.delete(`/stock-out/${id}`),
};

// Reports API
export const reportsService = {
  getDailyStockStatus: () => api.get('/reports/daily-stock-status'),
  getDailyStockOut: () => api.get('/reports/daily-stock-out'),
  getCustomReport: (startDate, endDate, reportType) =>
    api.get('/reports/custom', { params: { startDate, endDate, reportType } }),
};

export default api;
