import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle common errors like 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/signup') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  login: async (credentials) => {
    const res = await api.post('/user/login', credentials);
    return res.data;
  },
  register: async (userData) => {
    const res = await api.post('/user/register', userData);
    return res.data;
  },
  getCurrentUser: async () => {
    const res = await api.get('/user/me');
    return res.data;
  },
  updateProfile: async (data) => {
    const res = await api.put('/user/profile', data);
    return res.data;
  },
  updatePassword: async (data) => {
    const res = await api.put('/user/password', data);
    return res.data;
  },
};

// Income Services
export const incomeService = {
  getAll: async () => {
    const res = await api.get('/income/get');
    return res.data;
  },
  getOverview: async (range = 'monthly') => {
    const res = await api.get(`/income/overview?range=${range}`);
    return res.data;
  },
  add: async (data) => {
    const res = await api.post('/income/add', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/income/update/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/income/delete/${id}`);
    return res.data;
  },
  downloadExcel: async () => {
    const response = await api.get('/income/downloadexcel', {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'IncomeData.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};

// Expense Services
export const expenseService = {
  getAll: async () => {
    const res = await api.get('/expense/get');
    return res.data;
  },
  getOverview: async (range = 'monthly') => {
    const res = await api.get(`/expense/overview?range=${range}`);
    return res.data;
  },
  add: async (data) => {
    const res = await api.post('/expense/add', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/expense/update/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/expense/delete/${id}`);
    return res.data;
  },
  downloadExcel: async () => {
    const response = await api.get('/expense/downloadExcel', {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'ExpenseData.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};

// Dashboard Services
export const dashboardService = {
  getOverview: async () => {
    const res = await api.get('/dashboard');
    return res.data;
  },
};

export default api;
