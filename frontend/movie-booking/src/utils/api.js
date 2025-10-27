import axios from 'axios';

const api = axios.create({
  baseURL: process.env.API_BASE_URL || 'https://moviebooking-15wj.onrender.com/',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
