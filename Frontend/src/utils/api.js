import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth API calls
export const authAPI = {
  login: (email, password) => 
    api.post('/main/auth/login', { email, password }),
  
  register: (username, email, password) => 
    api.post('/main/auth/register', { username, email, password }),
};

export default api;
