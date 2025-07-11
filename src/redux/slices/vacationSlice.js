import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { vacationAPI } from '@/lib/api';

// Async thunks for vacation functionality
export const fetchVacationSummary = createAsyncThunk(
  'vacation/fetchVacationSummary',
  async ({ employeeId, year }, { rejectWithValue }) => {
    try {
      const params = year ? { year } : {};
      const response = await vacationAPI.getVacationSummary(employeeId, params);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch vacation summary');
    }
  }
);

export const initializeVacation = createAsyncThunk(
  'vacation/initializeVacation',
  async (vacationData, { rejectWithValue }) => {
    try {
      const response = await vacationAPI.initializeVacation(vacationData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to initialize vacation entitlement');
    }
  }
);

export const createVacationRequest = createAsyncThunk(
  'vacation/createVacationRequest',
  async (requestData, { rejectWithValue }) => {
    try {
      const response = await vacationAPI.createVacationRequest(requestData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create vacation request');
    }
  }
);

export const fetchEmployeeVacationRequests = createAsyncThunk(
  'vacation/fetchEmployeeVacationRequests',
  async ({ employeeId, params = {} }, { rejectWithValue }) => {
    try {
      const response = await vacationAPI.getEmployeeVacationRequests(employeeId, params);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch employee vacation requests');
    }
  }
);

export const fetchAllVacationRequests = createAsyncThunk(
  'vacation/fetchAllVacationRequests',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await vacationAPI.getAllVacationRequests(params);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch all vacation requests');
    }
  }
);

export const updateVacationRequestStatus = createAsyncThunk(
  'vacation/updateVacationRequestStatus',
  async ({ requestId, statusData }, { rejectWithValue }) => {
    try {
      const response = await vacationAPI.updateVacationRequestStatus(requestId, statusData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update vacation request status');
    }
  }
);

export const fetchVacationRequestDetails = createAsyncThunk(
  'vacation/fetchVacationRequestDetails',
  async (requestId, { rejectWithValue }) => {
    try {
      const response = await vacationAPI.getVacationRequestDetails(requestId);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch vacation request details');
    }
  }
);

// Initial state
const initialState = {
  vacationSummary: null,
  vacationEntitlement: null,
  vacationRequests: [],
  requestDetails: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    limit: 20,
  },
  loading: false,
  error: null,
  success: false,
  message: '',
};

const vacationSlice = createSlice({
  name: 'vacation',
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    setLimit: (state, action) => {
      state.pagination.limit = action.payload;
    },
    resetVacationState: (state) => {
      state.vacationSummary = null;
      state.requestDetails = null;
      state.success = false;
      state.error = null;
      state.message = '';
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Vacation Summary
      .addCase(fetchVacationSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVacationSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.vacationSummary = action.payload;
        state.success = true;
      })
      .addCase(fetchVacationSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Initialize Vacation
      .addCase(initializeVacation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initializeVacation.fulfilled, (state, action) => {
        state.loading = false;
        state.vacationEntitlement = action.payload;
        state.success = true;
        state.message = 'Vacation entitlement initialized successfully';
      })
      .addCase(initializeVacation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create Vacation Request
      .addCase(createVacationRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createVacationRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = 'Vacation request created successfully';
      })
      .addCase(createVacationRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Employee Vacation Requests
      .addCase(fetchEmployeeVacationRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeVacationRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.vacationRequests = action.payload;
        state.success = true;
      })
      .addCase(fetchEmployeeVacationRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch All Vacation Requests
      .addCase(fetchAllVacationRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllVacationRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.vacationRequests = action.payload;
        state.success = true;
      })
      .addCase(fetchAllVacationRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Vacation Request Status
      .addCase(updateVacationRequestStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateVacationRequestStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = 'Vacation request status updated successfully';
        // Update the request in the list
        if (state.vacationRequests.length > 0) {
          state.vacationRequests = state.vacationRequests.map(request => 
            request.id === action.payload.id ? action.payload : request
          );
        }
        // Update request details if we're viewing that request
        if (state.requestDetails && state.requestDetails.id === action.payload.id) {
          state.requestDetails = action.payload;
        }
      })
      .addCase(updateVacationRequestStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Vacation Request Details
      .addCase(fetchVacationRequestDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVacationRequestDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.requestDetails = action.payload;
        state.success = true;
      })
      .addCase(fetchVacationRequestDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setPage, setLimit, resetVacationState, clearError } = vacationSlice.actions;

export default vacationSlice.reducer;
