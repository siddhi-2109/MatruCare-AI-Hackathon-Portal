
import axios from 'axios';

// ==========================================
// API BASE URL
// ==========================================

const API_URL = (
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
).trim().replace(/\/+$/, '');

// ==========================================
// AXIOS INSTANCE
// ==========================================

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 90000
});

// ==========================================
// REQUEST INTERCEPTOR
// Attach JWT token automatically
// ==========================================

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

// ==========================================
// RESPONSE INTERCEPTOR
// Handle authentication errors
// ==========================================

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Authentication expired or invalid
      localStorage.removeItem('token');
    }

    return Promise.reject(error);
  }
);

// ==========================================
// ERROR MESSAGE HELPER
// ==========================================

export const errMsg = (err) => {
  return (
    err?.response?.data?.message ||
    err?.message ||
    'Something went wrong. Please try again.'
  );
};

// ==========================================
// EXPORT
// ==========================================

export default api;
