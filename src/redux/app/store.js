import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import employeeReducer from '../slices/employeeSlice';
import userReducer from '../slices/userSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    employees: employeeReducer,
    users: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
