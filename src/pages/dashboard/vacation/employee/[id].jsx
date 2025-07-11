import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchVacationSummary, 
  fetchEmployeeVacationRequests,
  setPage,
  setLimit
} from '@/redux/slices/vacationSlice';
import { fetchEmployeeById } from '@/redux/slices/employeeSlice';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import Link from 'next/link';
import {
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserCircleIcon,
  DocumentIcon
} from '@heroicons/react/24/outline';

export default function EmployeeVacation() {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch();
  
  const { 
    vacationSummary, 
    vacationRequests, 
    pagination, 
    loading, 
    error 
  } = useSelector((state) => state.vacation);
  
  const { 
    employee 
  } = useSelector((state) => state.employees);
  
  const [filters, setFilters] = useState({
    status: ''
  });
  
  // Fetch employee data and vacation summary
  useEffect(() => {
    if (id) {
      dispatch(fetchEmployeeById(id));
      dispatch(fetchVacationSummary({ employeeId: id }));
    }
  }, [dispatch, id]);
  
  // Fetch employee vacation requests
  useEffect(() => {
    if (id) {
      const params = {
        page: pagination.currentPage,
        limit: pagination.limit,
        ...filters
      };
      
      dispatch(fetchEmployeeVacationRequests({ employeeId: id, params }));
    }
  }, [dispatch, id, pagination.currentPage, pagination.limit, filters]);
  
  // Handle status filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    dispatch(setPage(1)); // Reset to first page when filter changes
  };
  
  // Handle page change
  const handlePageChange = (page) => {
    dispatch(setPage(page));
  };
  
  // Handle rows per page change
  const handleLimitChange = (e) => {
    dispatch(setLimit(parseInt(e.target.value)));
    dispatch(setPage(1)); // Reset to first page
  };
  
  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Generate status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
            Approved
          </span>
        );
      case 'denied':
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
            Denied
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
            Pending
          </span>
        );
    }
  };
  
  // Generate page numbers for pagination
  const pageNumbers = [];
  for (let i = 1; i <= pagination.totalPages; i++) {
    pageNumbers.push(i);
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {employee ? `${employee.first_name} ${employee.last_name}'s Vacation` : 'Employee Vacation'}
          </h1>
          {employee && (
            <p className="text-gray-500">Employee ID: {employee.employee_id}</p>
          )}
        </div>
        <div className="flex space-x-2">
          <Link href="/dashboard/vacation" 
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors">
            Back to List
          </Link>
          <Link href={`/dashboard/vacation/request?employeeId=${id}`} 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
            New Request
          </Link>
        </div>
      </div>
      
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
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Employee and Vacation Summary Card */}
        <div className="col-span-1 lg:col-span-1">
          <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
            <div className="bg-gray-50 px-4 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Employee Information</h2>
            </div>
            {employee ? (
              <div className="p-4">
                <div className="flex flex-col items-center pb-4">
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-3">
                    <UserCircleIcon className="w-16 h-16 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900">
                    {employee.first_name} {employee.last_name}
                  </h3>
                  <p className="text-sm text-gray-500">{employee.job_title}</p>
                  <p className="text-sm text-gray-500">{employee.department}</p>
                </div>
              </div>
            ) : loading ? (
              <div className="p-4 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                Employee information not available
              </div>
            )}
          </div>
          
          {/* Vacation Summary Card */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="bg-gray-50 px-4 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Vacation Summary</h2>
            </div>
            {loading && !vacationSummary ? (
              <div className="p-4 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : vacationSummary ? (
              <div className="p-4 space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Annual Allowance</h3>
                  <p className="text-xl font-bold text-gray-900">{vacationSummary.entitlement.annual_pto_hours} hours</p>
                  <p className="text-xs text-gray-500">Accrual rate: {vacationSummary.entitlement.accrual_rate_per_hour.toFixed(6)} hours per hour worked</p>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
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
                
                <div className="pt-4 border-t border-gray-200">
                  <Link 
                    href={`/dashboard/vacation/initialize?employeeId=${id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Update Vacation Entitlement
                  </Link>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center">
                <DocumentIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No Vacation Entitlement</h3>
                <p className="text-sm text-gray-500 mb-4">This employee doesn't have vacation entitlement initialized yet.</p>
                <Link 
                  href={`/dashboard/vacation/initialize?employeeId=${id}`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Initialize Vacation
                </Link>
              </div>
            )}
          </div>
        </div>
        
        {/* Vacation Requests Table */}
        <div className="col-span-1 lg:col-span-3">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-lg font-medium text-gray-900">Vacation Requests</h2>
                <div className="flex gap-2">
                  <div className="flex items-center">
                    <label htmlFor="status" className="mr-2 text-sm text-gray-600">Status:</label>
                    <select
                      id="status"
                      name="status"
                      value={filters.status}
                      onChange={handleFilterChange}
                      className="border rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="denied">Denied</option>
                    </select>
                  </div>
                  <div className="flex items-center">
                    <label htmlFor="limit" className="mr-2 text-sm text-gray-600">Show:</label>
                    <select
                      id="limit"
                      name="limit"
                      value={pagination.limit}
                      onChange={handleLimitChange}
                      className="border rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="20">20</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date Range
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hours
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Request Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                        </div>
                      </td>
                    </tr>
                  ) : vacationRequests?.length > 0 ? (
                    vacationRequests.map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatDate(request.start_date)} - {formatDate(request.end_date)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {Math.ceil((new Date(request.end_date) - new Date(request.start_date)) / (1000 * 60 * 60 * 24) + 1)} days
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {request.total_hours}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(request.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(request.request_date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link 
                            href={`/dashboard/vacation/requests/${request.id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View Details
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                        No vacation requests found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing page <span className="font-medium">{pagination.currentPage}</span> of{" "}
                      <span className="font-medium">{pagination.totalPages}</span>
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={pagination.currentPage === 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                          pagination.currentPage === 1 
                            ? 'text-gray-300 cursor-not-allowed' 
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        Previous
                      </button>
                      {pageNumbers.map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${
                            page === pagination.currentPage
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={pagination.currentPage === pagination.totalPages}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                          pagination.currentPage === pagination.totalPages 
                            ? 'text-gray-300 cursor-not-allowed' 
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Use the Dashboard layout for this page
EmployeeVacation.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
