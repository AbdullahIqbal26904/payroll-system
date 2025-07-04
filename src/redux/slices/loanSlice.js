import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loansAPI } from '@/lib/api';

// Async thunks
export const fetchLoans = createAsyncThunk(
  'loans/fetchLoans',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await loansAPI.getAllLoans(params);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch loans');
    }
  }
);

export const fetchLoanById = createAsyncThunk(
  'loans/fetchLoanById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await loansAPI.getLoan(id);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch loan');
    }
  }
);

export const createLoan = createAsyncThunk(
  'loans/createLoan',
  async (loanData, { rejectWithValue }) => {
    try {
      const response = await loansAPI.createLoan(loanData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create loan');
    }
  }
);

export const updateLoan = createAsyncThunk(
  'loans/updateLoan',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await loansAPI.updateLoan(id, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update loan');
    }
  }
);

export const fetchEmployeeLoans = createAsyncThunk(
  'loans/fetchEmployeeLoans',
  async ({ employeeId, params = {} }, { rejectWithValue }) => {
    try {
      const response = await loansAPI.getEmployeeLoans(employeeId, params);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch employee loans');
    }
  }
);

// Initial state
const initialState = {
  loans: [],
  loan: null,
  employeeLoans: [],
  totalLoans: 0,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    limit: 10,
  },
  loading: false,
  error: null,
  success: false,
  message: '',
};

const loanSlice = createSlice({
  name: 'loans',
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    setLimit: (state, action) => {
      state.pagination.limit = action.payload;
    },
    resetLoanState: (state) => {
      state.loan = null;
      state.success = false;
      state.error = null;
      state.message = '';
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all loans
    builder.addCase(fetchLoans.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchLoans.fulfilled, (state, action) => {
      state.loading = false;
      state.loans = action.payload.loans;
      state.totalLoans = action.payload.totalCount;
      state.pagination = {
        currentPage: action.payload.page,
        totalPages: action.payload.totalPages,
        limit: action.payload.limit || state.pagination.limit,
      };
    });
    builder.addCase(fetchLoans.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    
    // Fetch loan by id
    builder.addCase(fetchLoanById.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchLoanById.fulfilled, (state, action) => {
      state.loading = false;
      state.loan = action.payload;
    });
    builder.addCase(fetchLoanById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    
    // Create loan
    builder.addCase(createLoan.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createLoan.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.message = 'Loan created successfully';
    });
    builder.addCase(createLoan.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    
    // Update loan
    builder.addCase(updateLoan.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateLoan.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.message = 'Loan updated successfully';
      // Update the loan in the list if it exists
      if (state.loans.length > 0) {
        state.loans = state.loans.map((loan) =>
          loan.id === action.payload.id ? action.payload : loan
        );
      }
      // Update the loan details if it's currently being viewed
      if (state.loan && state.loan.id === action.payload.id) {
        state.loan = action.payload;
      }
    });
    builder.addCase(updateLoan.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    
    // Fetch employee loans
    builder.addCase(fetchEmployeeLoans.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchEmployeeLoans.fulfilled, (state, action) => {
      state.loading = false;
      state.employeeLoans = action.payload.loans;
      state.totalLoans = action.payload.totalCount;
      state.pagination = {
        currentPage: action.payload.page,
        totalPages: action.payload.totalPages,
        limit: action.payload.limit || state.pagination.limit,
      };
    });
    builder.addCase(fetchEmployeeLoans.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { setPage, setLimit, resetLoanState, clearError } = loanSlice.actions;

export default loanSlice.reducer;
