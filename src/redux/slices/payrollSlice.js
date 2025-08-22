import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { payrollAPI } from '@/lib/api';

// Upload timesheet CSV file
export const uploadTimesheet = createAsyncThunk(
  'payroll/uploadTimesheet',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await payrollAPI.uploadTimesheet(formData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload timesheet');
    }
  }
);

// Get all timesheet periods
export const fetchTimesheetPeriods = createAsyncThunk(
  'payroll/fetchTimesheetPeriods',
  async (_, { rejectWithValue }) => {
    try {
      const response = await payrollAPI.getTimesheetPeriods();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch timesheet periods');
    }
  }
);

// Get timesheet period details
export const fetchTimesheetPeriodDetails = createAsyncThunk(
  'payroll/fetchTimesheetPeriodDetails',
  async (id, { rejectWithValue }) => {
    try {
      const response = await payrollAPI.getTimesheetPeriod(id);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch timesheet period details');
    }
  }
);

// Calculate payroll for a period
export const calculatePayroll = createAsyncThunk(
  'payroll/calculatePayroll',
  async (payrollData, { rejectWithValue }) => {
    try {
      const response = await payrollAPI.calculatePayroll(payrollData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to calculate payroll');
    }
  }
);

// Get all payroll reports
export const fetchPayrollReports = createAsyncThunk(
  'payroll/fetchPayrollReports',
  async (_, { rejectWithValue }) => {
    try {
      const response = await payrollAPI.getPayrollReports();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch payroll reports');
    }
  }
);

// Get payroll report details
export const fetchPayrollReportDetails = createAsyncThunk(
  'payroll/fetchPayrollReportDetails',
  async (id, { rejectWithValue }) => {
    try {
      const response = await payrollAPI.getPayrollReport(id);
      console.log("Payroll report details response:", response.data);
      
      // Just return the data directly - we already have employees in the response
      return response.data.data;
    } catch (error) {
      console.error("Error fetching payroll report details:", error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch payroll report details');
    }
  }
);

// Email paystubs to multiple employees
export const emailPaystubs = createAsyncThunk(
  'payroll/emailPaystubs',
  async (emailData, { rejectWithValue }) => {
    try {
      const response = await payrollAPI.emailPaystubs(emailData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to email paystubs');
    }
  }
);

// Email paystub to a single employee
export const emailSinglePaystub = createAsyncThunk(
  'payroll/emailSinglePaystub',
  async ({ payrollRunId, employeeId }, { rejectWithValue }) => {
    try {
      const response = await payrollAPI.emailSinglePaystub(payrollRunId, employeeId);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to email paystub');
    }
  }
);

// Get payroll settings
export const fetchPayrollSettings = createAsyncThunk(
  'payroll/fetchPayrollSettings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await payrollAPI.getPayrollSettings();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch payroll settings');
    }
  }
);

// Update payroll settings
export const updatePayrollSettings = createAsyncThunk(
  'payroll/updatePayrollSettings',
  async (settingsData, { rejectWithValue }) => {
    try {
      const response = await payrollAPI.updatePayrollSettings(settingsData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update payroll settings');
    }
  }
);

// Initial state
const initialState = {
  timesheetPeriods: [],
  currentTimesheetPeriod: null,
  payrollReports: [],
  currentPayrollReport: null,
  payrollSettings: null,
  loading: false,
  error: null,
  success: false,
  message: '',
  emailStats: null, // To store email sending statistics
  _lastToastId: null, // Internal tracking to prevent duplicate toasts
};

const payrollSlice = createSlice({
  name: 'payroll',
  initialState,
  reducers: {
    resetPayrollState: (state) => {
      state.success = false;
      state.error = null;
      state.message = '';
      // Generate a new toast ID to help with duplicate detection
      state._lastToastId = Date.now().toString();
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Upload Timesheet
    builder.addCase(uploadTimesheet.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(uploadTimesheet.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.message = 'Timesheet uploaded successfully';
    });
    builder.addCase(uploadTimesheet.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Fetch Timesheet Periods
    builder.addCase(fetchTimesheetPeriods.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchTimesheetPeriods.fulfilled, (state, action) => {
      state.loading = false;
      state.timesheetPeriods = action.payload;
    });
    builder.addCase(fetchTimesheetPeriods.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Fetch Timesheet Period Details
    builder.addCase(fetchTimesheetPeriodDetails.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchTimesheetPeriodDetails.fulfilled, (state, action) => {
      state.loading = false;
      state.currentTimesheetPeriod = action.payload;
    });
    builder.addCase(fetchTimesheetPeriodDetails.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Calculate Payroll
    builder.addCase(calculatePayroll.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(calculatePayroll.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.message = 'Payroll calculated successfully';
    });
    builder.addCase(calculatePayroll.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Fetch Payroll Reports
    builder.addCase(fetchPayrollReports.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchPayrollReports.fulfilled, (state, action) => {
      state.loading = false;
      state.payrollReports = action.payload;
    });
    builder.addCase(fetchPayrollReports.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Fetch Payroll Report Details
    builder.addCase(fetchPayrollReportDetails.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchPayrollReportDetails.fulfilled, (state, action) => {
      state.loading = false;
      state.currentPayrollReport = action.payload;
    });
    builder.addCase(fetchPayrollReportDetails.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Email Multiple Paystubs
    builder.addCase(emailPaystubs.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
      state.emailStats = null;
    });
    builder.addCase(emailPaystubs.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.emailStats = action.payload;
      state.message = `Paystubs emailed successfully (${action.payload?.sentCount || 0}/${action.payload?.totalCount || 0})`;
    });
    builder.addCase(emailPaystubs.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    });
    
    // Email Single Paystub
    builder.addCase(emailSinglePaystub.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(emailSinglePaystub.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.message = 'Paystub emailed successfully';
    });
    builder.addCase(emailSinglePaystub.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    });

    // Fetch Payroll Settings
    builder.addCase(fetchPayrollSettings.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchPayrollSettings.fulfilled, (state, action) => {
      state.loading = false;
      state.payrollSettings = action.payload;
    });
    builder.addCase(fetchPayrollSettings.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Update Payroll Settings
    builder.addCase(updatePayrollSettings.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updatePayrollSettings.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.message = 'Payroll settings updated successfully';
      state.payrollSettings = action.payload;
    });
    builder.addCase(updatePayrollSettings.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { resetPayrollState, clearError } = payrollSlice.actions;

export default payrollSlice.reducer;
