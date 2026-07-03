import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' }
});

// Add token to every request
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    console.log('🔑 Token from localStorage:', token ? token.substring(0, 30) + '...' : 'NO TOKEN');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Token added to request');
    } else {
      console.log('❌ No token found! Please login first.');
    }
    
    console.log('📤 Request URL:', config.url);
    return config;
  },
  error => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => {
    console.log('📥 Response:', response.status, response.config.url);
    return response;
  },
  error => {
    console.error('❌ Response Error:', error);
    
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log('⚠️ Authentication failed! Redirecting to login...');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;