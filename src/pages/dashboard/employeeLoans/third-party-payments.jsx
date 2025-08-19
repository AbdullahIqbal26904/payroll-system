import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import Head from 'next/head';
import { fetchThirdPartyPayments, clearThirdPartyPayments } from '@/redux/slices/loanSlice';
import { fetchPayrollReports } from '@/redux/slices/payrollSlice';
import { formatCurrency } from '@/lib/utils';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function ThirdPartyPayments() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { thirdPartyPayments, loading, error } = useSelector((state) => state.loans);
  const { payrollReports } = useSelector((state) => state.payroll);

  const [selectedPayrollRunId, setSelectedPayrollRunId] = useState('');

  useEffect(() => {
    // Fetch payroll reports to populate the dropdown
    dispatch(fetchPayrollReports());

    // Clear third party payments when component unmounts
    return () => {
      dispatch(clearThirdPartyPayments());
    };
  }, [dispatch]);

  const handlePayrollRunChange = (e) => {
    setSelectedPayrollRunId(e.target.value);
  };

  const handleFetchPayments = () => {
    if (selectedPayrollRunId) {
      dispatch(fetchThirdPartyPayments(selectedPayrollRunId));
    }
  };

  const handleExportCSV = () => {
    if (!thirdPartyPayments.length) return;

    // Create CSV content
    const headers = [
      'Employee Name',
      'Employee Number',
      'Payment Amount',
      'Third Party Name',
      'Account Number',
      'Routing Number',
      'Reference'
    ];

    const csvContent = [
      headers.join(','),
      ...thirdPartyPayments.map((payment) => [
        `${payment.first_name} ${payment.last_name}`,
        payment.employee_number,
        payment.payment_amount,
        payment.third_party_name,
        payment.third_party_account_number || '',
        payment.third_party_routing_number || '',
        payment.third_party_reference || ''
      ].join(','))
    ].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `third-party-payments-${selectedPayrollRunId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Head>
        <title>Third-Party Loan Payments | Payroll System</title>
        <meta name="description" content="Generate third-party loan payment reports" />
      </Head>

      <div className="py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Third-Party Loan Payments</h1>
            <p className="mt-1 text-sm text-gray-500">
              Generate payment reports for third-party loans
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
          <div className="flex flex-col md:flex-row items-end space-y-4 md:space-y-0 md:space-x-4">
            <div className="w-full md:w-1/3">
              <label htmlFor="payrollRunId" className="block text-sm font-medium text-gray-700 mb-1">
                Select Payroll Run
              </label>
              <select
                id="payrollRunId"
                name="payrollRunId"
                value={selectedPayrollRunId}
                onChange={handlePayrollRunChange}
                className="block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Select a Payroll Run</option>
                {payrollReports?.map((report) => (
                  <option key={report.id} value={report.id}>
                    {new Date(report.payroll_date).toLocaleDateString()} - {report.description || 'Payroll Run'}
                  </option>
                ))}
              </select>
            </div>
            
            <button
              onClick={handleFetchPayments}
              disabled={!selectedPayrollRunId || loading}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Generate Report'}
            </button>
            
            <button
              onClick={handleExportCSV}
              disabled={!thirdPartyPayments.length || loading}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              Export to CSV
            </button>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          {loading ? (
            <div className="py-12 flex justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
          ) : thirdPartyPayments?.length === 0 ? (
            <div className="py-12 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <p className="mt-2 text-gray-500">
                {selectedPayrollRunId ? 'No third-party loan payments for this payroll run' : 'Select a payroll run to generate payments report'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee Number
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Third-Party Lender
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Account Number
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Routing Number
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reference
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {thirdPartyPayments.map((payment, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {payment.first_name} {payment.last_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {payment.employee_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {formatCurrency(payment.payment_amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {payment.third_party_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {payment.third_party_account_number || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {payment.third_party_routing_number || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {payment.third_party_reference || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Use the Dashboard layout for this page
ThirdPartyPayments.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
