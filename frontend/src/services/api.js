import axios from 'axios';

// Force the correct backend URL
const getApiBaseUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    // Force the correct backend Railway URL
    return 'https://tutoring-site-production-30eb.up.railway.app/api';
  } else {
    // In development, use localhost backend
    return 'http://localhost:5000/api';
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
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Don't automatically logout, let the component handle it
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
  uploadFile: async (file, category = '') => {
    const formData = new FormData();
    formData.append('file', file);
    if (category) {
      formData.append('category', category);
    }
    
    const response = await api.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  getMyFiles: async () => {
    try {
      const response = await api.get('/files/my-files');
      return response.data;
    } catch (error) {
      console.error('Error fetching my files:', error);
      // Return empty array if API is not available
      if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNREFUSED') {
        return { files: [] };
      }
      throw error;
    }
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
  
  renameFile: async (fileId, newName) => {
    const response = await api.put(`/files/${fileId}/rename`, { newName });
    return response.data;
  },
  
  getDownloadUrl: (fileId) => {
    return `${API_BASE_URL}/files/download/${fileId}`;
  }
};

// Submissions API
export const submissionsAPI = {
  submitFile: async (formData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/submissions/submit`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000
      });
      return response.data;
    } catch (error) {
      console.error('Submission error:', error);
      if (error.response?.status === 405) {
        throw new Error('Submission method not allowed. Please try again.');
      } else if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNREFUSED') {
        throw new Error('Network error. Please check your connection and try again.');
      } else {
        throw new Error('Failed to submit resource. Please try again.');
      }
    }
  },
  
  getPendingSubmissions: async () => {
    const response = await api.get('/submissions/pending');
    return response.data;
  },
  
  getAllSubmissions: async () => {
    const response = await api.get('/submissions/all');
    return response.data;
  },
  
  approveSubmission: async (submissionId) => {
    const response = await api.post(`/submissions/approve/${submissionId}`);
    return response.data;
  },
  
  rejectSubmission: async (submissionId, reason) => {
    const response = await api.post(`/submissions/reject/${submissionId}`, { reason });
    return response.data;
  },
  
  renameSubmission: async (submissionId, newName) => {
    const response = await api.put(`/submissions/${submissionId}/rename`, { newName });
    return response.data;
  }
};

export default api; 