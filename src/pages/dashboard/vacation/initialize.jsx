import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { initializeVacation } from '@/redux/slices/vacationSlice';
import { fetchEmployees } from '@/redux/slices/employeeSlice';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { XCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function InitializeVacation() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading, error, success, message } = useSelector((state) => state.vacation);
  const { employees } = useSelector((state) => state.employees);
  
  const [formData, setFormData] = useState({
    employeeId: '',
    year: new Date().getFullYear(),
    annualPtoHours: 80
  });
  
  // Fetch employees on component mount
  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(initializeVacation(formData));
  };
  
  // Show success message and redirect
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        router.push('/dashboard/vacation');
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [success, router]);
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Initialize Vacation Entitlement</h1>
        <button
          onClick={() => router.back()}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
        >
          Back
        </button>
      </div>
      
      {/* Success message */}
      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">
                Vacation entitlement initialized successfully. Redirecting...
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700 mb-1">
                Employee *
              </label>
              <select
                id="employeeId"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Employee</option>
                {employees?.map((employee) => (
                  <option key={employee.id} value={employee.employee_id}>
                    {employee.first_name} {employee.last_name} ({employee.employee_id})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                Year *
              </label>
              <input
                type="number"
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
                min={new Date().getFullYear() - 1}
                max={new Date().getFullYear() + 2}
                className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="annualPtoHours" className="block text-sm font-medium text-gray-700 mb-1">
                Annual PTO Hours *
              </label>
              <input
                type="number"
                id="annualPtoHours"
                name="annualPtoHours"
                value={formData.annualPtoHours}
                onChange={handleChange}
                required
                min={0}
                max={240}
                step={0.01}
                className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Accrual rate per hour: {formData.annualPtoHours > 0 ? (formData.annualPtoHours / 2080).toFixed(6) : 0}
              </p>
            </div>
          </div>
          
          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={() => router.push('/dashboard/vacation')}
              className="mr-2 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`${
                loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
              } text-white px-4 py-2 rounded transition-colors flex items-center`}
            >
              {loading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              Initialize Vacation
            </button>
          </div>
        </form>
      </div>
      
      <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">About Vacation Entitlement</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p className="mb-1">The system calculates vacation accrual based on hours worked:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Annual PTO hours are divided by total annual work hours (2080) to find the accrual rate per hour</li>
                <li>Employees accrue vacation time for every hour worked</li>
                <li>Example: 80 annual PTO hours ÷ 2080 work hours = 0.038462 hours accrued per hour worked</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Use the Dashboard layout for this page
InitializeVacation.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
