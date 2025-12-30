import axios from 'axios';

// ======================= CONFIGURATION =======================

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Wrapper
const apiRequest = async (method, endpoint, data = null, config = {}) => {
  try {
    const response = await API.request({
      method,
      url: endpoint,
      data,
      ...config,
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error);

    if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
      const messages = error.response.data.errors.map((e) => e.message).join(', ');
      throw new Error(messages);
    }

    throw new Error(error.response?.data?.message || error.message || 'Something went wrong with API');
  }
};

const getToken = () => localStorage.getItem('token');

//
// ======================= AUTH API =======================
//
export const authAPI = {
  register: (data) => apiRequest('POST', '/auth/register', data),
  login: (data) => apiRequest('POST', '/auth/login', data),
  getProfile: (token = getToken()) =>
    apiRequest('GET', '/auth/me', null, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  forgotPassword: (email) => apiRequest('POST', '/auth/forgot-password', { email }),
  resetPassword: (token, password) =>
    apiRequest('POST', `/auth/reset-password/${token}`, { password }),
};

//
// ======================= TRANSACTIONS API =======================
//
export const transactionAPI = {
  getAll: () => apiRequest('GET', '/transactions'),
  addIncome: (data) => apiRequest('POST', '/transactions', { ...data, type: 'income' }),
  addExpense: (data) => apiRequest('POST', '/transactions', { ...data, type: 'expense' }),
  update: (id, data) => apiRequest('PUT', `/transactions/${id}`, data),
  remove: (id) => apiRequest('DELETE', `/transactions/${id}`),
};

//
// ======================= BUDGET API =======================
//
export const budgetAPI = {
  getAll: () => apiRequest('GET', '/budgets'),
  create: (data) => apiRequest('POST', '/budgets', data),
  update: (id, data) => apiRequest('PUT', `/budgets/${id}`, data),
  remove: (id) => apiRequest('DELETE', `/budgets/${id}`),
};

//
// ======================= TAX ESTIMATOR API =======================
//
export const taxAPI = {
  estimate: (payload) => apiRequest('POST', '/tax/estimate', payload),
};

//
// ======================= REPORTS API =======================
//
export const reportsAPI = {
  generate: (payload) => apiRequest('POST', '/reports/generate', payload),
  getAll: () => apiRequest('GET', '/reports'),
};
export const taxCalendarAPI = {
  getCalendar: () => apiRequest('GET', '/tax/calendar'),
};


//
// ======================= HEALTH CHECK =======================
//
export const healthCheck = () => apiRequest('GET', '/health');

export default API;
