import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress
} from '@mui/material';
import { fetchDepartments } from '@/redux/slices/departmentSlice';

const DepartmentSelect = ({ value, onChange, error, helperText, disabled = false, required = true }) => {
  const dispatch = useDispatch();
  const { departments, loading } = useSelector(state => state.departments);

  // Fetch departments when component mounts
  useEffect(() => {
    if (!departments || departments.length === 0) {
      dispatch(fetchDepartments());
    }
  }, [dispatch, departments]);

  const handleChange = (e) => {
    if (onChange) {
      // Provide both id and name in the onChange handler
      const departmentId = e.target.value;
      const departmentName = departments.find(d => d.id === departmentId)?.name || '';
      onChange(departmentId, departmentName);
    }
  };

  return (
    <FormControl
      fullWidth
      error={!!error}
      disabled={disabled || loading}
      required={required}
      margin="normal"
    >
      <InputLabel id="department-select-label">Department</InputLabel>
      <Select
        labelId="department-select-label"
        id="department-select"
        value={value || ''}
        onChange={handleChange}
        label="Department"
        endAdornment={loading && <CircularProgress color="inherit" size={20} sx={{ mr: 1 }} />}
      >
        <MenuItem value="" disabled>
          Select Department
        </MenuItem>
        {departments.map((department) => (
          <MenuItem key={department.id} value={department.id}>
            {department.name}
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default DepartmentSelect;
