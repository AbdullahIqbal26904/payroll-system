import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create an axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for adding token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 (Unauthorized) responses
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login page if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/me'),
  changePassword: (passwordData) => api.put('/auth/change-password', passwordData)
};

// Users API calls
export const usersAPI = {
  getAllUsers: () => api.get('/users'),
  createUser: (userData) => api.post('/users', userData),
  getUser: (id) => api.get(`/users/${id}`),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
  resetPassword: (id, passwordData) => api.post(`/users/${id}/reset-password`, passwordData)
};

// Employees API calls
export const employeesAPI = {
  getAllEmployees: (params) => api.get('/employees', { params }),
  addEmployee: (employeeData) => api.post('/employees', employeeData),
  getEmployee: (id) => api.get(`/employees/${id}`),
  updateEmployee: (id, employeeData) => api.put(`/employees/${id}`, employeeData),
  deleteEmployee: (id) => api.delete(`/employees/${id}`)
};

// Payroll API calls
export const payrollAPI = {
  // Timesheet endpoints
  uploadTimesheet: (formData) => api.post('/payroll/upload-timesheet', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  getTimesheetPeriods: () => api.get('/payroll/timesheet-periods'),
  getTimesheetPeriod: (id) => api.get(`/payroll/timesheet-periods/${id}`),
  
  // Payroll calculation endpoints
  calculatePayroll: (data) => api.post('/payroll/calculate', data),
  
  // Payroll reports endpoints
  getPayrollReports: () => api.get('/payroll/reports'),
  getPayrollReport: (id) => api.get(`/payroll/reports/${id}`),
  
  // Paystub endpoints
  downloadPaystub: (payrollRunId, employeeId) => api.get(`/payroll/paystub/${payrollRunId}/${employeeId}`, { responseType: 'blob' }),
  emailPaystubs: (data) => api.post('/payroll/email-paystubs', data),
  
  // Settings endpoints
  getPayrollSettings: () => api.get('/payroll/settings'),
  updatePayrollSettings: (settingsData) => api.put('/payroll/settings', settingsData)
};

// Health check
export const healthCheck = () => api.get('/health');

export default api;
