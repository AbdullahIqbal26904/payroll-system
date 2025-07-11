import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchVacationRequestDetails, 
  updateVacationRequestStatus 
} from '@/redux/slices/vacationSlice';
import { fetchVacationSummary } from '@/redux/slices/vacationSlice';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { 
  CalendarIcon, 
  ClockIcon, 
  UserIcon, 
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function VacationRequestDetails() {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch();
  const { 
    requestDetails, 
    vacationSummary, 
    loading, 
    error, 
    success, 
    message 
  } = useSelector((state) => state.vacation);
  const { user } = useSelector((state) => state.auth);
  
  // Fetch request details
  useEffect(() => {
    if (id) {
      dispatch(fetchVacationRequestDetails(id));
    }
  }, [dispatch, id]);
  
  // Fetch vacation summary when requestDetails is loaded
  useEffect(() => {
    if (requestDetails?.employee_id) {
      dispatch(fetchVacationSummary({ employeeId: requestDetails.employee_id }));
    }
  }, [dispatch, requestDetails?.employee_id]);
  
  // Handle approve/deny request
  const handleStatusChange = async (status) => {
    const action = status === 'approved' ? 'approve' : 'deny';
    const confirmMessage = `Are you sure you want to ${action} this vacation request?`;
    
    if (confirm(confirmMessage)) {
      await dispatch(updateVacationRequestStatus({ 
        requestId: id, 
        statusData: { status } 
      }));
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Format date with time
  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Generate status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return (
          <span className="px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
            Approved
          </span>
        );
      case 'denied':
        return (
          <span className="px-3 py-1 text-sm font-semibold rounded-full bg-red-100 text-red-800">
            Denied
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 text-sm font-semibold rounded-full bg-yellow-100 text-yellow-800">
            Pending
          </span>
        );
    }
  };
  
  if (loading && !requestDetails) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }
  
  if (error && !requestDetails) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={() => router.push('/dashboard/vacation')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Back to Vacation Dashboard
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Vacation Request Details</h1>
        <button
          onClick={() => router.push('/dashboard/vacation')}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
        >
          Back to List
        </button>
      </div>
      
      {/* Success message */}
      {success && (
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
      
      {requestDetails && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Request Details */}
          <div className="col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="border-b border-gray-200 bg-gray-50 px-4 py-4 sm:px-6 flex justify-between items-center">
                <div className="flex items-center">
                  <h2 className="text-lg font-medium text-gray-900">Request #{requestDetails.id}</h2>
                  <div className="ml-4">
                    {getStatusBadge(requestDetails.status)}
                  </div>
                </div>
                {requestDetails.status === 'pending' && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleStatusChange('approved')}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm flex items-center"
                    >
                      <CheckCircleIcon className="h-4 w-4 mr-1" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusChange('denied')}
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors text-sm flex items-center"
                    >
                      <XCircleIcon className="h-4 w-4 mr-1" />
                      Deny
                    </button>
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center mb-2">
                        <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <h3 className="text-sm font-medium text-gray-500">Employee Information</h3>
                      </div>
                      <div className="text-gray-900">
                        <p className="font-medium">{requestDetails.first_name} {requestDetails.last_name}</p>
                        <p className="text-sm text-gray-500">ID: {requestDetails.employee_id}</p>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center mb-2">
                        <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <h3 className="text-sm font-medium text-gray-500">Vacation Period</h3>
                      </div>
                      <div className="text-gray-900">
                        <p>From: <span className="font-medium">{formatDate(requestDetails.start_date)}</span></p>
                        <p>To: <span className="font-medium">{formatDate(requestDetails.end_date)}</span></p>
                        <p className="mt-1 text-sm text-gray-500">
                          {Math.ceil((new Date(requestDetails.end_date) - new Date(requestDetails.start_date)) / (1000 * 60 * 60 * 24) + 1)} days total
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center mb-2">
                        <ClockIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <h3 className="text-sm font-medium text-gray-500">Hours Requested</h3>
                      </div>
                      <p className="text-xl font-bold text-gray-900">{requestDetails.total_hours} hours</p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center mb-2">
                        <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <h3 className="text-sm font-medium text-gray-500">Notes</h3>
                      </div>
                      <p className="text-gray-900">{requestDetails.notes || 'No notes provided.'}</p>
                    </div>
                    
                    <div>
                      <div className="flex items-center mb-2">
                        <ClockIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <h3 className="text-sm font-medium text-gray-500">Request Information</h3>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>Requested on: {formatDateTime(requestDetails.request_date)}</p>
                        {requestDetails.approved_date && (
                          <p>
                            {requestDetails.status === 'approved' ? 'Approved' : 'Denied'} on: {formatDateTime(requestDetails.approved_date)}
                          </p>
                        )}
                        {requestDetails.approved_by_name && (
                          <p>
                            {requestDetails.status === 'approved' ? 'Approved' : 'Denied'} by: {requestDetails.approved_by_name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Employee Vacation Summary */}
          <div className="col-span-1">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="bg-gray-50 px-4 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Vacation Summary</h2>
              </div>
              <div className="p-6">
                {loading && !vacationSummary ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : vacationSummary ? (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Annual Allowance</h3>
                      <p className="text-xl font-bold text-gray-900">{vacationSummary.entitlement.annual_pto_hours} hours</p>
                      <p className="text-xs text-gray-500">Accrual rate: {vacationSummary.entitlement.accrual_rate_per_hour.toFixed(6)} hours per hour worked</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Current Year</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Earned</p>
                          <p className="text-lg font-medium text-gray-900">{vacationSummary.entitlement.total_earned_current_year} hours</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Used</p>
                          <p className="text-lg font-medium text-gray-900">{vacationSummary.entitlement.total_used_current_year} hours</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-500">Current Balance</h3>
                        <p className="text-lg font-bold text-gray-900">{vacationSummary.entitlement.current_balance} hours</p>
                      </div>
                      <div className="flex justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-500">Pending Requests</h3>
                        <p className="text-lg font-medium text-orange-500">-{vacationSummary.pendingHours} hours</p>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-200">
                        <h3 className="text-sm font-bold text-gray-700">Available Balance</h3>
                        <p className="text-lg font-bold text-blue-600">{vacationSummary.availableBalance} hours</p>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <Link href={`/dashboard/vacation/employee/${requestDetails.employee_id}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        View Employee Vacation History →
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="py-4 text-center">
                    <p className="text-gray-500">No vacation entitlement found for this employee.</p>
                    <Link href="/dashboard/vacation/initialize" className="text-blue-600 hover:underline text-sm">
                      Initialize Vacation Entitlement
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Use the Dashboard layout for this page
VacationRequestDetails.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
