import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Divider,
  Button,
  Grid
} from '@mui/material';

const DepartmentDetails = ({ department, onEdit, onClose }) => {
  if (!department) {
    return null;
  }

  return (
    <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        Department Details
      </Typography>
      <Divider sx={{ mb: 2 }} />
      
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Typography variant="subtitle2" color="text.secondary">Name</Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography variant="body1">{department.name}</Typography>
        </Grid>
        
        <Grid item xs={4}>
          <Typography variant="subtitle2" color="text.secondary">Code</Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography variant="body1">{department.code || 'N/A'}</Typography>
        </Grid>
        
        <Grid item xs={4}>
          <Typography variant="subtitle2" color="text.secondary">Description</Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography variant="body1">{department.description || 'N/A'}</Typography>
        </Grid>
        
        <Grid item xs={4}>
          <Typography variant="subtitle2" color="text.secondary">Created At</Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography variant="body1">
            {new Date(department.created_at).toLocaleDateString()}
          </Typography>
        </Grid>
        
        <Grid item xs={4}>
          <Typography variant="subtitle2" color="text.secondary">Last Updated</Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography variant="body1">
            {new Date(department.updated_at).toLocaleDateString()}
          </Typography>
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button
          variant="outlined"
          onClick={onClose}
        >
          Close
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => onEdit(department)}
        >
          Edit
        </Button>
      </Box>
    </Paper>
  );
};

export default DepartmentDetails;
