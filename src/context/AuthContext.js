import { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { authAPI } from '@/lib/api';
import jwt_decode from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Initialize user on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Check if token is expired
          const decodedToken = jwt_decode(token);
          const currentTime = Date.now() / 1000;
          
          if (decodedToken.exp < currentTime) {
            // Token expired, logout user
            logout();
            setLoading(false);
            return;
          }
          
          // Get current user data
          const response = await authAPI.getCurrentUser();
          setUser(response.data.data);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    setError(null);
    try {
      const response = await authAPI.login(credentials);
      const { token, user } = response.data.data;
      
      // Store token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setUser(user);
      return user;
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed. Please check your credentials.');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  const changePassword = async (passwordData) => {
    setError(null);
    try {
      const response = await authAPI.changePassword(passwordData);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to change password.');
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        changePassword,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
