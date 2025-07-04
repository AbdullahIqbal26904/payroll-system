import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import employeeReducer from '../slices/employeeSlice';
import userReducer from '../slices/userSlice';
import payrollReducer from '../slices/payrollSlice';
import loanReducer from '../slices/loanSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    employees: employeeReducer,
    users: userReducer,
    payroll: payrollReducer,
    loans: loanReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
