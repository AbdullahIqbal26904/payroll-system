import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPayrollSettings, updatePayrollSettings, resetPayrollState } from '@/redux/slices/payrollSlice';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

export default function PayrollSettings() {
  const dispatch = useDispatch();
  const { payrollSettings, loading, error, success, message } = useSelector((state) => state.payroll);
  
  const [formData, setFormData] = useState({
    socialSecurityEmployeeRate: 7.00,
    socialSecurityEmployerRate: 9.00,
    socialSecurityMaxInsurable: 6500.00,
    medicalBenefitsEmployeeRate: 3.50,
    medicalBenefitsEmployerRate: 3.50,
    medicalBenefitsEmployeeSeniorRate: 2.50,
    educationLevyRate: 2.50,
    educationLevyHighRate: 5.00,
    educationLevyThreshold: 5000.00,
    educationLevyExemption: 541.67,
    retirementAge: 65,
    medicalBenefitsSeniorAge: 60,
    medicalBenefitsMaxAge: 70
  });

  // Fetch settings on component mount
  useEffect(() => {
    dispatch(fetchPayrollSettings());
    return () => {
      dispatch(resetPayrollState());
    };
  }, [dispatch]);

  // Update form data when settings are loaded
  useEffect(() => {
    if (payrollSettings) {
      setFormData(payrollSettings);
    }
  }, [payrollSettings]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name.includes('Age') ? parseInt(value, 10) : parseFloat(value)
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updatePayrollSettings(formData));
  };

  // Reset success message after a delay
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        dispatch(resetPayrollState());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Payroll Settings</h1>
        <p className="mt-2 text-sm text-gray-600">
          Configure Antigua-specific payroll settings and deduction rates
        </p>
      </div>
      
      {success && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">
                {message || 'Settings updated successfully!'}
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
              Social Security Settings
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employee Rate (%)
                </label>
                <input
                  type="number"
                  name="socialSecurityEmployeeRate"
                  value={formData.socialSecurityEmployeeRate}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  max="100"
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employer Rate (%)
                </label>
                <input
                  type="number"
                  name="socialSecurityEmployerRate"
                  value={formData.socialSecurityEmployerRate}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  max="100"
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Insurable Earnings ($)
                </label>
                <input
                  type="number"
                  name="socialSecurityMaxInsurable"
                  value={formData.socialSecurityMaxInsurable}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="mb-8 border-t border-gray-200 pt-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Medical Benefits Settings
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employee Rate (%)
                </label>
                <input
                  type="number"
                  name="medicalBenefitsEmployeeRate"
                  value={formData.medicalBenefitsEmployeeRate}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  max="100"
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employer Rate (%)
                </label>
                <input
                  type="number"
                  name="medicalBenefitsEmployerRate"
                  value={formData.medicalBenefitsEmployerRate}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  max="100"
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Senior Employee Rate (%)
                </label>
                <input
                  type="number"
                  name="medicalBenefitsEmployeeSeniorRate"
                  value={formData.medicalBenefitsEmployeeSeniorRate}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  max="100"
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="mb-8 border-t border-gray-200 pt-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Education Levy Settings
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Standard Rate (%)
                </label>
                <input
                  type="number"
                  name="educationLevyRate"
                  value={formData.educationLevyRate}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  max="100"
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Higher Rate (%)
                </label>
                <input
                  type="number"
                  name="educationLevyHighRate"
                  value={formData.educationLevyHighRate}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  max="100"
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Threshold ($)
                </label>
                <input
                  type="number"
                  name="educationLevyThreshold"
                  value={formData.educationLevyThreshold}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Exemption Amount ($)
                </label>
                <input
                  type="number"
                  name="educationLevyExemption"
                  value={formData.educationLevyExemption}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="mb-8 border-t border-gray-200 pt-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Age Thresholds
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Retirement Age
                </label>
                <input
                  type="number"
                  name="retirementAge"
                  value={formData.retirementAge}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  Employees at or above this age are exempt from Social Security contributions
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Medical Benefits Senior Age
                </label>
                <input
                  type="number"
                  name="medicalBenefitsSeniorAge"
                  value={formData.medicalBenefitsSeniorAge}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  Employees between this age and max age pay reduced Medical Benefits rate
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Medical Benefits Maximum Age
                </label>
                <input
                  type="number"
                  name="medicalBenefitsMaxAge"
                  value={formData.medicalBenefitsMaxAge}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  Employees at or above this age are exempt from Medical Benefits contributions
                </p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating Settings...
                </>
              ) : (
                <>
                  Save Settings
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
PayrollSettings.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
