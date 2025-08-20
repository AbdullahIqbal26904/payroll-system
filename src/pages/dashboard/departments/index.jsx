import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Dialog,
  DialogContent,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import DepartmentList from '@/components/departments/DepartmentList';
import DepartmentForm from '@/components/departments/DepartmentForm';
import DepartmentDetails from '@/components/departments/DepartmentDetails';
import { fetchDepartments, resetDepartmentState } from '@/redux/slices/departmentSlice';
import { useRouter } from 'next/router';

const DepartmentsPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { departments, loading, error, success, message } = useSelector((state) => state.departments);
  
  // Local state
  const [formOpen, setFormOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Load departments on component mount
  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  // Show success message when operation completes
  useEffect(() => {
    if (success && message) {
      setSnackbarOpen(true);
      // Reset the state after showing the message
      setTimeout(() => {
        dispatch(resetDepartmentState());
      }, 100);
    }
  }, [success, message, dispatch]);

  // Handle creating a new department
  const handleCreateDepartment = () => {
    setSelectedDepartment(null);
    setIsEdit(false);
    setFormOpen(true);
    setDetailsOpen(false);
  };

  // Handle editing a department
  const handleEditDepartment = (department) => {
    setSelectedDepartment(department);
    setIsEdit(true);
    setFormOpen(true);
    setDetailsOpen(false);
  };

  // Handle viewing department details
  const handleViewDepartment = (department) => {
    setSelectedDepartment(department);
    setDetailsOpen(true);
    setFormOpen(false);
  };

  // Handle form close
  const handleFormClose = () => {
    setFormOpen(false);
    // Refresh the departments list if there was a successful operation
    if (success) {
      dispatch(fetchDepartments());
    }
  };

  // Handle details close
  const handleDetailsClose = () => {
    setDetailsOpen(false);
  };

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <DashboardLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h5" component="h1" gutterBottom>
            Departments
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreateDepartment}
          >
            Add Department
          </Button>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {loading && !departments.length ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <DepartmentList
            departments={departments}
            onEdit={handleEditDepartment}
            onView={handleViewDepartment}
          />
        )}

        {/* Form Dialog */}
        <Dialog
          open={formOpen}
          onClose={handleFormClose}
          maxWidth="md"
          fullWidth
        >
          <DialogContent sx={{ py: 2 }}>
            <DepartmentForm
              department={selectedDepartment}
              onClose={handleFormClose}
              isEdit={isEdit}
            />
          </DialogContent>
        </Dialog>

        {/* Details Dialog */}
        <Dialog
          open={detailsOpen}
          onClose={handleDetailsClose}
          maxWidth="md"
          fullWidth
        >
          <DialogContent sx={{ py: 2 }}>
            <DepartmentDetails
              department={selectedDepartment}
              onEdit={handleEditDepartment}
              onClose={handleDetailsClose}
            />
          </DialogContent>
        </Dialog>

        {/* Success Snackbar */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity="success"
            sx={{ width: '100%' }}
          >
            {message}
          </Alert>
        </Snackbar>
      </Container>
    </DashboardLayout>
  );
};

export default DepartmentsPage;
