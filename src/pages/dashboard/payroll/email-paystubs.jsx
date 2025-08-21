import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { 
  emailPaystubs, 
  emailSinglePaystub,
  fetchPayrollReports, 
  fetchPayrollReportDetails,
  resetPayrollState 
} from '@/redux/slices/payrollSlice';
import Link from 'next/link';
import { ArrowLeftIcon, PaperAirplaneIcon, CheckCircleIcon, XCircleIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function EmailPaystubs() {
  console.log("EmailPaystubs component rendered");
  
  const dispatch = useDispatch();
  const router = useRouter();
  const { payrollRunId } = router.query;
  const { payrollReports, currentPayrollReport, loading, error, success, message, emailStats } = useSelector((state) => state.payroll);
  
  // console.log("Initial state - payrollRunId:", payrollRunId);
  // console.log("Initial state - payrollReports:", payrollReports);
  // console.log("Initial state - currentPayrollReport:", currentPayrollReport);
  
  const [selectedReportId, setSelectedReportId] = useState('');
  const [sendToAll, setSendToAll] = useState(true);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [showSummary, setShowSummary] = useState(false);
  const [emailingEmployeeId, setEmailingEmployeeId] = useState(null);
  
  // Fetch payroll reports on page load
  useEffect(() => {
    dispatch(fetchPayrollReports());
    
    return () => {
      dispatch(resetPayrollState());
    };
  }, [dispatch]);

  // Set selected report from URL if available
  useEffect(() => {
    if (payrollRunId && payrollReports.length > 0) {
      console.log("Setting selected report ID:", payrollRunId);
      setSelectedReportId(payrollRunId);
      dispatch(fetchPayrollReportDetails(payrollRunId));
    }
  }, [payrollRunId, payrollReports, dispatch]);
  
  // Debug log for currentPayrollReport
  useEffect(() => {
    // console.log("Current payroll report:", currentPayrollReport);
    // console.log("Employee count:", currentPayrollReport?.employees?.length || 0);
  }, [currentPayrollReport]);

  // Show notification on success
  useEffect(() => {
    if (success) {
      if (emailingEmployeeId) {
        // Reset the emailingEmployeeId after sending to a single employee
        setEmailingEmployeeId(null);
      } else {
        // Show summary modal for bulk email
        setShowSummary(true);
      }
    }
  }, [success, emailingEmployeeId]);

  // Handle report selection change
  const handleReportChange = (e) => {
    const reportId = e.target.value;
    // console.log("Changing selected report to:", reportId);
    setSelectedReportId(reportId);
    
    if (reportId) {
      dispatch(fetchPayrollReportDetails(reportId));
      setSelectedEmployees([]);
    } else {
      // Reset current report if no report is selected
      // console.log("No report selected, resetting state");
    }
  };

  // Handle send to all toggle
  const handleSendToAllChange = (e) => {
    setSendToAll(e.target.checked);
    if (e.target.checked) {
      setSelectedEmployees([]);
    }
  };

  // Handle employee selection change
  const handleEmployeeChange = (e, employeeId) => {
    if (e.target.checked) {
      setSelectedEmployees([...selectedEmployees, employeeId]);
    } else {
      setSelectedEmployees(selectedEmployees.filter(id => id !== employeeId));
    }
  };

  // Toggle select all employees
  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      // Select all employees who have emails
      const allEmployeeIds = currentPayrollReport?.employees
        ?.filter(emp => emp.email) // Only select employees with email addresses
        ?.map(emp => emp.id) || [];
      // console.log("Selecting all employees with emails:", allEmployeeIds);
      setSelectedEmployees(allEmployeeIds);
    } else {
      // console.log("Deselecting all employees");
      setSelectedEmployees([]);
    }
  };

  // Handle form submission for bulk email
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedReportId) return;
    
    const payload = {
      payrollRunId: selectedReportId,
      sendToAll,
      employeeIds: sendToAll ? [] : selectedEmployees
    };
    
    dispatch(emailPaystubs(payload));
  };

  // Handle sending email to a single employee
  const handleSendSingleEmail = (employeeId, employeeName) => {
    if (window.confirm(`Send paystub email to ${employeeName}?`)) {
      setEmailingEmployeeId(employeeId);
      dispatch(emailSinglePaystub({ payrollRunId: selectedReportId, employeeId }));
    }
  };

  // Close summary modal and reset state
  const handleCloseSummary = () => {
    setShowSummary(false);
    dispatch(resetPayrollState());
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/dashboard/payroll/reports"
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          <ArrowLeftIcon className="mr-1 h-4 w-4" /> Back to Payroll Reports
        </Link>
      </div>
      
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Email Paystubs</h1>
        <p className="mt-2 text-sm text-gray-600">
          Send paystub PDFs to employees via email
        </p>
      </div>
      
      {/* Success notification for single email */}
      {success && emailingEmployeeId === null && !showSummary && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">
                {message || 'Paystub has been emailed successfully!'}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Error notification */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircleIcon className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                Error: {error}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Summary modal for bulk email */}
      {showSummary && emailStats && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="text-center mb-4">
              <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto" />
              <h2 className="text-xl font-bold mt-2">Paystubs Emailed</h2>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Total</span>
                <span>{emailStats.totalCount}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-green-600">Successfully Sent</span>
                <span className="text-green-600">{emailStats.sentCount}</span>
              </div>
              {emailStats.errorCount > 0 && (
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium text-red-600">Failed</span>
                  <span className="text-red-600">{emailStats.errorCount}</span>
                </div>
              )}
            </div>
            
            {emailStats.errors && emailStats.errors.length > 0 && (
              <div className="mb-4">
                <h3 className="font-medium mb-2 text-red-600">Errors:</h3>
                <ul className="text-sm text-red-600 max-h-32 overflow-y-auto">
                  {emailStats.errors.map((err, idx) => (
                    <li key={idx} className="mb-1">
                      • {err}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="flex justify-end">
              <button
                onClick={handleCloseSummary}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Main content */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              1. Select Payroll Report
            </h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payroll Report
              </label>
              <select
                name="reportId"
                value={selectedReportId}
                onChange={handleReportChange}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">-- Select a Payroll Report --</option>
                {payrollReports.map((report) => (
                  <option key={report.id} value={report.id}>
                    Report #{report.id}: {formatDate(report.pay_date)} ({report.item_count} employees)
                  </option>
                ))}
              </select>
              
              {payrollReports.length === 0 && (
                <p className="mt-2 text-sm text-red-600">
                  No payroll reports available. Please process payroll first.
                </p>
              )}
            </div>
          </div>
          
          {currentPayrollReport && (
            <div className="mb-8 border-t border-gray-200 pt-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                2. Email Options
              </h2>
              
              <div className="flex items-center mb-4">
                <input
                  id="sendToAll"
                  name="sendToAll"
                  type="checkbox"
                  checked={sendToAll}
                  onChange={handleSendToAllChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="sendToAll" className="ml-2 block text-sm text-gray-900">
                  Send to all employees ({currentPayrollReport?.items?.length || 0} employees)
                </label>
              </div>
              
              {/* Force showing the employee selection table when not sending to all */}
              {!sendToAll && (
                <div className="mt-4 border border-gray-200 rounded-md">
                  <div className="bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-md font-medium text-gray-700">
                      Select Employees
                    </h3>
                    <div className="flex items-center">
                      <input
                        id="selectAll"
                        type="checkbox"
                        checked={selectedEmployees.length > 0 && 
                          selectedEmployees.length === (currentPayrollReport?.items || [])
                            .filter(emp => emp.email).length}
                        onChange={toggleSelectAll}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="selectAll" className="ml-2 text-sm text-gray-700">
                        Select All
                      </label>
                    </div>
                  </div>
                  
                  <div className="max-h-64 overflow-y-auto p-4">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Select
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Employee
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {(currentPayrollReport?.items || []).map((employee) => (
                          <tr key={employee.employee_id} className={!employee.email ? "bg-red-50" : ""}>
                            <td className="px-4 py-2 whitespace-nowrap">
                              <input
                                id={`employee-${employee.id}`}
                                type="checkbox"
                                disabled={!employee.email}
                                checked={selectedEmployees.includes(employee.employee_id)}
                                onChange={(e) => handleEmployeeChange(e, employee.employee_id)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{employee.employee_name}</div>
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {employee.email || <span className="text-red-500">No email address</span>}
                              </div>
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                type="button"
                                disabled={!employee.email || loading || emailingEmployeeId === employee.employee_id}
                                onClick={() => handleSendSingleEmail(employee.employee_id, employee.name)}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-xs leading-4 font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {emailingEmployeeId === employee.employee_id ? (
                                  <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Sending...
                                  </span>
                                ) : (
                                  <span className="flex items-center">
                                    <EnvelopeIcon className="h-4 w-4 mr-1" />
                                    Email
                                  </span>
                                )}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="bg-gray-50 p-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">
                        {selectedEmployees.length} of {currentPayrollReport?.employees?.length || 0} employees selected
                      </span>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="bg-blue-50 rounded-md p-4 mt-6">
                <h3 className="text-md font-medium text-blue-800 mb-2">Email Information</h3>
                <p className="text-sm text-blue-700">
                  Paystubs will be sent from the system email address to the employees' registered email addresses.
                  Each email will contain the employee's paystub as a PDF attachment.
                </p>
              </div>
            </div>
          )}
          
          <div className="border-t border-gray-200 pt-6 flex justify-end">
            <button
              type="submit"
              disabled={!selectedReportId || ((!sendToAll && selectedEmployees.length === 0) || loading || !(currentPayrollReport?.employees?.length > 0))}
              className="px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading && emailingEmployeeId === null ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending Emails...
                </>
              ) : (
                <>
                  <PaperAirplaneIcon className="h-5 w-5 mr-2" />
                  {sendToAll ? 'Send To All Employees' : 'Send To Selected Employees'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Use the Dashboard layout for this page
EmailPaystubs.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
