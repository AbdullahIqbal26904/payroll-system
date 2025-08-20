import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Paper,
  Alert
} from '@mui/material';
import { createDepartment, updateDepartment, clearError } from '@/redux/slices/departmentSlice';

const DepartmentForm = ({ department, onClose, isEdit = false }) => {
  const dispatch = useDispatch();
  const { loading, validationErrors, error } = useSelector((state) => state.departments);

  const initialState = {
    name: department?.name || '',
    code: department?.code || '',
    description: department?.description || '',
  };

  const [formData, setFormData] = useState(initialState);
  const [formErrors, setFormErrors] = useState({});

  // When department prop changes, update the form data
  useEffect(() => {
    if (department) {
      setFormData({
        name: department.name || '',
        code: department.code || '',
        description: department.description || '',
      });
    }
  }, [department]);

  // Handle validation errors from backend
  useEffect(() => {
    if (validationErrors) {
      const errors = {};
      validationErrors.forEach((error) => {
        errors[error.param] = error.msg;
      });
      setFormErrors(errors);
    }
  }, [validationErrors]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error when user starts typing in that field
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Department name is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());

    if (!validateForm()) {
      return;
    }

    const resultAction = isEdit
      ? await dispatch(updateDepartment({ id: department.id, data: formData }))
      : await dispatch(createDepartment(formData));

    if (
      (createDepartment.fulfilled.match(resultAction) || updateDepartment.fulfilled.match(resultAction))
    ) {
      onClose();
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Typography variant="h6" gutterBottom>
          {isEdit ? 'Edit Department' : 'Create Department'}
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Department Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!formErrors.name}
              helperText={formErrors.name}
              disabled={loading}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Department Code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              error={!!formErrors.code}
              helperText={formErrors.code}
              disabled={loading}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={4}
              error={!!formErrors.description}
              helperText={formErrors.description}
              disabled={loading}
              margin="normal"
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : isEdit ? 'Update' : 'Create'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default DepartmentForm;
