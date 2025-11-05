import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

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

// Contact API calls
export const contactAPI = {
  // Submit a new contact inquiry
  submitInquiry: (contactData) => 
    api.post('/main/contact', contactData),
  
  // Get all contact inquiries (admin)
  getAllInquiries: () => 
    api.get('/main/contact/all'),
  
  // Get contact inquiry by ID
  getInquiryById: (id) => 
    api.get(`/main/contact/${id}`),
  
  // Get contact inquiries by email
  getInquiriesByEmail: (email) => 
    api.get(`/main/contact/email/${email}`),
  
  // Get contact inquiries by service type
  getInquiriesByServiceType: (serviceType) => 
    api.get(`/main/contact/service/${serviceType}`),
  
  // Get contact inquiries by status
  getInquiriesByStatus: (status) => 
    api.get(`/main/contact/status/${status}`),
  
  // Get recent contact inquiries
  getRecentInquiries: () => 
    api.get('/main/contact/recent'),
  
  // Update contact status
  updateStatus: (id, status) => 
    api.put(`/main/contact/${id}/status?status=${status}`),
  
  // Get contact statistics
  getStatistics: () => 
    api.get('/main/contact/statistics'),
  
  // Health check
  healthCheck: () => 
    api.get('/main/contact/health'),
};

export default api;
