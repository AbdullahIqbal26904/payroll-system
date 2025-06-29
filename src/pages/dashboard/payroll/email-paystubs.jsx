import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { emailPaystubs, fetchPayrollReports, resetPayrollState } from '@/redux/slices/payrollSlice';
import Link from 'next/link';
import { ArrowLeftIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function EmailPaystubs() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { payrollRunId } = router.query;
  const { payrollReports, loading, error, success, message } = useSelector((state) => state.payroll);
  
  const [selectedReportId, setSelectedReportId] = useState('');
  const [sendToAll, setSendToAll] = useState(true);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [currentReport, setCurrentReport] = useState(null);
  
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
      setSelectedReportId(payrollRunId);
      const report = payrollReports.find(r => r.id.toString() === payrollRunId.toString());
      if (report) {
        setCurrentReport(report);
      }
    }
  }, [payrollRunId, payrollReports]);

  // Show notification on success or error
  useEffect(() => {
    if (success) {
      // You can add a toast notification here if you have one set up
      setTimeout(() => {
        dispatch(resetPayrollState());
        router.push('/dashboard/payroll/reports');
      }, 2000);
    }
  }, [success, dispatch, router]);

  // Handle report selection change
  const handleReportChange = (e) => {
    const reportId = e.target.value;
    setSelectedReportId(reportId);
    
    if (reportId) {
      const report = payrollReports.find(r => r.id.toString() === reportId.toString());
      setCurrentReport(report);
      setSelectedEmployees([]);
    } else {
      setCurrentReport(null);
      setSelectedEmployees([]);
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

  // Handle form submission
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
      
      {success && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">
                {message || 'Paystubs have been emailed successfully!'}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                Error: {error}
              </p>
            </div>
          </div>
        </div>
      )}
      
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
          
          {currentReport && (
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
                  Send to all employees ({currentReport.employeeCount} employees)
                </label>
              </div>
              
              {!sendToAll && currentReport.employees && currentReport.employees.length > 0 && (
                <div className="mt-4 border border-gray-200 rounded-md max-h-64 overflow-y-auto">
                  <div className="p-4">
                    <h3 className="text-md font-medium text-gray-700 mb-2">
                      Select Employees
                    </h3>
                    <div className="space-y-2">
                      {currentReport.employees.map((employee) => (
                        <div key={employee.id} className="flex items-center">
                          <input
                            id={`employee-${employee.id}`}
                            name={`employee-${employee.id}`}
                            type="checkbox"
                            checked={selectedEmployees.includes(employee.id)}
                            onChange={(e) => handleEmployeeChange(e, employee.id)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`employee-${employee.id}`} className="ml-2 block text-sm text-gray-900">
                            {employee.name} ({employee.email || 'No email'})
                          </label>
                        </div>
                      ))}
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
              disabled={!selectedReportId || (!sendToAll && selectedEmployees.length === 0) || loading}
              className="px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
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
                  Send Paystubs
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
