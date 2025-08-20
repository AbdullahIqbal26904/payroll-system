import React from 'react';
import { Box, Typography, TextField, Grid, MenuItem, Button, Alert } from '@mui/material';
import DepartmentSelect from '@/components/departments/DepartmentSelect';

// This is a sample component showing how to integrate department selection
// into employee forms. It should be integrated into your actual employee form components.
const EmployeeFormWithDepartment = ({
  formData,
  handleChange,
  formErrors,
  loading,
  handleSubmit,
  isEdit = false,
  handleCancel,
  error
}) => {
  
  // Example of how to handle department selection in your form
  const handleDepartmentChange = (departmentId, departmentName) => {
    // Update both department_id and department name in the form data
    handleChange({
      target: { name: 'department_id', value: departmentId }
    });
    handleChange({
      target: { name: 'department', value: departmentName }
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Typography variant="h6" gutterBottom>
        {isEdit ? 'Edit Employee' : 'Add New Employee'}
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={2}>
        {/* Basic employee information */}
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Employee ID"
            name="employee_id"
            value={formData.employee_id || ''}
            onChange={handleChange}
            error={!!formErrors?.employee_id}
            helperText={formErrors?.employee_id}
            disabled={loading || isEdit} // Can't change ID in edit mode
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="First Name"
            name="first_name"
            value={formData.first_name || ''}
            onChange={handleChange}
            error={!!formErrors?.first_name}
            helperText={formErrors?.first_name}
            disabled={loading}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Last Name"
            name="last_name"
            value={formData.last_name || ''}
            onChange={handleChange}
            error={!!formErrors?.last_name}
            helperText={formErrors?.last_name}
            disabled={loading}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email || ''}
            onChange={handleChange}
            error={!!formErrors?.email}
            helperText={formErrors?.email}
            disabled={loading}
            margin="normal"
          />
        </Grid>

        {/* Department selection */}
        <Grid item xs={12} sm={6}>
          <DepartmentSelect
            value={formData.department_id || ''}
            onChange={handleDepartmentChange}
            error={!!formErrors?.department_id}
            helperText={formErrors?.department_id}
            disabled={loading}
            required={true}
          />
        </Grid>
        
        {/* Employee type selection */}
        <Grid item xs={12} sm={6}>
          <TextField
            select
            required
            fullWidth
            label="Employee Type"
            name="employee_type"
            value={formData.employee_type || ''}
            onChange={handleChange}
            error={!!formErrors?.employee_type}
            helperText={formErrors?.employee_type}
            disabled={loading}
            margin="normal"
          >
            <MenuItem value="" disabled>Select Type</MenuItem>
            <MenuItem value="salary">Salary</MenuItem>
            <MenuItem value="hourly">Hourly</MenuItem>
            <MenuItem value="private_duty_nurse">Private Duty Nurse</MenuItem>
          </TextField>
        </Grid>

        {/* Salary amount field - shown only if employee type is salary */}
        {formData.employee_type === 'salary' && (
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Salary Amount"
              name="salary_amount"
              type="number"
              value={formData.salary_amount || ''}
              onChange={handleChange}
              error={!!formErrors?.salary_amount}
              helperText={formErrors?.salary_amount}
              disabled={loading}
              margin="normal"
              inputProps={{ min: 0 }}
            />
          </Grid>
        )}

        {/* Hourly rate field - shown only if employee type is hourly or private_duty_nurse */}
        {(formData.employee_type === 'hourly' || formData.employee_type === 'private_duty_nurse') && (
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Hourly Rate"
              name="hourly_rate"
              type="number"
              value={formData.hourly_rate || ''}
              onChange={handleChange}
              error={!!formErrors?.hourly_rate}
              helperText={formErrors?.hourly_rate}
              disabled={loading}
              margin="normal"
              inputProps={{ min: 0, step: 0.01 }}
            />
          </Grid>
        )}

        {/* Payment frequency selection */}
        <Grid item xs={12} sm={6}>
          <TextField
            select
            required
            fullWidth
            label="Payment Frequency"
            name="payment_frequency"
            value={formData.payment_frequency || ''}
            onChange={handleChange}
            error={!!formErrors?.payment_frequency}
            helperText={formErrors?.payment_frequency}
            disabled={loading}
            margin="normal"
          >
            <MenuItem value="" disabled>Select Frequency</MenuItem>
            <MenuItem value="Monthly">Monthly</MenuItem>
            <MenuItem value="Bi-Weekly">Bi-Weekly</MenuItem>
            <MenuItem value="Semi-Monthly">Semi-Monthly</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      {/* Submit and cancel buttons */}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button
          variant="outlined"
          onClick={handleCancel}
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
          {loading ? 'Saving...' : isEdit ? 'Update Employee' : 'Add Employee'}
        </Button>
      </Box>
    </Box>
  );
};

export default EmployeeFormWithDepartment;
