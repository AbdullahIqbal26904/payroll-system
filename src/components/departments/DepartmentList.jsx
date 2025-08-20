import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import { deleteDepartment } from '@/redux/slices/departmentSlice';

const DepartmentList = ({ departments, onEdit, onView }) => {
  const dispatch = useDispatch();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);
  const [error, setError] = useState(null);
  const [employeeCount, setEmployeeCount] = useState(null);

  const handleDeleteClick = (department) => {
    setDepartmentToDelete(department);
    setDeleteDialogOpen(true);
    setError(null);
    setEmployeeCount(null);
  };

  const handleDeleteConfirm = async () => {
    if (departmentToDelete) {
      try {
        const resultAction = await dispatch(deleteDepartment(departmentToDelete.id));
        
        if (deleteDepartment.fulfilled.match(resultAction)) {
          setDeleteDialogOpen(false);
          setDepartmentToDelete(null);
        } else if (resultAction.payload?.employeeCount) {
          setError(resultAction.payload.message);
          setEmployeeCount(resultAction.payload.employeeCount);
        } else {
          setError(resultAction.payload || 'Failed to delete department');
        }
      } catch (error) {
        setError('An unexpected error occurred');
      }
    }
  };

  const handleCloseDialog = () => {
    setDeleteDialogOpen(false);
    setDepartmentToDelete(null);
    setError(null);
    setEmployeeCount(null);
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ mt: 3, mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {departments.length > 0 ? (
              departments.map((department) => (
                <TableRow key={department.id}>
                  <TableCell>{department.name}</TableCell>
                  <TableCell>{department.code || 'N/A'}</TableCell>
                  <TableCell>{department.description || 'N/A'}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="View Details">
                      <IconButton 
                        color="primary" 
                        onClick={() => onView(department)}
                      >
                        <InfoIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton 
                        color="primary" 
                        onClick={() => onEdit(department)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton 
                        color="error" 
                        onClick={() => handleDeleteClick(department)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography variant="body1">No departments found</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDialog}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
              {employeeCount && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  This department has {employeeCount} employee(s) assigned to it.
                </Typography>
              )}
            </Alert>
          )}
          <DialogContentText>
            Are you sure you want to delete the department "{departmentToDelete?.name}"? 
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DepartmentList;
