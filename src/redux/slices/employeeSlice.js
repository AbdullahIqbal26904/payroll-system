import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { employeesAPI } from '@/lib/api';

// Async thunks
export const fetchEmployees = createAsyncThunk(
  'employees/fetchEmployees',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await employeesAPI.getAllEmployees(params);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch employees');
    }
  }
);

export const fetchEmployeeById = createAsyncThunk(
  'employees/fetchEmployeeById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await employeesAPI.getEmployee(id);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch employee');
    }
  }
);

export const addEmployee = createAsyncThunk(
  'employees/addEmployee',
  async (employeeData, { rejectWithValue }) => {
    try {
      const response = await employeesAPI.addEmployee(employeeData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add employee');
    }
  }
);

export const updateEmployee = createAsyncThunk(
  'employees/updateEmployee',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await employeesAPI.updateEmployee(id, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update employee');
    }
  }
);

export const deleteEmployee = createAsyncThunk(
  'employees/deleteEmployee',
  async (id, { rejectWithValue }) => {
    try {
      const response = await employeesAPI.deleteEmployee(id);
      return { id, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete employee');
    }
  }
);

// Initial state
const initialState = {
  employees: [],
  employee: null,
  totalEmployees: 0,
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

const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    setLimit: (state, action) => {
      state.pagination.limit = action.payload;
    },
    resetEmployeeState: (state) => {
      state.employee = null;
      state.success = false;
      state.error = null;
      state.message = '';
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all employees
    builder.addCase(fetchEmployees.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchEmployees.fulfilled, (state, action) => {
      state.loading = false;
      state.employees = action.payload.employees;
      state.totalEmployees = action.payload.totalCount;
      state.pagination = {
        currentPage: action.payload.currentPage,
        totalPages: action.payload.totalPages,
        limit: action.payload.limit,
      };
    });
    builder.addCase(fetchEmployees.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    
    // Fetch employee by id
    builder.addCase(fetchEmployeeById.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchEmployeeById.fulfilled, (state, action) => {
      state.loading = false;
      state.employee = action.payload;
    });
    builder.addCase(fetchEmployeeById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    
    // Add employee
    builder.addCase(addEmployee.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addEmployee.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.message = 'Employee added successfully';
    });
    builder.addCase(addEmployee.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    
    // Update employee
    builder.addCase(updateEmployee.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateEmployee.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.message = 'Employee updated successfully';
      // Update the employee in the list if it exists
      if (state.employees.length > 0) {
        state.employees = state.employees.map((emp) =>
          emp.id === action.payload.id ? action.payload : emp
        );
      }
    });
    builder.addCase(updateEmployee.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    
    // Delete employee
    builder.addCase(deleteEmployee.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteEmployee.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.message = action.payload.message;
      // Remove the employee from the list
      state.employees = state.employees.filter(
        (emp) => emp.id !== action.payload.id
      );
      state.totalEmployees -= 1;
    });
    builder.addCase(deleteEmployee.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { setPage, setLimit, resetEmployeeState, clearError } = employeeSlice.actions;

export default employeeSlice.reducer;
