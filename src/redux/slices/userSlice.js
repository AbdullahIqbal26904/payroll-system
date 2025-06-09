import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { usersAPI } from '@/lib/api';

// Async thunks
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await usersAPI.getAllUsers();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

export const fetchUserById = createAsyncThunk(
  'users/fetchUserById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await usersAPI.getUser(id);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user');
    }
  }
);

export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await usersAPI.createUser(userData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create user');
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await usersAPI.updateUser(id, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id, { rejectWithValue }) => {
    try {
      const response = await usersAPI.deleteUser(id);
      return { id, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete user');
    }
  }
);

export const resetUserPassword = createAsyncThunk(
  'users/resetUserPassword',
  async ({ id, passwordData }, { rejectWithValue }) => {
    try {
      const response = await usersAPI.resetPassword(id, passwordData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reset password');
    }
  }
);

// Initial state
const initialState = {
  users: [],
  user: null,
  loading: false,
  error: null,
  success: false,
  message: '',
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    resetUserState: (state) => {
      state.user = null;
      state.success = false;
      state.error = null;
      state.message = '';
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all users
    builder.addCase(fetchUsers.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.loading = false;
      state.users = action.payload;
    });
    builder.addCase(fetchUsers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    
    // Fetch user by id
    builder.addCase(fetchUserById.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchUserById.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    });
    builder.addCase(fetchUserById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    
    // Create user
    builder.addCase(createUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createUser.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.message = 'User created successfully';
      state.users.push(action.payload);
    });
    builder.addCase(createUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    
    // Update user
    builder.addCase(updateUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.message = 'User updated successfully';
      // Update the user in the list if it exists
      if (state.users.length > 0) {
        state.users = state.users.map((user) =>
          user.id === action.payload.id ? action.payload : user
        );
      }
    });
    builder.addCase(updateUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    
    // Delete user
    builder.addCase(deleteUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.message = action.payload.message;
      // Remove the user from the list
      state.users = state.users.filter(
        (user) => user.id !== action.payload.id
      );
    });
    builder.addCase(deleteUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    
    // Reset user password
    builder.addCase(resetUserPassword.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(resetUserPassword.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.message = 'Password reset successfully';
    });
    builder.addCase(resetUserPassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { resetUserState, clearError } = userSlice.actions;

export default userSlice.reducer;
