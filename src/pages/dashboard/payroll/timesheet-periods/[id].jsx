import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { fetchTimesheetPeriodDetails } from '@/redux/slices/payrollSlice';
import { formatDate } from '@/lib/utils';
import { 
  ArrowLeftIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  DocumentTextIcon,
  CalculatorIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

export default function TimesheetPeriodDetails() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = router.query;
  const { currentTimesheetPeriod, loading, error } = useSelector((state) => state.payroll);
  
  // Fetch timesheet period details
  useEffect(() => {
    if (id) {
      dispatch(fetchTimesheetPeriodDetails(id));
    }
  }, [dispatch, id]);
  
  // Handle calculate payroll
  const handleCalculatePayroll = () => {
    if (id) {
      router.push(`/dashboard/payroll/calculate?periodId=${id}`);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/dashboard/payroll/timesheet-periods"
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          <ArrowLeftIcon className="mr-1 h-4 w-4" /> Back to Timesheet Periods
        </Link>
      </div>
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Timesheet Period Details
          </h1>
          {currentTimesheetPeriod && (
            <p className="mt-2 text-sm text-gray-600">
              {formatDate(currentTimesheetPeriod.startDate)} - {formatDate(currentTimesheetPeriod.endDate)}
            </p>
          )}
        </div>
        
        {currentTimesheetPeriod && !currentTimesheetPeriod.payrollProcessed && (
          <button
            onClick={handleCalculatePayroll}
            className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <CalculatorIcon className="h-5 w-5 inline-block mr-1" />
            Calculate Payroll
          </button>
        )}
      </div>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      ) : !currentTimesheetPeriod ? (
        <div className="bg-white shadow-md rounded-lg p-8 text-center">
          <p className="text-gray-600">No data available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Period summary card */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Period Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Period ID</span>
                <span className="text-sm font-medium text-gray-900">#{currentTimesheetPeriod.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Start Date</span>
                <span className="text-sm font-medium text-gray-900">{formatDate(currentTimesheetPeriod.startDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">End Date</span>
                <span className="text-sm font-medium text-gray-900">{formatDate(currentTimesheetPeriod.endDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Total Days</span>
                <span className="text-sm font-medium text-gray-900">{currentTimesheetPeriod.totalDays} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Status</span>
                <span className={`text-sm font-medium ${currentTimesheetPeriod.payrollProcessed ? 'text-green-600' : 'text-yellow-600'}`}>
                  {currentTimesheetPeriod.payrollProcessed ? 'Processed' : 'Pending'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Upload Date</span>
                <span className="text-sm font-medium text-gray-900">{formatDate(currentTimesheetPeriod.createdAt)}</span>
              </div>
            </div>
          </div>
          
          {/* Timesheet statistics */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Timesheet Statistics</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Employees</span>
                <span className="text-sm font-medium text-gray-900">{currentTimesheetPeriod.employeeCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Total Hours</span>
                <span className="text-sm font-medium text-gray-900">{currentTimesheetPeriod.totalHours.toFixed(2)} hrs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Regular Hours</span>
                <span className="text-sm font-medium text-gray-900">{currentTimesheetPeriod.regularHours.toFixed(2)} hrs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Overtime Hours</span>
                <span className="text-sm font-medium text-gray-900">{currentTimesheetPeriod.overtimeHours.toFixed(2)} hrs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Missing Punches</span>
                <span className="text-sm font-medium text-gray-900">{currentTimesheetPeriod.missingPunches || 0}</span>
              </div>
            </div>
          </div>
          
          {/* Payroll information */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Payroll Information</h2>
            {currentTimesheetPeriod.payrollProcessed ? (
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Payroll Date</span>
                  <span className="text-sm font-medium text-gray-900">{formatDate(currentTimesheetPeriod.payrollDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Gross Amount</span>
                  <span className="text-sm font-medium text-gray-900">${currentTimesheetPeriod.grossAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Deductions</span>
                  <span className="text-sm font-medium text-gray-900">${currentTimesheetPeriod.deductions.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Net Amount</span>
                  <span className="text-sm font-medium text-gray-900">${currentTimesheetPeriod.netAmount.toFixed(2)}</span>
                </div>
                <div className="pt-4 mt-4 border-t border-gray-100">
                  <Link
                    href={`/dashboard/payroll/reports/${currentTimesheetPeriod.payrollRunId}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                  >
                    <DocumentTextIcon className="mr-1 h-4 w-4" />
                    View Payroll Report
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <CalculatorIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">This timesheet has not been processed for payroll yet.</p>
                <div className="mt-4">
                  <button
                    onClick={handleCalculatePayroll}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Calculate Payroll Now
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Employee Timesheet Details Section */}
      {currentTimesheetPeriod && currentTimesheetPeriod.employees && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Employee Timesheet Details</h2>
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Regular Hours
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Overtime Hours
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Hours
                  </th>
                  {currentTimesheetPeriod.payrollProcessed && (
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentTimesheetPeriod.employees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <UserIcon className="h-6 w-6 text-gray-400" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {employee.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {employee.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{employee.employeeId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{employee.regularHours.toFixed(2)} hrs</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{employee.overtimeHours.toFixed(2)} hrs</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{(employee.regularHours + employee.overtimeHours).toFixed(2)} hrs</div>
                    </td>
                    {currentTimesheetPeriod.payrollProcessed && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={`/dashboard/payroll/paystub/${currentTimesheetPeriod.payrollRunId}/${employee.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <DocumentTextIcon className="h-5 w-5 inline-block mr-1" />
                          View Paystub
                        </Link>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// Use the Dashboard layout for this page
TimesheetPeriodDetails.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
