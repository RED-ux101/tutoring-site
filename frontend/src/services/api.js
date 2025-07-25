import axios from 'axios';

// More robust API base URL detection
const getApiBaseUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    // In production, use relative path (works with Railway and other deployments)
    return '/api';
  } else {
    // In development, check if backend is available
    return process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  }
};

const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tutorToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors and network issues
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('tutorToken');
      localStorage.removeItem('tutorData');
      window.location.href = '/login';
    } else if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNREFUSED') {
      console.error('Network error - backend may not be available');
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: async (userData) => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },
  
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
};

// Files API
export const filesAPI = {
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  getMyFiles: async () => {
    const response = await api.get('/files/my-files');
    return response.data;
  },
  
  getPublicFiles: async () => {
    // Use direct axios call with better error handling
    try {
      const response = await axios.get(`${API_BASE_URL}/files/public`, {
        timeout: 10000
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching public files:', error);
      // Return empty array if API is not available
      if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNREFUSED') {
        return { files: [] };
      }
      throw error;
    }
  },
  
  deleteFile: async (fileId) => {
    const response = await api.delete(`/files/${fileId}`);
    return response.data;
  },
  
  getDownloadUrl: (fileId) => {
    return `${API_BASE_URL}/files/download/${fileId}`;
  },
};

export default api; 