import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
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

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      // Clear local storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// User API
export const userAPI = {
  updateProfile: async (userId: string, userData: any) => {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  },
  uploadProfilePicture: async (userId: string, file: File) => {
    const formData = new FormData();
    formData.append('profilePicture', file);
    
    const response = await api.post(`/users/${userId}/profile-picture`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

// Appointment API
export const appointmentAPI = {
  getAppointments: async (params?: any) => {
    const response = await api.get('/appointments', { params });
    return response.data;
  },
  getAppointmentById: async (id: string) => {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  },
  createAppointment: async (appointmentData: any) => {
    const response = await api.post('/appointments', appointmentData);
    return response.data;
  },
  updateAppointment: async (id: string, appointmentData: any) => {
    const response = await api.put(`/appointments/${id}`, appointmentData);
    return response.data;
  },
  cancelAppointment: async (id: string) => {
    const response = await api.delete(`/appointments/${id}`);
    return response.data;
  },
};

// Message API
export const messageAPI = {
  getMessages: async (appointmentId: string) => {
    const response = await api.get(`/appointments/${appointmentId}/messages`);
    return response.data;
  },
  sendMessage: async (appointmentId: string, content: string) => {
    const response = await api.post(`/appointments/${appointmentId}/messages`, { content });
    return response.data;
  },
};

// File API
export const fileAPI = {
  getFiles: async (appointmentId: string) => {
    const response = await api.get(`/appointments/${appointmentId}/files`);
    return response.data;
  },
  uploadFile: async (appointmentId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post(`/appointments/${appointmentId}/files`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  deleteFile: async (appointmentId: string, fileId: string) => {
    const response = await api.delete(`/appointments/${appointmentId}/files/${fileId}`);
    return response.data;
  },
};

// Notification API
export const notificationAPI = {
  getNotifications: async () => {
    const response = await api.get('/notifications');
    return response.data;
  },
  markAsRead: async (notificationId: string) => {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  },
  markAllAsRead: async () => {
    const response = await api.put('/notifications/read-all');
    return response.data;
  },
  deleteNotification: async (notificationId: string) => {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
  },
};

// Doctor API
export const doctorAPI = {
  getDoctors: async (params?: any) => {
    const response = await api.get('/doctors', { params });
    return response.data;
  },
  getDoctorById: async (id: string) => {
    const response = await api.get(`/doctors/${id}`);
    return response.data;
  },
  getDoctorAvailability: async (doctorId: string, date: string) => {
    const response = await api.get(`/doctors/${doctorId}/availability`, { params: { date } });
    return response.data;
  },
};

export default api;