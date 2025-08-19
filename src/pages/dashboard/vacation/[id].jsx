import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchVacationDetails, 
  updateVacation, 
  deleteVacation,
  resetVacationState 
} from '@/redux/slices/vacationSlice';
import { fetchEmployees } from '@/redux/slices/employeeSlice';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { XCircleIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function VacationDetails() {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch();
  
  const { vacationDetails, loading, error, success, message } = useSelector((state) => state.vacation);
  const { employees } = useSelector((state) => state.employees);
  
  const [formData, setFormData] = useState({
    employee_id: '',
    start_date: '',
    end_date: '',
    total_hours: 0,
    hourly_rate: 0,
    status: ''
  });
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Fetch vacation details and employees on component mount
  useEffect(() => {
    if (id) {
      dispatch(fetchVacationDetails(id));
      dispatch(fetchEmployees());
    }
    
    // Reset vacation state when navigating away
    return () => {
      dispatch(resetVacationState());
    };
  }, [dispatch, id]);
  
  // Update form data when vacation details are loaded
  useEffect(() => {
    if (vacationDetails) {
      setFormData({
        employee_id: vacationDetails.employee_id || '',
        start_date: vacationDetails.start_date ? vacationDetails.start_date.substring(0, 10) : '',
        end_date: vacationDetails.end_date ? vacationDetails.end_date.substring(0, 10) : '',
        total_hours: vacationDetails.total_hours || 0,
        hourly_rate: vacationDetails.hourly_rate || 0,
        status: vacationDetails.status || 'pending'
      });
    }
  }, [vacationDetails]);
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission for updating vacation
  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(updateVacation({ id, vacationData: formData }));
    if (!error) {
      setIsEditing(false);
    }
  };
  
  // Handle delete vacation
  const handleDelete = async () => {
    await dispatch(deleteVacation(id));
    if (!error) {
      // The success message will be shown in the modal
      // After 1.5 seconds, redirect to the vacation list
      setTimeout(() => {
        router.push('/dashboard/vacation');
      }, 1500);
    }
  };
  
  // Get employee name from ID
  const getEmployeeName = (employeeId) => {
    const employee = employees?.find(emp => emp.employee_id === employeeId);
    return employee ? `${employee.first_name} ${employee.last_name}` : 'Unknown Employee';
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Generate status badge
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">Approved</span>;
      case 'pending':
        return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">Pending</span>;
      case 'rejected':
        return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">Rejected</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">Unknown</span>;
    }
  };
  
  // Calculate total amount
  const calculateTotalAmount = () => {
    return (parseFloat(formData.total_hours || 0) * parseFloat(formData.hourly_rate || 0)).toFixed(2);
  };
  
  if (loading && !vacationDetails) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Vacation Details</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => router.push('/dashboard/vacation')}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
          >
            Back to List
          </button>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Edit Vacation
            </button>
          )}
        </div>
      </div>
      
      {/* Success message */}
      {success && message && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{message}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {isEditing ? (
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="employee_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Employee *
                </label>
                <select
                  id="employee_id"
                  name="employee_id"
                  value={formData.employee_id}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  disabled={loading}
                >
                  <option value="">Select Employee</option>
                  {employees?.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.first_name} {employee.last_name} ({employee.id})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status *
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  disabled={loading}
                >
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date *
                </label>
                <input
                  type="date"
                  id="start_date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  disabled={loading}
                />
              </div>
              
              <div>
                <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-1">
                  End Date *
                </label>
                <input
                  type="date"
                  id="end_date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  disabled={loading}
                />
              </div>
              
              <div>
                <label htmlFor="total_hours" className="block text-sm font-medium text-gray-700 mb-1">
                  Total Hours *
                </label>
                <input
                  type="number"
                  id="total_hours"
                  name="total_hours"
                  value={formData.total_hours}
                  onChange={handleChange}
                  required
                  min={0}
                  max={240}
                  step={0.01}
                  className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  disabled={loading}
                />
              </div>
              
              <div>
                <label htmlFor="hourly_rate" className="block text-sm font-medium text-gray-700 mb-1">
                  Hourly Rate
                </label>
                <input
                  type="number"
                  id="hourly_rate"
                  name="hourly_rate"
                  value={formData.hourly_rate}
                  onChange={handleChange}
                  min={0}
                  step={0.01}
                  className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className="flex justify-end mt-6 space-x-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`${
                  loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                } text-white px-4 py-2 rounded transition-colors flex items-center`}
              >
                {loading && (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                Update Vacation
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          {vacationDetails && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Employee</h3>
                    <p className="mt-1 text-lg font-medium text-gray-900">
                      {getEmployeeName(vacationDetails.employee_id)}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Status</h3>
                    <div className="mt-1">
                      {getStatusBadge(vacationDetails.status)}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Start Date</h3>
                    <p className="mt-1 text-lg font-medium text-gray-900">
                      {formatDate(vacationDetails.start_date)}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">End Date</h3>
                    <p className="mt-1 text-lg font-medium text-gray-900">
                      {formatDate(vacationDetails.end_date)}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Total Hours</h3>
                    <p className="mt-1 text-lg font-medium text-gray-900">
                      {vacationDetails.total_hours} hours
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Hourly Rate</h3>
                    <p className="mt-1 text-lg font-medium text-gray-900">
                      ${vacationDetails.hourly_rate ? parseFloat(vacationDetails.hourly_rate).toFixed(2) : '0.00'}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Total Amount</h3>
                    <p className="mt-1 text-lg font-medium text-gray-900">
                      ${(parseFloat(vacationDetails.total_hours || 0) * parseFloat(vacationDetails.hourly_rate || 0)).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Created At</h3>
                    <p className="mt-1 text-lg font-medium text-gray-900">
                      {formatDate(vacationDetails.created_at)}
                    </p>
                  </div>
                </div>
                
                <div className="mt-8 border-t pt-4">
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                  >
                    Delete Vacation Entry
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            {success && message ? (
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <CheckCircleIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                </div>
                <h3 className="mt-3 text-lg font-medium text-gray-900">Success!</h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">{message}</p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-500" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">Delete Vacation Entry</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this vacation entry? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={loading}
                    className={`${
                      loading ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'
                    } text-white px-4 py-2 rounded transition-colors flex items-center`}
                  >
                    {loading && (
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Use the Dashboard layout for this page
VacationDetails.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
