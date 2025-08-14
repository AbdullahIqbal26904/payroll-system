import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '@/lib/api';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { 
  setAuthData, 
  setMfaTemporaryData, 
  clearMfaTemporaryData,
  handleLoginResponse,
  handleMfaVerificationResponse
} from '@/lib/auth';
import Cookies from 'js-cookie';

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);
      
      // Check if we have MFA requirements or direct login success
      if (response.data.data.requireMFA) {
        // Store temporary data for MFA verification
        const { tempToken, userId, mfaType } = response.data.data;
        setMfaTemporaryData(tempToken, userId);
        return { requireMFA: true, mfaType };
      } else {
        // Full login successful - manually set the token in cookies
        const { token, ...userData } = response.data.data;
        setAuthData({ token, ...userData });
        return { user: userData, token };
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to login');
    }
  }
);

export const verifyMfa = createAsyncThunk(
  'auth/verifyMfa',
  async ({ token, useBackupCode = false }, { rejectWithValue }) => {
    try {
      const userId = Cookies.get('userId');
      if (!userId) {
        return rejectWithValue('MFA session expired. Please login again.');
      }
      
      const response = await authAPI.verifyMfa(userId, token, useBackupCode);
      
      // Manually set the auth data in cookies
      const { token: authToken, ...userData } = response.data.data;
      setAuthData({ token: authToken, ...userData });
      clearMfaTemporaryData();
      
      return { user: userData, token: authToken };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to verify MFA code');
    }
  }
);

export const verifyEmailMfa = createAsyncThunk(
  'auth/verifyEmailMfa',
  async (code, { rejectWithValue }) => {
    try {
      const userId = Cookies.get('userId');
      if (!userId) {
        return rejectWithValue('MFA session expired. Please login again.');
      }
      
      const response = await authAPI.verifyEmailMfaLogin(userId, code);
      
      // Manually set the auth data in cookies
      const { token, ...userData } = response.data.data;
      setAuthData({ token, ...userData });
      clearMfaTemporaryData();
      
      return { user: userData, token };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to verify email MFA code');
    }
  }
);

export const sendMfaCode = createAsyncThunk(
  'auth/sendMfaCode',
  async (_, { rejectWithValue }) => {
    try {
      const userId = Cookies.get('userId');
      if (!userId) {
        return rejectWithValue('MFA session expired. Please login again.');
      }
      
      const response = await authAPI.sendMfaCode(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send MFA code');
    }
  }
);

export const setupMfa = createAsyncThunk(
  'auth/setupMfa',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.setupMfa();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to setup MFA');
    }
  }
);

export const verifySetupMfa = createAsyncThunk(
  'auth/verifySetupMfa',
  async (params, { rejectWithValue }) => {
    try {
      // Handle both string and object formats for backward compatibility
      const token = typeof params === 'string' ? params : params.code;
      const isBackupCode = typeof params === 'object' ? params.isBackupCode : false;
      
      const response = await authAPI.verifySetupMfa({ token, isBackupCode });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to verify MFA setup');
    }
  }
);

export const setupEmailMfa = createAsyncThunk(
  'auth/setupEmailMfa',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.setupEmailMfa();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to setup email MFA');
    }
  }
);

export const verifyEmailMfaSetup = createAsyncThunk(
  'auth/verifyEmailMfaSetup',
  async (code, { rejectWithValue }) => {
    try {
      const response = await authAPI.verifyEmailMfa(code);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to verify email MFA setup');
    }
  }
);

export const disableMfa = createAsyncThunk(
  'auth/disableMfa',
  async (password, { rejectWithValue }) => {
    try {
      const response = await authAPI.disableMfa(password);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to disable MFA');
    }
  }
);

export const disableEmailMfa = createAsyncThunk(
  'auth/disableEmailMfa',
  async (password, { rejectWithValue }) => {
    try {
      const response = await authAPI.disableEmailMfa(password);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to disable email MFA');
    }
  }
);

export const generateBackupCodes = createAsyncThunk(
  'auth/generateBackupCodes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.generateBackupCodes();
      return response.data.data.backupCodes;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to generate backup codes');
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.getCurrentUser();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get current user');
    }
  }
);

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await authAPI.changePassword(passwordData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to change password');
    }
  }
);

// Helper function to check if token is present and valid
export const checkTokenValidity = () => {
  const token = Cookies.get('token');
  if (!token) return false;
  
  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    
    return decodedToken.exp > currentTime;
  } catch (error) {
    return false;
  }
};

// Initial state
const initialState = {
  user: null,
  token: typeof window !== 'undefined' ? Cookies.get('token') : null,
  isAuthenticated: false,
  loading: false,
  error: null,
  mfa: {
    required: false,
    type: null,
    verifying: false,
    setupData: null,
    backupCodes: [],
    emailSent: false
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      // Clear cookies
      Cookies.remove('token');
      Cookies.remove('user');
      clearMfaTemporaryData();
      
      // Reset state
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.mfa.required = false;
      state.mfa.type = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetMfaState: (state) => {
      state.mfa = {
        required: false,
        type: null,
        verifying: false,
        setupData: null,
        backupCodes: [],
        emailSent: false
      };
    }
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.mfa.required = false;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      
      // Check if MFA is required
      if (action.payload.requireMFA) {
        state.mfa.required = true;
        state.mfa.type = action.payload.mfaType;
        state.isAuthenticated = false;
      } else {
        // Normal login success
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.mfa.required = false;
        state.mfa.type = null;
      }
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    
    // Verify MFA
    builder.addCase(verifyMfa.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.mfa.verifying = true;
    });
    builder.addCase(verifyMfa.fulfilled, (state, action) => {
      state.loading = false;
      state.mfa.verifying = false;
      state.mfa.required = false;
      state.mfa.type = null;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    });
    builder.addCase(verifyMfa.rejected, (state, action) => {
      state.loading = false;
      state.mfa.verifying = false;
      state.error = action.payload;
    });
    
    // Verify Email MFA
    builder.addCase(verifyEmailMfa.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.mfa.verifying = true;
    });
    builder.addCase(verifyEmailMfa.fulfilled, (state, action) => {
      state.loading = false;
      state.mfa.verifying = false;
      state.mfa.required = false;
      state.mfa.type = null;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    });
    builder.addCase(verifyEmailMfa.rejected, (state, action) => {
      state.loading = false;
      state.mfa.verifying = false;
      state.error = action.payload;
    });
    
    // Send MFA Code
    builder.addCase(sendMfaCode.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(sendMfaCode.fulfilled, (state) => {
      state.loading = false;
      state.mfa.emailSent = true;
    });
    builder.addCase(sendMfaCode.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    
    // Setup MFA
    builder.addCase(setupMfa.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(setupMfa.fulfilled, (state, action) => {
      state.loading = false;
      state.mfa.setupData = {
        qrCode: action.payload.qrCode,
        secret: action.payload.secret,
      };
      state.mfa.backupCodes = action.payload.backupCodes;
    });
    builder.addCase(setupMfa.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    
    // Verify Setup MFA
    builder.addCase(verifySetupMfa.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(verifySetupMfa.fulfilled, (state) => {
      state.loading = false;
      if (state.user) {
        state.user.mfaEnabled = true;
        state.user.mfaType = 'app';
      }
      state.mfa.setupData = null;
    });
    builder.addCase(verifySetupMfa.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    
    // Setup Email MFA
    builder.addCase(setupEmailMfa.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(setupEmailMfa.fulfilled, (state) => {
      state.loading = false;
      state.mfa.emailSent = true;
    });
    builder.addCase(setupEmailMfa.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    
    // Verify Email MFA Setup
    builder.addCase(verifyEmailMfaSetup.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(verifyEmailMfaSetup.fulfilled, (state) => {
      state.loading = false;
      if (state.user) {
        state.user.mfaEnabled = true;
        state.user.mfaType = 'email';
      }
      state.mfa.emailSent = false;
    });
    builder.addCase(verifyEmailMfaSetup.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    
    // Disable MFA
    builder.addCase(disableMfa.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(disableMfa.fulfilled, (state) => {
      state.loading = false;
      if (state.user) {
        state.user.mfaEnabled = false;
        state.user.mfaType = null;
      }
    });
    builder.addCase(disableMfa.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    
    // Disable Email MFA
    builder.addCase(disableEmailMfa.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(disableEmailMfa.fulfilled, (state) => {
      state.loading = false;
      if (state.user) {
        state.user.mfaEnabled = false;
        state.user.mfaType = null;
      }
    });
    builder.addCase(disableEmailMfa.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    
    // Generate Backup Codes
    builder.addCase(generateBackupCodes.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(generateBackupCodes.fulfilled, (state, action) => {
      state.loading = false;
      state.mfa.backupCodes = action.payload;
    });
    builder.addCase(generateBackupCodes.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    
    // Get current user
    builder.addCase(getCurrentUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getCurrentUser.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    });
    builder.addCase(getCurrentUser.rejected, (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.error = action.payload;
      state.user = null;
    });
    
    // Change password
    builder.addCase(changePassword.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(changePassword.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(changePassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { logout, clearError, resetMfaState } = authSlice.actions;

export default authSlice.reducer;
