import { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLoanById, updateLoan } from '@/redux/slices/loanSlice';
import { toast } from 'react-toastify';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { formatCurrency } from '@/lib/utils';
import { useState } from 'react';

export default function LoanDetails() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { loan, loading, error } = useSelector((state) => state.loans);
  const { id } = router.query;
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    installment_amount: '',
    status: '',
    notes: ''
  });
  
  useEffect(() => {
    if (id) {
      dispatch(fetchLoanById(id));
    }
  }, [dispatch, id]);
  
  // Initialize form data when loan details are loaded
  useEffect(() => {
    if (loan) {
      setFormData({
        installment_amount: loan.installment_amount,
        status: loan.status,
        notes: loan.notes || ''
      });
    }
  }, [loan]);
  
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : parseFloat(value)) : value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const resultAction = await dispatch(updateLoan({
        id,
        data: formData
      }));
      
      if (updateLoan.fulfilled.match(resultAction)) {
        toast.success('Loan updated successfully!');
        setIsEditing(false);
      } else if (updateLoan.rejected.match(resultAction)) {
        toast.error(resultAction.payload || 'Failed to update loan');
      }
    } catch (err) {
      console.error('Failed to update loan:', err);
      toast.error('Failed to update loan');
    }
  };
  
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paid':
        return 'bg-blue-100 text-blue-800';
      case 'defaulted':
        return 'bg-red-100 text-red-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  if (loading) {
    return (
      <div className="py-12 flex justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="py-6">
        <div className="bg-red-50 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={() => router.push('/dashboard/employeeLoans')}
                className="mt-2 text-sm text-red-700 underline"
              >
                Back to Loans
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!loan) {
    return null; // Return null while fetching or if no loan was found
  }
  
  return (
    <>
      <Head>
        <title>Loan Details | Payroll System</title>
        <meta name="description" content="Employee loan details" />
      </Head>
      
      <div className="py-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="flex items-center">
              <button
                onClick={() => router.push('/dashboard/employeeLoans')}
                className="mr-2 text-blue-600 hover:text-blue-800"
              >
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                Loan Details - {loan.employee_name}
              </h1>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              View and manage employee loan details
            </p>
          </div>
          <div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Edit Loan
              </button>
            )}
          </div>
        </div>
        
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Edit Loan</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Installment Amount */}
                  <div>
                    <label htmlFor="installment_amount" className="block text-sm font-medium text-gray-700">
                      Installment Amount
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        name="installment_amount"
                        id="installment_amount"
                        required
                        min="0.01"
                        step="0.01"
                        value={formData.installment_amount}
                        onChange={handleChange}
                        className="mt-1 block w-full pl-7 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  
                  {/* Status */}
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="active">Active</option>
                      <option value="paused">Paused</option>
                      <option value="paid">Paid</option>
                      <option value="defaulted">Defaulted</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  
                  {/* Notes */}
                  <div className="md:col-span-2">
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                      Notes
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows={3}
                      value={formData.notes}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-4 bg-gray-50 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    loading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  {loan.loan_type === 'third_party' ? 'Third-Party Loan Information' : 'Loan Information'}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Employee</p>
                    <p className="mt-1 text-sm text-gray-900">{loan.employee_name}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <p className="mt-1">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(loan.status)}`}>
                        {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                      </span>
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Loan Type</p>
                    <p className="mt-1">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${loan.loan_type === 'third_party' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                        {loan.loan_type === 'third_party' ? 'Third-Party' : 'Internal'}
                      </span>
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Loan Amount</p>
                    <p className="mt-1 text-sm text-gray-900">{formatCurrency(loan.loan_amount)}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Payable</p>
                    <p className="mt-1 text-sm text-gray-900">{formatCurrency(loan.total_payable)}</p>
                  </div>
                  
                  {loan.loan_type !== 'third_party' && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Interest Rate</p>
                      <p className="mt-1 text-sm text-gray-900">{loan.interest_rate}%</p>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Remaining Balance</p>
                    <p className="mt-1 text-sm text-gray-900">{formatCurrency(loan.remaining_balance)}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Installment Amount</p>
                    <p className="mt-1 text-sm text-gray-900">{formatCurrency(loan.installment_amount)}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Start Date</p>
                    <p className="mt-1 text-sm text-gray-900">{new Date(loan.start_date).toLocaleDateString()}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Expected End Date</p>
                    <p className="mt-1 text-sm text-gray-900">{new Date(loan.expected_end_date).toLocaleDateString()}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Created At</p>
                    <p className="mt-1 text-sm text-gray-900">{new Date(loan.created_at).toLocaleDateString()}</p>
                  </div>
                  
                  {loan.notes && (
                    <div className="md:col-span-2">
                      <p className="text-sm font-medium text-gray-500">Notes</p>
                      <p className="mt-1 text-sm text-gray-900">{loan.notes}</p>
                    </div>
                  )}
                </div>
                
                {/* Third-Party Information */}
                {loan.loan_type === 'third_party' && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Third-Party Lender Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Lender Name</p>
                        <p className="mt-1 text-sm text-gray-900">{loan.third_party_name}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500">Reference Number</p>
                        <p className="mt-1 text-sm text-gray-900">{loan.third_party_reference || 'N/A'}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500">Account Number</p>
                        <p className="mt-1 text-sm text-gray-900">{loan.third_party_account_number || 'N/A'}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500">Routing Number</p>
                        <p className="mt-1 text-sm text-gray-900">{loan.third_party_routing_number || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Payment History */}
              {loan.payments && loan.payments.length > 0 && (
                <div className="p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Payment History</h2>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          {loan.loan_type !== 'third_party' && (
                            <>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Principal
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Interest
                              </th>
                            </>
                          )}
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Remaining Balance
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {loan.payments.map((payment) => (
                          <tr key={payment.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(payment.payment_date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(payment.payment_amount)}
                            </td>
                            {loan.loan_type !== 'third_party' && (
                              <>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {formatCurrency(payment.principal_amount)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {formatCurrency(payment.interest_amount)}
                                </td>
                              </>
                            )}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(payment.remaining_balance)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

// Use the Dashboard layout for this page
LoanDetails.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
