import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import employeeReducer from '../slices/employeeSlice';
import userReducer from '../slices/userSlice';
import payrollReducer from '../slices/payrollSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    employees: employeeReducer,
    users: userReducer,
    payroll: payrollReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
