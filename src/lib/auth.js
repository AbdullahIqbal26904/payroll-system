import Cookies from 'js-cookie';
import { authAPI } from './api';

// Cookie options
const cookieOptions = {
  expires: 7, // 7 days
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict'
};

// Set temporary MFA token and user ID for MFA verification
export const setMfaTemporaryData = (tempToken, userId) => {
  // Short expiration for MFA verification (10 minutes)
  const mfaCookieOptions = { ...cookieOptions, expires: 1/144 }; // 10 minutes in days
  Cookies.set('tempToken', tempToken, mfaCookieOptions);
  Cookies.set('userId', userId, mfaCookieOptions);
};

// Get temporary MFA data
export const getMfaTemporaryData = () => {
  return {
    tempToken: Cookies.get('tempToken'),
    userId: Cookies.get('userId')
  };
};

// Clear temporary MFA data
export const clearMfaTemporaryData = () => {
  Cookies.remove('tempToken');
  Cookies.remove('userId');
};

// Set authentication data after successful login/verification
export const setAuthData = (userData) => {
  Cookies.set('token', userData.token, cookieOptions);
  Cookies.set('user', JSON.stringify({
    id: userData.id,
    name: userData.name,
    email: userData.email,
    role: userData.role,
    mfaEnabled: userData.mfaEnabled,
    mfaType: userData.mfaType || null
  }), cookieOptions);
};

// Get current user data from cookies
export const getCurrentUser = () => {
  const userStr = Cookies.get('user');
  return userStr ? JSON.parse(userStr) : null;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!Cookies.get('token');
};

// Check if user needs to complete MFA verification
export const needsMfaVerification = () => {
  return !!Cookies.get('tempToken') && !!Cookies.get('userId');
};

// Logout user
export const logout = () => {
  Cookies.remove('token');
  Cookies.remove('user');
  clearMfaTemporaryData();
  window.location.href = '/login';
};

// Handle login response - returns true if full login successful, false if MFA needed
export const handleLoginResponse = (response) => {
  const { data } = response;
  
  if (data.requireMFA) {
    // Store temporary data for MFA verification
    setMfaTemporaryData(data.tempToken, data.userId);
    return {
      success: false,
      requireMFA: true,
      mfaType: data.mfaType
    };
  } else {
    // Full login successful
    setAuthData(data);
    return {
      success: true
    };
  }
};

// Handle MFA verification response
export const handleMfaVerificationResponse = (response) => {
  const { data } = response;
  setAuthData(data);
  clearMfaTemporaryData();
  return { success: true };
};
