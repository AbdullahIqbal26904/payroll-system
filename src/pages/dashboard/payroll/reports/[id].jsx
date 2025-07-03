// filepath: /Users/abdullahiqbal/Downloads/Payroll-Application/payroll-frontend/src/pages/dashboard/payroll/reports/[id].jsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPayrollReportDetails } from '@/redux/slices/payrollSlice';
import Link from 'next/link';
import { ArrowLeftIcon, DocumentArrowDownIcon, EnvelopeIcon, DocumentTextIcon, EyeIcon } from '@heroicons/react/24/outline';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { downloadPaystub, openPdfInNewTab } from '@/lib/PaystubDownloader';
import { payrollAPI } from '@/lib/api';
export default function PayrollReportDetails() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = router.query;
  const { currentPayrollReport, loading, error } = useSelector((state) => state.payroll);
  const [showYtdData, setShowYtdData] = useState(false);
  
  // Fetch payroll report details
  useEffect(() => {
    if (id) {
      dispatch(fetchPayrollReportDetails(id));
    }
  }, [dispatch, id]);

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

  // Format currency function
  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return 'EC$0.00';
    // Make sure to convert to number before formatting to avoid NaN
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'XCD'
    }).format(numericAmount || 0); // Use 0 as fallback if parsing results in NaN
  };

  // Get paystub PDF from API
  const fetchPaystubPdf = async (employeeId) => {
    if (id) {
      try {
        // Use the API function from api.js which already handles authentication
        // The api.js already contains the interceptor to add the token
        const response = await payrollAPI.downloadPaystub(id, employeeId);
        
        // payrollAPI.downloadPaystub already returns a blob due to { responseType: 'blob' }
        return response.data;
      } catch (error) {
        console.error('Error fetching paystub:', error);
        alert('Failed to fetch paystub. Please try again.');
        return null;
      }
    }
    return null;
  };

  // Handle download paystub
  const handleDownloadPaystub = async (employeeId) => {
    const blob = await fetchPaystubPdf(employeeId);
    if (blob) {
      const filename = `paystub-${employeeId}.pdf`;
      downloadPaystub(blob, filename);
    }
  };
  
  // Handle view paystub
  const handleViewPaystub = async (employeeId) => {
    if (id) {
      try {
        // Use the enhanced view paystub API
        const response = await payrollAPI.viewPaystub(id, employeeId);
        
        // Open the PDF in a new tab
        openPdfInNewTab(response.data);
      } catch (error) {
        console.error('Error viewing paystub:', error);
        alert('Failed to view paystub. Please try again.');
      }
    }
  };

  // Handle email paystubs
  const handleEmailPaystubs = () => {
    router.push({
      pathname: `/dashboard/payroll/email-paystubs`,
      query: { payrollRunId: id },
    });
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
      
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
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
      ) : !currentPayrollReport ? (
        <div className="bg-white shadow rounded-lg p-10 text-center">
          <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Report not found</h3>
          <p className="mt-1 text-sm text-gray-500">
            The payroll report you are looking for does not exist or has been removed.
          </p>
          <div className="mt-6">
            <Link
              href="/dashboard/payroll/reports"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Go back to reports
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Payroll Report #{currentPayrollReport.id}
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Pay Date: {formatDate(currentPayrollReport.payDate || currentPayrollReport.pay_date)} | Period: {formatDate(currentPayrollReport.periodStartDate || currentPayrollReport.period_start)} - {formatDate(currentPayrollReport.periodEndDate || currentPayrollReport.period_end)}
              </p>
              <p className="text-sm text-gray-600">
                {currentPayrollReport.reportTitle || currentPayrollReport.report_title}
              </p>
            </div>
            <button
              onClick={handleEmailPaystubs}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <EnvelopeIcon className="h-5 w-5 mr-2" />
              Email Paystubs
            </button>
          </div>

          <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Summary</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-500 mb-1">Total Employees</div>
                <div className="text-xl font-semibold">{currentPayrollReport.totalEmployees || currentPayrollReport.total_employees || 0}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-500 mb-1">Total Gross</div>
                <div className="text-xl font-semibold">{formatCurrency(parseFloat(currentPayrollReport.totalGross || currentPayrollReport.total_gross || 0))}</div>
                {showYtdData && 
                  <div className="text-sm text-gray-400 mt-1">
                    YTD Total: {formatCurrency(currentPayrollReport.items?.reduce((sum, emp) => sum + parseFloat(emp.ytdGrossPay || emp.ytd_gross_pay || 0), 0))}
                  </div>
                }
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-500 mb-1">Total Net</div>
                <div className="text-xl font-semibold">{formatCurrency(parseFloat(currentPayrollReport.totalNet || currentPayrollReport.total_net || 0))}</div>
                {showYtdData && 
                  <div className="text-sm text-gray-400 mt-1">
                    YTD Total: {formatCurrency(currentPayrollReport.items?.reduce((sum, emp) => sum + parseFloat(emp.ytdNetPay || emp.ytd_net_pay || 0), 0))}
                  </div>
                }
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-500 mb-1">Total Loan Deductions</div>
                <div className="text-xl font-semibold">
                  {formatCurrency(currentPayrollReport.items?.reduce((sum, emp) => sum + parseFloat(emp.loanDeduction || emp.loan_deduction || 0), 0))}
                </div>
                {showYtdData && 
                  <div className="text-sm text-gray-400 mt-1">
                    YTD Total: {formatCurrency(currentPayrollReport.items?.reduce((sum, emp) => sum + parseFloat(emp.ytdLoanDeduction || emp.ytd_loan_deduction || 0), 0))}
                  </div>
                }
                <div className="text-xs text-gray-400 mt-2">
                  Employees with Loans: {currentPayrollReport.items?.filter(emp => parseFloat(emp.loanDeduction || emp.loan_deduction || 0) > 0).length || 0}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Deductions Summary</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-6 p-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-500 mb-1">Social Security (Employee)</div>
                <div className="text-xl font-semibold">
                  {formatCurrency(currentPayrollReport.items?.reduce((sum, emp) => sum + parseFloat(emp.socialSecurityEmployee || emp.social_security_employee || 0), 0))}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-500 mb-1">Social Security (Employer)</div>
                <div className="text-xl font-semibold">
                  {formatCurrency(currentPayrollReport.items?.reduce((sum, emp) => sum + parseFloat(emp.socialSecurityEmployer || emp.social_security_employer || 0), 0))}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-500 mb-1">Medical Benefits (Employee)</div>
                <div className="text-xl font-semibold">
                  {formatCurrency(currentPayrollReport.items?.reduce((sum, emp) => sum + parseFloat(emp.medicalBenefitsEmployee || emp.medical_benefits_employee || 0), 0))}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-500 mb-1">Medical Benefits (Employer)</div>
                <div className="text-xl font-semibold">
                  {formatCurrency(currentPayrollReport.items?.reduce((sum, emp) => sum + parseFloat(emp.medicalBenefitsEmployer || emp.medical_benefits_employer || 0), 0))}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-500 mb-1">Education Levy</div>
                <div className="text-xl font-semibold">
                  {formatCurrency(currentPayrollReport.items?.reduce((sum, emp) => sum + parseFloat(emp.educationLevy || emp.education_levy || 0), 0))}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-500 mb-1">Loan Deductions</div>
                <div className="text-xl font-semibold">
                  {formatCurrency(currentPayrollReport.items?.reduce((sum, emp) => sum + parseFloat(emp.loanDeduction || emp.loan_deduction || 0), 0))}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-500 mb-1">Total Employer Contributions</div>
                <div className="text-xl font-semibold">
                  {formatCurrency(currentPayrollReport.items?.reduce((sum, emp) => {
                    const contributions = emp.totalEmployerContributions || emp.total_employer_contributions;
                    if (contributions) {
                      return sum + parseFloat(contributions);
                    } else {
                      const ssEmployer = parseFloat(emp.socialSecurityEmployer || emp.social_security_employer || 0);
                      const mbEmployer = parseFloat(emp.medicalBenefitsEmployer || emp.medical_benefits_employer || 0);
                      return sum + ssEmployer + mbEmployer;
                    }
                  }, 0))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Employee Details</h2>
              <div className="flex items-center">
                <button
                  onClick={() => setShowYtdData(!showYtdData)}
                  className={`inline-flex items-center px-3 py-1.5 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    showYtdData 
                      ? 'bg-blue-600 text-white hover:bg-blue-700 border-transparent' 
                      : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                  }`}
                >
                  {showYtdData ? 'Hide YTD Data' : 'Show YTD Data'}
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hours
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gross Pay
                      {showYtdData && <span className="block text-xxs">YTD: {formatCurrency(currentPayrollReport.items?.reduce((sum, emp) => sum + parseFloat(emp.ytdGrossPay || emp.ytd_gross_pay || 0), 0))}</span>}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Deductions
                      {showYtdData && <span className="block text-xxs">YTD Total</span>}
                    </th>
                    {showYtdData && 
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Loan Details
                      </th>
                    }
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employer Cont.
                      {showYtdData && <span className="block text-xxs">YTD: {formatCurrency(currentPayrollReport.items?.reduce((sum, emp) => sum + parseFloat(emp.ytdEmployerContributions || emp.ytd_employer_contributions || 0), 0))}</span>}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Net Pay
                      {showYtdData && <span className="block text-xxs">YTD: {formatCurrency(currentPayrollReport.items?.reduce((sum, emp) => sum + parseFloat(emp.ytdNetPay || emp.ytd_net_pay || 0), 0))}</span>}
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentPayrollReport.items && currentPayrollReport.items.map((employee) => (
                    <tr key={employee.employeeId || employee.employee_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {employee.employeeName || employee.employee_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {employee.employeeId || employee.employee_id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {employee.hoursWorked || employee.hours_worked || '0.00'} hrs
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>{formatCurrency(parseFloat(employee.grossPay || employee.gross_pay || 0))}</div>
                        {showYtdData && 
                          <div className="text-xs text-gray-400 mt-1">
                            YTD: {formatCurrency(parseFloat(employee.ytdGrossPay || employee.ytd_gross_pay || 0))}
                          </div>
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>
                          {formatCurrency(
                            (employee.totalDeductions || employee.total_deductions) || 
                            (parseFloat(employee.socialSecurityEmployee || employee.social_security_employee || 0) + 
                            parseFloat(employee.medicalBenefitsEmployee || employee.medical_benefits_employee || 0) + 
                            parseFloat(employee.educationLevy || employee.education_levy || 0) +
                            parseFloat(employee.loanDeduction || employee.loan_deduction || 0))
                          )}
                        </div>
                        {showYtdData && 
                          <div className="text-xs mt-1">
                            <div className="text-gray-400">
                              YTD: {formatCurrency(
                                parseFloat(employee.ytdSocialSecurityEmployee || employee.ytd_social_security_employee || 0) + 
                                parseFloat(employee.ytdMedicalBenefitsEmployee || employee.ytd_medical_benefits_employee || 0) + 
                                parseFloat(employee.ytdEducationLevy || employee.ytd_education_levy || 0) +
                                parseFloat(employee.ytdLoanDeduction || employee.ytd_loan_deduction || 0)
                              )}
                            </div>
                          </div>
                        }
                      </td>
                      {showYtdData && 
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {parseFloat(employee.loanDeduction || employee.loan_deduction || 0) > 0 ? (
                            <>
                              <div>Current: {formatCurrency(parseFloat(employee.loanDeduction || employee.loan_deduction || 0))}</div>
                              <div className="text-xs text-gray-400 mt-1">
                                YTD: {formatCurrency(parseFloat(employee.ytdLoanDeduction || employee.ytd_loan_deduction || 0))}
                              </div>
                              <div className="text-xs text-gray-400 mt-1">
                                Bal: {formatCurrency(parseFloat(employee.loanBalance || employee.loan_balance || 0))}
                              </div>
                            </>
                          ) : (
                            <span className="text-xs text-gray-400">No active loans</span>
                          )}
                        </td>
                      }
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>
                          {formatCurrency(
                            (employee.totalEmployerContributions || employee.total_employer_contributions) || 
                            (parseFloat(employee.socialSecurityEmployer || employee.social_security_employer || 0) + 
                            parseFloat(employee.medicalBenefitsEmployer || employee.medical_benefits_employer || 0))
                          )}
                        </div>
                        {showYtdData && 
                          <div className="text-xs text-gray-400 mt-1">
                            YTD: {formatCurrency(parseFloat(employee.ytdEmployerContributions || employee.ytd_employer_contributions || 0))}
                          </div>
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>{formatCurrency(parseFloat(employee.netPay || employee.net_pay || 0))}</div>
                        {showYtdData && 
                          <div className="text-xs text-gray-400 mt-1">
                            YTD: {formatCurrency(parseFloat(employee.ytdNetPay || employee.ytd_net_pay || 0))}
                          </div>
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={() => handleViewPaystub(employee.employeeId || employee.employee_id)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Paystub"
                          >
                            <EyeIcon className="h-5 w-5" aria-hidden="true" />
                            <span className="sr-only">View Paystub</span>
                          </button>
                          <button
                            onClick={() => handleDownloadPaystub(employee.employeeId || employee.employee_id)}
                            className="text-green-600 hover:text-green-900"
                            title="Download Paystub"
                          >
                            <DocumentArrowDownIcon className="h-5 w-5" aria-hidden="true" />
                            <span className="sr-only">Download Paystub</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Use the Dashboard layout for this page
PayrollReportDetails.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
