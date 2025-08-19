import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import Head from 'next/head';
import { createThirdPartyLoan, resetLoanState } from '@/redux/slices/loanSlice';
import { fetchEmployees } from '@/redux/slices/employeeSlice';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function AddThirdPartyLoan() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.loans);
  const { employees } = useSelector((state) => state.employees);

  const [formData, setFormData] = useState({
    employee_id: '',
    loan_amount: '',
    installment_amount: '',
    start_date: '',
    expected_end_date: '',
    notes: '',
    third_party_name: '',
    third_party_account_number: '',
    third_party_routing_number: '',
    third_party_reference: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchEmployees());
    return () => {
      dispatch(resetLoanState());
    };
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      router.push('/dashboard/employeeLoans');
    }
  }, [success, router]);

  const validateForm = () => {
    const errors = {};
    if (!formData.employee_id) errors.employee_id = 'Employee is required';
    if (!formData.loan_amount || formData.loan_amount <= 0) errors.loan_amount = 'Valid loan amount is required';
    if (!formData.installment_amount || formData.installment_amount <= 0) errors.installment_amount = 'Valid installment amount is required';
    if (!formData.start_date) errors.start_date = 'Start date is required';
    if (!formData.expected_end_date) errors.expected_end_date = 'Expected end date is required';
    if (new Date(formData.expected_end_date) <= new Date(formData.start_date)) {
      errors.expected_end_date = 'End date must be after start date';
    }
    if (!formData.third_party_name) errors.third_party_name = 'Third-party lender name is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Format and convert data
      const loanData = {
        ...formData,
        employee_id: Number(formData.employee_id),
        loan_amount: Number(formData.loan_amount),
        installment_amount: Number(formData.installment_amount),
      };

      dispatch(createThirdPartyLoan(loanData))
        .unwrap()
        .then(() => {
          setIsSubmitting(false);
        })
        .catch(() => {
          setIsSubmitting(false);
        });
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <>
      <Head>
        <title>Add Third-Party Loan | Payroll System</title>
        <meta name="description" content="Add a new third-party loan" />
      </Head>

      <div className="py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add Third-Party Loan</h1>
            <p className="mt-1 text-sm text-gray-500">
              Create a new third-party loan for an employee
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

        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-lg font-medium text-gray-900">Employee Information</h2>
              <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="employee_id" className="block text-sm font-medium text-gray-700">
                    Employee
                  </label>
                  <select
                    id="employee_id"
                    name="employee_id"
                    className={`mt-1 block w-full bg-white border ${
                      formErrors.employee_id ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    value={formData.employee_id}
                    onChange={handleChange}
                  >
                    <option value="">Select an Employee</option>
                    {employees?.map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {employee.first_name} {employee.last_name} - {employee.id}
                      </option>
                    ))}
                  </select>
                  {formErrors.employee_id && (
                    <p className="mt-2 text-sm text-red-600">{formErrors.employee_id}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-lg font-medium text-gray-900">Loan Details</h2>
              <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="loan_amount" className="block text-sm font-medium text-gray-700">
                    Loan Amount
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      name="loan_amount"
                      id="loan_amount"
                      className={`mt-1 block w-full pl-7 pr-12 border ${
                        formErrors.loan_amount ? 'border-red-500' : 'border-gray-300'
                      } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                      placeholder="0.00"
                      step="0.01"
                      value={formData.loan_amount}
                      onChange={handleChange}
                    />
                  </div>
                  {formErrors.loan_amount && (
                    <p className="mt-2 text-sm text-red-600">{formErrors.loan_amount}</p>
                  )}
                </div>

                <div className="sm:col-span-3">
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
                      className={`mt-1 block w-full pl-7 pr-12 border ${
                        formErrors.installment_amount ? 'border-red-500' : 'border-gray-300'
                      } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                      placeholder="0.00"
                      step="0.01"
                      value={formData.installment_amount}
                      onChange={handleChange}
                    />
                  </div>
                  {formErrors.installment_amount && (
                    <p className="mt-2 text-sm text-red-600">{formErrors.installment_amount}</p>
                  )}
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="start_date"
                    id="start_date"
                    className={`mt-1 block w-full border ${
                      formErrors.start_date ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    value={formData.start_date}
                    onChange={handleChange}
                  />
                  {formErrors.start_date && (
                    <p className="mt-2 text-sm text-red-600">{formErrors.start_date}</p>
                  )}
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="expected_end_date" className="block text-sm font-medium text-gray-700">
                    Expected End Date
                  </label>
                  <input
                    type="date"
                    name="expected_end_date"
                    id="expected_end_date"
                    className={`mt-1 block w-full border ${
                      formErrors.expected_end_date ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    value={formData.expected_end_date}
                    onChange={handleChange}
                  />
                  {formErrors.expected_end_date && (
                    <p className="mt-2 text-sm text-red-600">{formErrors.expected_end_date}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-lg font-medium text-gray-900">Third-Party Information</h2>
              <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="third_party_name" className="block text-sm font-medium text-gray-700">
                    Third-Party Name
                  </label>
                  <input
                    type="text"
                    name="third_party_name"
                    id="third_party_name"
                    className={`mt-1 block w-full border ${
                      formErrors.third_party_name ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    value={formData.third_party_name}
                    onChange={handleChange}
                  />
                  {formErrors.third_party_name && (
                    <p className="mt-2 text-sm text-red-600">{formErrors.third_party_name}</p>
                  )}
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="third_party_reference" className="block text-sm font-medium text-gray-700">
                    Reference Number
                  </label>
                  <input
                    type="text"
                    name="third_party_reference"
                    id="third_party_reference"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={formData.third_party_reference}
                    onChange={handleChange}
                  />
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="third_party_account_number" className="block text-sm font-medium text-gray-700">
                    Account Number
                  </label>
                  <input
                    type="text"
                    name="third_party_account_number"
                    id="third_party_account_number"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={formData.third_party_account_number}
                    onChange={handleChange}
                  />
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="third_party_routing_number" className="block text-sm font-medium text-gray-700">
                    Routing Number
                  </label>
                  <input
                    type="text"
                    name="third_party_routing_number"
                    id="third_party_routing_number"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={formData.third_party_routing_number}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Notes (Optional)
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Any additional information about this loan"
                value={formData.notes}
                onChange={handleChange}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={loading || isSubmitting}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Create Third-Party Loan'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

// Use the Dashboard layout for this page
AddThirdPartyLoan.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
