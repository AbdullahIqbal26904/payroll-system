import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import employeeReducer from '../slices/employeeSlice';
import userReducer from '../slices/userSlice';
import payrollReducer from '../slices/payrollSlice';
import loanReducer from '../slices/loanSlice';
import vacationReducer from '../slices/vacationSlice';
import holidayReducer from '../slices/holidaySlice';
import departmentReducer from '../slices/departmentSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    employees: employeeReducer,
    users: userReducer,
    payroll: payrollReducer,
    loans: loanReducer,
    vacation: vacationReducer,
    holidays: holidayReducer,
    departments: departmentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
