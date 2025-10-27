import axios from 'axios';

const API = axios.create({
  baseURL: process.env.API_BASE_URL || 'https://moviebooking-15wj.onrender.com/',
  headers: { 'Content-Type': 'application/json' },
});

export default API;
