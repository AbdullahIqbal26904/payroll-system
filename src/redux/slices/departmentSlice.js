import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { departmentsAPI } from '@/lib/api';

// Async thunks
export const fetchDepartments = createAsyncThunk(
  'departments/fetchDepartments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await departmentsAPI.getAllDepartments();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch departments');
    }
  }
);

export const fetchDepartmentById = createAsyncThunk(
  'departments/fetchDepartmentById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await departmentsAPI.getDepartment(id);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch department');
    }
  }
);

export const createDepartment = createAsyncThunk(
  'departments/createDepartment',
  async (departmentData, { rejectWithValue }) => {
    try {
      const response = await departmentsAPI.createDepartment(departmentData);
      return response.data;
    } catch (error) {
      // Handle validation errors
      if (error.response?.data?.errors) {
        return rejectWithValue({ validationErrors: error.response.data.errors });
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to create department');
    }
  }
);

export const updateDepartment = createAsyncThunk(
  'departments/updateDepartment',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await departmentsAPI.updateDepartment(id, data);
      return response.data;
    } catch (error) {
      // Handle validation errors
      if (error.response?.data?.errors) {
        return rejectWithValue({ validationErrors: error.response.data.errors });
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to update department');
    }
  }
);

export const deleteDepartment = createAsyncThunk(
  'departments/deleteDepartment',
  async (id, { rejectWithValue }) => {
    try {
      const response = await departmentsAPI.deleteDepartment(id);
      return { id, message: response.data.message };
    } catch (error) {
      // Special handling for departments with employees
      if (error.response?.status === 400 && error.response?.data?.employeeCount) {
        return rejectWithValue({
          message: error.response.data.message,
          employeeCount: error.response.data.employeeCount
        });
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to delete department');
    }
  }
);

// Initial state
const initialState = {
  departments: [],
  department: null,
  loading: false,
  error: null,
  validationErrors: null,
  success: false,
  message: '',
  employeeCount: null
};

const departmentSlice = createSlice({
  name: 'departments',
  initialState,
  reducers: {
    resetDepartmentState: (state) => {
      state.department = null;
      state.success = false;
      state.error = null;
      state.validationErrors = null;
      state.message = '';
      state.employeeCount = null;
    },
    clearError: (state) => {
      state.error = null;
      state.validationErrors = null;
      state.employeeCount = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all departments
    builder.addCase(fetchDepartments.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchDepartments.fulfilled, (state, action) => {
      state.loading = false;
      state.departments = action.payload;
    });
    builder.addCase(fetchDepartments.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    
    // Fetch department by id
    builder.addCase(fetchDepartmentById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchDepartmentById.fulfilled, (state, action) => {
      state.loading = false;
      state.department = action.payload;
    });
    builder.addCase(fetchDepartmentById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    
    // Create department
    builder.addCase(createDepartment.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.validationErrors = null;
    });
    builder.addCase(createDepartment.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.message = action.payload.message || 'Department created successfully';
      if (state.departments.length > 0) {
        state.departments.push(action.payload.data);
      }
    });
    builder.addCase(createDepartment.rejected, (state, action) => {
      state.loading = false;
      if (action.payload?.validationErrors) {
        state.validationErrors = action.payload.validationErrors;
      } else {
        state.error = action.payload;
      }
    });
    
    // Update department
    builder.addCase(updateDepartment.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.validationErrors = null;
    });
    builder.addCase(updateDepartment.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.message = action.payload.message || 'Department updated successfully';
      // Update the department in the list if it exists
      if (state.departments.length > 0) {
        state.departments = state.departments.map((dept) =>
          dept.id === action.payload.data.id ? action.payload.data : dept
        );
      }
    });
    builder.addCase(updateDepartment.rejected, (state, action) => {
      state.loading = false;
      if (action.payload?.validationErrors) {
        state.validationErrors = action.payload.validationErrors;
      } else {
        state.error = action.payload;
      }
    });
    
    // Delete department
    builder.addCase(deleteDepartment.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteDepartment.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.message = action.payload.message;
      // Remove the department from the list
      state.departments = state.departments.filter(
        (dept) => dept.id !== action.payload.id
      );
    });
    builder.addCase(deleteDepartment.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || action.payload;
      if (action.payload?.employeeCount) {
        state.employeeCount = action.payload.employeeCount;
      }
    });
  },
});

export const { resetDepartmentState, clearError } = departmentSlice.actions;

export default departmentSlice.reducer;
