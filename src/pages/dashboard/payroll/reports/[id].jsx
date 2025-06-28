// filepath: /Users/abdullahiqbal/Downloads/Payroll-Application/payroll-frontend/src/pages/dashboard/payroll/reports/[id].jsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPayrollReportDetails } from '@/redux/slices/payrollSlice';
import Link from 'next/link';
import { ArrowLeftIcon, DocumentArrowDownIcon, EnvelopeIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { downloadPaystub } from '@/lib/PaystubDownloader';

export default function PayrollReportDetails() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = router.query;
  const { currentPayrollReport, loading, error } = useSelector((state) => state.payroll);
  
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
    if (amount === undefined || amount === null) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'XCD'
    }).format(amount);
  };

  // Handle download paystub
  const handleDownloadPaystub = async (employeeId) => {
    if (id) {
      try {
        // Using the payrollAPI to handle blob response properly
        const response = await fetch(`/api/downloadPaystub?payrollRunId=${id}&employeeId=${employeeId}`);
        const blob = await response.blob();
        const filename = `paystub-${employeeId}.pdf`;
        
        // Use our utility function to handle the download
        downloadPaystub(blob, filename);
      } catch (error) {
        console.error('Error downloading paystub:', error);
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-500 mb-1">Total Employees</div>
                <div className="text-xl font-semibold">{currentPayrollReport.totalEmployees || currentPayrollReport.total_employees || 0}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-500 mb-1">Total Gross</div>
                <div className="text-xl font-semibold">{formatCurrency(currentPayrollReport.totalGross || currentPayrollReport.total_gross)}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-500 mb-1">Total Net</div>
                <div className="text-xl font-semibold">{formatCurrency(currentPayrollReport.totalNet || currentPayrollReport.total_net)}</div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Deductions Summary</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 p-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-500 mb-1">Social Security (Employee)</div>
                <div className="text-xl font-semibold">
                  {formatCurrency(currentPayrollReport.items?.reduce((sum, emp) => sum + (emp.socialSecurityEmployee || emp.social_security_employee || 0), 0))}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-500 mb-1">Social Security (Employer)</div>
                <div className="text-xl font-semibold">
                  {formatCurrency(currentPayrollReport.items?.reduce((sum, emp) => sum + (emp.socialSecurityEmployer || emp.social_security_employer || 0), 0))}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-500 mb-1">Medical Benefits (Employee)</div>
                <div className="text-xl font-semibold">
                  {formatCurrency(currentPayrollReport.items?.reduce((sum, emp) => sum + (emp.medicalBenefitsEmployee || emp.medical_benefits_employee || 0), 0))}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-500 mb-1">Medical Benefits (Employer)</div>
                <div className="text-xl font-semibold">
                  {formatCurrency(currentPayrollReport.items?.reduce((sum, emp) => sum + (emp.medicalBenefitsEmployer || emp.medical_benefits_employer || 0), 0))}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-500 mb-1">Education Levy</div>
                <div className="text-xl font-semibold">
                  {formatCurrency(currentPayrollReport.items?.reduce((sum, emp) => sum + (emp.educationLevy || emp.education_levy || 0), 0))}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-500 mb-1">Total Employer Contributions</div>
                <div className="text-xl font-semibold">
                  {formatCurrency(currentPayrollReport.items?.reduce((sum, emp) => sum + 
                    ((emp.totalEmployerContributions || emp.total_employer_contributions) || 
                     ((emp.socialSecurityEmployer || emp.social_security_employer || 0) + 
                      (emp.medicalBenefitsEmployer || emp.medical_benefits_employer || 0))
                    ), 0))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Employee Details</h2>
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
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Deductions
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employer Cont.
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Net Pay
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
                        {formatCurrency(employee.grossPay || employee.gross_pay)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(
                          (employee.totalDeductions || employee.total_deductions) || 
                          ((employee.socialSecurityEmployee || employee.social_security_employee || 0) + 
                           (employee.medicalBenefitsEmployee || employee.medical_benefits_employee || 0) + 
                           (employee.educationLevy || employee.education_levy || 0))
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(
                          (employee.totalEmployerContributions || employee.total_employer_contributions) || 
                          ((employee.socialSecurityEmployer || employee.social_security_employer || 0) + 
                           (employee.medicalBenefitsEmployer || employee.medical_benefits_employer || 0))
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(employee.netPay || employee.net_pay)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleDownloadPaystub(employee.employeeId || employee.employee_id)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Download Paystub"
                        >
                          <DocumentArrowDownIcon className="h-5 w-5" aria-hidden="true" />
                          <span className="sr-only">Download Paystub</span>
                        </button>
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
