import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { calculatePayroll, fetchTimesheetPeriods, fetchTimesheetPeriodDetails } from '@/redux/slices/payrollSlice';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { formatDate } from '@/lib/utils';
import { 
  CurrencyDollarIcon, 
  DocumentReportIcon,
  CalendarIcon,
  ClockIcon,
  UserGroupIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

export default function CalculatePayroll() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { periodId } = router.query;
  
  const { 
    timesheetPeriods, 
    currentTimesheetPeriod, 
    loading, 
    error, 
    success, 
    message 
  } = useSelector((state) => state.payroll);
  
  const [selectedPeriodId, setSelectedPeriodId] = useState('');
  const [paymentInfo, setPaymentInfo] = useState({
    payDate: new Date().toISOString().split('T')[0], // Today's date as default
    paymentFrequency: 'Bi-Weekly' // Default payment frequency
  });
  
  // Fetch timesheet periods on component mount
  useEffect(() => {
    dispatch(fetchTimesheetPeriods());
  }, [dispatch]);
  
  // Set selected period from URL if available
  useEffect(() => {
    if (periodId && !selectedPeriodId) {
      setSelectedPeriodId(periodId);
      dispatch(fetchTimesheetPeriodDetails(periodId));
    }
  }, [periodId, dispatch, selectedPeriodId]);
  
  // Show success message and redirect to payroll reports
  useEffect(() => {
    console.log('first')
    if (success && message) {
      toast.success(message);
      router.push('/dashboard/payroll/reports');
    }
    
    if (error) {
      toast.error(error);
    }
  }, [success, error, message, router]);
  
  // Handle timesheet period selection change
  const handlePeriodChange = (e) => {
    const id = e.target.value;
    setSelectedPeriodId(id);
    if (id) {
      dispatch(fetchTimesheetPeriodDetails(id));
    }
  };
  
  // Handle payment info changes
  const handlePaymentInfoChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedPeriodId) {
      toast.error('Please select a timesheet period');
      return;
    }
    
    const payrollData = {
      periodId: selectedPeriodId,
      payDate: paymentInfo.payDate,
      paymentFrequency: paymentInfo.paymentFrequency
    };
    
    dispatch(calculatePayroll(payrollData));
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
      
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Calculate Payroll</h1>
        <p className="mt-2 text-sm text-gray-600">
          Calculate payroll based on timesheet data with Antigua-specific deductions
        </p>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        {/* Select Timesheet Period */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            1. Select Timesheet Period
          </h2>
          
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Timesheet Period
              </label>
              <select
                name="periodId"
                value={selectedPeriodId}
                onChange={handlePeriodChange}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">-- Select a Timesheet Period --</option>
                {timesheetPeriods.filter(period => !period.payrollProcessed).map((period) => (
                  <option key={period.id} value={period.id}>
                    Period #{period.id}: {formatDate(period.startDate)} to {formatDate(period.endDate)}
                  </option>
                ))}
              </select>
              
              {timesheetPeriods.length === 0 && (
                <p className="mt-2 text-sm text-red-600">
                  No timesheet periods available. Please upload a timesheet first.
                </p>
              )}
              
              {timesheetPeriods.filter(period => !period.payrollProcessed).length === 0 && timesheetPeriods.length > 0 && (
                <p className="mt-2 text-sm text-yellow-600">
                  All existing timesheet periods have already been processed.
                </p>
              )}
            </div>
          </div>
        </div>
        
        {/* Timesheet Period Preview */}
        {currentTimesheetPeriod && (
          <div className="mb-8 border-t border-gray-200 pt-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              2. Timesheet Period Preview
            </h2>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-md shadow-sm">
                  <div className="flex items-center">
                    <CalendarIcon className="h-8 w-8 text-blue-500 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Date Range</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {formatDate(currentTimesheetPeriod.startDate)} - {formatDate(currentTimesheetPeriod.endDate)}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-white rounded-md shadow-sm">
                  <div className="flex items-center">
                    <UserGroupIcon className="h-8 w-8 text-green-500 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Employees</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {currentTimesheetPeriod.employeeCount} employees
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-white rounded-md shadow-sm">
                  <div className="flex items-center">
                    <ClockIcon className="h-8 w-8 text-purple-500 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Hours</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {currentTimesheetPeriod.totalHours?.toFixed(2) || '0.00'} hours
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Employee Hours Table */}
            {currentTimesheetPeriod.payrollItems && currentTimesheetPeriod.payrollItems.length > 0 && (
              <div className="overflow-x-auto">
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
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentTimesheetPeriod.payrollItems.map((employee) => (
                      <tr key={employee.employeeId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {employee.employeeName}
                              </div>
                              {/* <div className="text-sm text-gray-500">
                                {employee.email}
                              </div> */}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {employee.employeeId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {employee.hoursWorked?.toFixed(2) || '0.00'} hrs
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {employee.overtimeHours?.toFixed(2) || '0.00'} hrs
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {((employee.hoursWorked || 0) + (employee.overtimeHours || 0)).toFixed(2)} hrs
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        
        {/* Payment Information */}
        {currentTimesheetPeriod && (
          <div className="mb-8 border-t border-gray-200 pt-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              3. Payment Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pay Date
                </label>
                <input
                  type="date"
                  name="payDate"
                  value={paymentInfo.payDate}
                  onChange={handlePaymentInfoChange}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Frequency
                </label>
                <select
                  name="paymentFrequency"
                  value={paymentInfo.paymentFrequency}
                  onChange={handlePaymentInfoChange}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Weekly">Weekly</option>
                  <option value="Bi-Weekly">Bi-Weekly</option>
                  <option value="Semi-Monthly">Semi-Monthly</option>
                  <option value="Monthly">Monthly</option>
                </select>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-md p-4 mt-6">
              <h3 className="text-md font-medium text-blue-800 mb-2">Antigua-Specific Deductions</h3>
              <p className="text-sm text-blue-700 mb-3">
                The payroll system will automatically calculate the following deductions:
              </p>
              <ul className="text-sm text-blue-700 list-disc list-inside space-y-1">
                <li>Social Security (7% employee, 9% employer, max $6,500)</li>
                <li>Medical Benefits (3.5% standard, reduced rates for seniors)</li>
                <li>Education Levy (2.5% or 5% based on salary thresholds)</li>
              </ul>
            </div>
          </div>
        )}
        
        {/* Submit Button */}
        <div className="border-t border-gray-200 pt-6 flex justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!currentTimesheetPeriod || loading}
            className="px-6 py-3 bg-green-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing Payroll...
              </>
            ) : (
              <>
                <CurrencyDollarIcon className="h-5 w-5 mr-2" />
                Calculate Payroll
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// Use the Dashboard layout for this page
CalculatePayroll.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
