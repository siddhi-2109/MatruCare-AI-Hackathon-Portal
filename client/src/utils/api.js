import axios from 'axios';

// Axios instance; attaches the JWT from localStorage to every request
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Helper to pull a readable message out of an axios error
export const errMsg = (err) => err?.response?.data?.message || 'Something went wrong. Please try again.';

export default api;
