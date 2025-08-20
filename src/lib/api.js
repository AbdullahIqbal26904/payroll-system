import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL // || 'https://texas.texaswebcoders.com/api';

// Create an axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  // Only use withCredentials for non-login requests
  // For login requests we'll handle cookies manually
  withCredentials: false 
});

// Request interceptor for adding token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
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
      Cookies.remove('token');
      Cookies.remove('user');
      Cookies.remove('tempToken');
      Cookies.remove('userId');
      // Redirect to login page if not already there
      if (window.location.pathname !== '/login' && 
          !window.location.pathname.includes('/mfa-verification')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  // Basic authentication
  login: (credentials) => api.post('/auth/login', credentials, { withCredentials: false }),
  getCurrentUser: () => api.get('/auth/me'),
  changePassword: (passwordData) => api.put('/auth/change-password', passwordData),
  
  // App-based MFA routes
  setupMfa: () => api.post('/auth/setup-mfa'),
  verifySetupMfa: (params) => api.post('/auth/verify-setup-mfa', params),
  disableMfa: (password) => api.post('/auth/disable-mfa', { password }),
  generateBackupCodes: () => api.post('/auth/generate-backup-codes'),
  
  // Email-based MFA routes
  setupEmailMfa: () => api.post('/auth/setup-email-mfa'),
  verifyEmailMfa: (code) => api.post('/auth/verify-email-mfa', { code }),
  disableEmailMfa: (password) => api.post('/auth/disable-email-mfa', { password }),
  
  // MFA Verification routes (with temporary token)
  verifyMfa: (userId, token, useBackupCode = false) => 
    api.post('/auth/verify-mfa', { userId, token, useBackupCode }),
  sendMfaCode: (userId) => api.post('/auth/send-mfa-code', { userId }),
  verifyEmailMfaLogin: (userId, code) => 
    api.post('/auth/verify-email-mfa-login', { userId, code })
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
  viewPaystub: (payrollRunId, employeeId) => api.get(`/payroll/paystub/${payrollRunId}/${employeeId}?view=detailed`, { responseType: 'blob' }),
  emailPaystubs: (data) => api.post('/payroll/email-paystubs', data),
  
  // Settings endpoints
  getPayrollSettings: () => api.get('/payroll/settings'),
  updatePayrollSettings: (settingsData) => api.put('/payroll/settings', settingsData)
};

// Employee Loans API calls
export const loansAPI = {
  // Get all loans with optional filters
  getAllLoans: (params) => api.get('/loans', { params }),
  
  // Get loan by ID
  getLoan: (id) => api.get(`/loans/${id}`),
  
  // Create a new loan
  createLoan: (loanData) => api.post('/loans', loanData),
  
  // Create a new third-party loan
  createThirdPartyLoan: (loanData) => api.post('/loans/third-party', loanData),
  
  // Update an existing loan
  updateLoan: (id, loanData) => api.put(`/loans/${id}`, loanData),
  
  // Get all loans for a specific employee
  getEmployeeLoans: (employeeId, params) => api.get(`/employees/${employeeId}/loans`, { params }),
  
  // Get third-party payment information for a payroll run
  getThirdPartyPayments: (payrollRunId) => api.get(`/loans/third-party-payments/${payrollRunId}`)
};

// Vacation API calls aligned with the new API structure
export const vacationAPI = {
  // Get all vacations with optional filters
  getVacations: (params) => api.get('/vacations', { params }),
  
  // Get vacations for a specific employee
  getEmployeeVacations: (employeeId, params) => api.get(`/vacations/employee/${employeeId}`, { params }),
  
  // Get specific vacation details
  getVacationDetails: (id) => api.get(`/vacations/${id}`),
  
  // Create a new vacation
  createVacation: (vacationData) => api.post('/vacations', vacationData),
  
  // Update an existing vacation
  updateVacation: (id, vacationData) => api.put(`/vacations/${id}`, vacationData),
  
  // Delete a vacation
  deleteVacation: (id) => api.delete(`/vacations/${id}`),
  
  // Initialize vacation entitlement
  initializeVacation: (initData) => api.post('/vacations/initialize', initData)
};

// Holiday API calls
export const holidaysAPI = {
  // Get holiday settings
  getHolidaySettings: () => api.get('/holidays/settings'),
  
  // Update holiday settings
  updateHolidaySettings: (settingsData) => api.put('/holidays/settings', settingsData),
  
  // Get all holidays with optional filters
  getHolidays: (params) => api.get('/holidays', { params }),
  
  // Get specific holiday details
  getHoliday: (id) => api.get(`/holidays/${id}`),
  
  // Create a new holiday
  createHoliday: (holidayData) => api.post('/holidays', holidayData),
  
  // Update an existing holiday
  updateHoliday: (id, holidayData) => api.put(`/holidays/${id}`, holidayData),
  
  // Delete a holiday
  deleteHoliday: (id) => api.delete(`/holidays/${id}`),
  
  // Get holidays in a specific date range
  getHolidaysInRange: (startDate, endDate) => 
    api.get('/holidays/range', { params: { startDate, endDate } })
};

// Department API calls
export const departmentsAPI = {
  // Get all departments
  getAllDepartments: () => api.get('/departments'),
  
  // Get department by ID
  getDepartment: (id) => api.get(`/departments/${id}`),
  
  // Create a new department
  createDepartment: (departmentData) => api.post('/departments', departmentData),
  
  // Update an existing department
  updateDepartment: (id, departmentData) => api.put(`/departments/${id}`, departmentData),
  
  // Delete a department
  deleteDepartment: (id) => api.delete(`/departments/${id}`)
};

// Health check
export const healthCheck = () => api.get('/health');

export default api;
