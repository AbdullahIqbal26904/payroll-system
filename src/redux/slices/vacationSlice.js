import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { vacationAPI } from '@/lib/api';

// Async thunks for vacation functionality aligned with new API structure
export const fetchAllVacations = createAsyncThunk(
  'vacation/fetchAllVacations',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await vacationAPI.getVacations(params);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch vacation entries');
    }
  }
);

export const fetchEmployeeVacations = createAsyncThunk(
  'vacation/fetchEmployeeVacations',
  async ({ employeeId, params = {} }, { rejectWithValue }) => {
    try {
      const response = await vacationAPI.getEmployeeVacations(employeeId, params);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch employee vacation entries');
    }
  }
);

export const createVacation = createAsyncThunk(
  'vacation/createVacation',
  async (vacationData, { rejectWithValue }) => {
    try {
      const response = await vacationAPI.createVacation(vacationData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create vacation entry');
    }
  }
);

export const updateVacation = createAsyncThunk(
  'vacation/updateVacation',
  async ({ id, vacationData }, { rejectWithValue }) => {
    try {
      const response = await vacationAPI.updateVacation(id, vacationData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update vacation entry');
    }
  }
);

export const deleteVacation = createAsyncThunk(
  'vacation/deleteVacation',
  async (id, { rejectWithValue }) => {
    try {
      const response = await vacationAPI.deleteVacation(id);
      return { id, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete vacation entry');
    }
  }
);

export const fetchVacationDetails = createAsyncThunk(
  'vacation/fetchVacationDetails',
  async (id, { rejectWithValue }) => {
    try {
      const response = await vacationAPI.getVacationDetails(id);
      return response.data.data.vacation;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch vacation details');
    }
  }
);

export const initializeVacation = createAsyncThunk(
  'vacation/initializeVacation',
  async (initData, { rejectWithValue }) => {
    try {
      const response = await vacationAPI.initializeVacation(initData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to initialize vacation');
    }
  }
);

// Initial state
const initialState = {
  vacations: [],
  vacationDetails: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    limit: 20,
    count: 0,
  },
  filters: {
    employee_id: '',
    status: '',
    start_date: '',
    end_date: '',
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
    setFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload
      };
    },
    resetFilters: (state) => {
      state.filters = {
        employee_id: '',
        status: '',
        start_date: '',
        end_date: '',
      };
    },
    resetVacationState: (state) => {
      state.vacationDetails = null;
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
      // Fetch All Vacations
      .addCase(fetchAllVacations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllVacations.fulfilled, (state, action) => {
        state.loading = false;
        state.vacations = action.payload.vacations;
        state.pagination.count = action.payload.count;
        state.pagination.totalPages = Math.ceil(action.payload.count / state.pagination.limit);
        state.success = true;
      })
      .addCase(fetchAllVacations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Employee Vacations
      .addCase(fetchEmployeeVacations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeVacations.fulfilled, (state, action) => {
        state.loading = false;
        state.vacations = action.payload.vacations;
        state.pagination.count = action.payload.count;
        state.pagination.totalPages = Math.ceil(action.payload.count / state.pagination.limit);
        state.success = true;
      })
      .addCase(fetchEmployeeVacations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create Vacation
      .addCase(createVacation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createVacation.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = 'Vacation entry created successfully';
      })
      .addCase(createVacation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Vacation
      .addCase(updateVacation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateVacation.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = 'Vacation entry updated successfully';
        
        // Update the vacation in the list
        if (state.vacations.length > 0) {
          state.vacations = state.vacations.map(vacation => 
            vacation.id === action.payload.vacation.id ? action.payload.vacation : vacation
          );
        }
        
        // Update vacation details if we're viewing that vacation
        if (state.vacationDetails && state.vacationDetails.id === action.payload.vacation.id) {
          state.vacationDetails = action.payload.vacation;
        }
      })
      .addCase(updateVacation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete Vacation
      .addCase(deleteVacation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteVacation.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = 'Vacation entry deleted successfully';
        
        // Remove the vacation from the list
        state.vacations = state.vacations.filter(vacation => vacation.id !== action.payload.id);
        
        // Clear vacation details if we're viewing the deleted vacation
        if (state.vacationDetails && state.vacationDetails.id === action.payload.id) {
          state.vacationDetails = null;
        }
      })
      .addCase(deleteVacation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Vacation Details
      .addCase(fetchVacationDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVacationDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.vacationDetails = action.payload;
        state.success = true;
      })
      .addCase(fetchVacationDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Initialize Vacation
      .addCase(initializeVacation.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(initializeVacation.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = 'Vacation entitlement initialized successfully';
      })
      .addCase(initializeVacation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { 
  setPage, 
  setLimit, 
  setFilters,
  resetFilters,
  resetVacationState, 
  clearError 
} = vacationSlice.actions;

export default vacationSlice.reducer;
