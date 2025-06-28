import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { fetchTimesheetPeriods, fetchTimesheetPeriodDetails } from '@/redux/slices/payrollSlice';
import { formatDate } from '@/lib/utils';
import { 
  ClockIcon,
  CalendarIcon,
  UserGroupIcon,
  EyeIcon,
  CalculatorIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

export default function TimesheetPeriods() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { timesheetPeriods, loading, error } = useSelector((state) => state.payroll);
  
  // Fetch all timesheet periods on page load
  useEffect(() => {
    dispatch(fetchTimesheetPeriods());
  }, [dispatch]);
  
  // Handle view details
  const handleViewDetails = (id) => {
    router.push(`/dashboard/payroll/timesheet-periods/${id}`);
  };
  
  // Handle calculate payroll
  const handleCalculatePayroll = (id) => {
    router.push(`/dashboard/payroll/calculate?periodId=${id}`);
  };
  const print_timesheet_periods = () => {
    console.log(timesheetPeriods[0]);
    const date = new Date(timesheetPeriods[0].period_end);
    const date2 = new Date(timesheetPeriods[0].period_start);
    console.log(date,date2)
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Timesheet Periods</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage uploaded timesheet periods for payroll processing
          </p>
        </div>
        <div>
          <Link
            href="/dashboard/payroll/upload-timesheet"
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Upload New Timesheet
          </Link>
        </div>
      </div>
      <button onClick={print_timesheet_periods} type="button" className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
        Print tIME SHEET DATA
        </button>

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
      ) : timesheetPeriods.length === 0 ? (
        <div className="bg-white shadow-md rounded-lg p-8 text-center">
          <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No timesheet periods found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Upload a new timesheet to get started with payroll processing
          </p>
          <div className="mt-6">
            <Link
              href="/dashboard/payroll/upload-timesheet"
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Upload Timesheet
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Period
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Range
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employees
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Uploaded On
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {timesheetPeriods.map((period) => (
                <tr key={period.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">Period #{period.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <CalendarIcon className="mr-2 h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-500">
                        {formatDate(period.periodStart || period.period_start)} - {formatDate(period.periodEnd || period.period_end)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <UserGroupIcon className="mr-2 h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-500">{period.employeeCount || period.employee_count} employees</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      period.payrollProcessed || period.payroll_processed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {period.payrollProcessed || period.payroll_processed ? 'Processed' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(period.createdAt || period.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleViewDetails(period.id)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <EyeIcon className="h-5 w-5 inline-block" /> View
                    </button>
                    {!(period.payrollProcessed || period.payroll_processed) && (
                      <button
                        onClick={() => handleCalculatePayroll(period.id)}
                        className="text-green-600 hover:text-green-900"
                      >
                        <CalculatorIcon className="h-5 w-5 inline-block" /> Calculate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Use the Dashboard layout for this page
TimesheetPeriods.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
