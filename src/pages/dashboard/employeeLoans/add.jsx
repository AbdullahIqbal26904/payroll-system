import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { createLoan } from '@/redux/slices/loanSlice';
import { fetchEmployees } from '@/redux/slices/employeeSlice';
import { toast } from 'react-toastify';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function AddLoan() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.loans);
  const { employees } = useSelector((state) => state.employees);
  
  const [formData, setFormData] = useState({
    employee_id: '',
    loan_amount: '',
    interest_rate: '',
    installment_amount: '',
    start_date: '',
    expected_end_date: '',
    notes: ''
  });
  
  useEffect(() => {
    // Fetch employees for the dropdown
    dispatch(fetchEmployees());
  }, [dispatch]);
  
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : parseFloat(value)) : value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.employee_id) {
      toast.error('Please select an employee');
      return;
    }
    
    if (!formData.loan_amount || formData.loan_amount <= 0) {
      toast.error('Please enter a valid loan amount');
      return;
    }
    
    if (!formData.installment_amount || formData.installment_amount <= 0) {
      toast.error('Please enter a valid installment amount');
      return;
    }
    
    if (!formData.start_date) {
      toast.error('Please select a start date');
      return;
    }
    
    try {
      const resultAction = await dispatch(createLoan(formData));
      
      if (createLoan.fulfilled.match(resultAction)) {
        toast.success('Loan created successfully!');
        router.push('/dashboard/employeeLoans');
      } else if (createLoan.rejected.match(resultAction)) {
        toast.error(resultAction.payload || 'Failed to create loan');
      }
    } catch (err) {
      console.error('Failed to create loan:', err);
      toast.error('Failed to create loan');
    }
  };
  
  const calculateTotalPayable = () => {
    if (!formData.loan_amount || !formData.interest_rate) return '';
    
    const principal = parseFloat(formData.loan_amount);
    const interestRate = parseFloat(formData.interest_rate) / 100;
    
    return (principal + (principal * interestRate)).toFixed(2);
  };
  
  return (
    <>
      <Head>
        <title>Add Employee Loan | Payroll System</title>
        <meta name="description" content="Create a new employee loan" />
      </Head>
      
      <div className="py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create New Loan</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create a new loan for an employee
          </p>
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
        
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <form onSubmit={handleSubmit}>
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Loan Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Employee */}
                <div>
                  <label htmlFor="employee_id" className="block text-sm font-medium text-gray-700">
                    Employee <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="employee_id"
                    name="employee_id"
                    required
                    value={formData.employee_id}
                    onChange={handleChange}
                    className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Select an employee</option>
                    {employees?.map((employee) => (
                      <option key={employee.employee_id} value={employee.employee_id}>
                        {employee.first_name} {employee.last_name}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Loan Amount */}
                <div>
                  <label htmlFor="loan_amount" className="block text-sm font-medium text-gray-700">
                    Loan Amount <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      name="loan_amount"
                      id="loan_amount"
                      required
                      min="0.01"
                      step="0.01"
                      value={formData.loan_amount}
                      onChange={handleChange}
                      className="mt-1 block w-full pl-7 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
                
                {/* Interest Rate */}
                <div>
                  <label htmlFor="interest_rate" className="block text-sm font-medium text-gray-700">
                    Interest Rate (%) <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="number"
                      name="interest_rate"
                      id="interest_rate"
                      required
                      min="0"
                      step="0.1"
                      value={formData.interest_rate}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">%</span>
                    </div>
                  </div>
                </div>
                
                {/* Total Payable (Calculated) */}
                <div>
                  <label htmlFor="total_payable" className="block text-sm font-medium text-gray-700">
                    Total Payable
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="text"
                      id="total_payable"
                      readOnly
                      value={calculateTotalPayable()}
                      className="mt-1 block w-full pl-7 bg-gray-50 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none sm:text-sm"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Principal + Interest</p>
                </div>
                
                {/* Installment Amount */}
                <div>
                  <label htmlFor="installment_amount" className="block text-sm font-medium text-gray-700">
                    Installment Amount <span className="text-red-500">*</span>
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
                  <p className="mt-1 text-xs text-gray-500">Amount to deduct per pay period</p>
                </div>
                
                {/* Start Date */}
                <div>
                  <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="start_date"
                    id="start_date"
                    required
                    value={formData.start_date}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                {/* Expected End Date */}
                <div>
                  <label htmlFor="expected_end_date" className="block text-sm font-medium text-gray-700">
                    Expected End Date
                  </label>
                  <input
                    type="date"
                    name="expected_end_date"
                    id="expected_end_date"
                    value={formData.expected_end_date}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Leave blank to calculate automatically based on installment amount
                  </p>
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
                onClick={() => router.push('/dashboard/employeeLoans')}
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
                {loading ? 'Creating...' : 'Create Loan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

// Use the Dashboard layout for this page
AddLoan.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
