import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Attach JWT Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('careerconnect_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expired and not on login page, clear token and optionally emit or let context handle
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        localStorage.removeItem('careerconnect_token');
        localStorage.removeItem('careerconnect_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
