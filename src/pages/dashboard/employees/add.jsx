import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { addEmployee } from '@/redux/slices/employeeSlice';
import { toast } from 'react-toastify';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function AddEmployee() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.employees);
  
  const [formData, setFormData] = useState({
    employee_id: '',
    first_name: '',
    last_name: '',
    email: '',
    date_of_birth: '',
    gender: '',
    address: '',
    phone: '',
    hire_date: '',
    job_title: '',
    department: '',
    salary_amount: '',
    payment_frequency: 'Monthly',
    // New fields
    hourly_rate: null,
    is_exempt_ss: false,
    is_exempt_medical: false
  });
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              name === 'salary_amount' ? parseFloat(value) || '' :
              name === 'hourly_rate' ? (value === '' ? null : parseFloat(value)) :
              value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Clean up the data before sending
      const cleanedData = { ...formData };
      
      // Validate employee_id (mandatory field)
      if (!cleanedData.employee_id || cleanedData.employee_id.trim() === '') {
        toast.error('Employee ID is required');
        return;
      }
      
      // Remove hourly_rate if it's null or empty (for salaried employees)
      if (cleanedData.hourly_rate === null || cleanedData.hourly_rate === '') {
        delete cleanedData.hourly_rate;
      }
      
      const resultAction = await dispatch(addEmployee(cleanedData));
      if (addEmployee.fulfilled.match(resultAction)) {
        toast.success('Employee added successfully!');
        router.push('/dashboard/employees');
      } else if (addEmployee.rejected.match(resultAction)) {
        toast.error(resultAction.payload || 'Failed to add employee');
      }
    } catch (err) {
      console.error('Failed to add employee:', err);
      toast.error('Failed to add employee');
    }
  };
  
  const departments = [
    'Human Resources',
    'IT',
    'Finance',
    'Marketing',
    'Operations',
    'Sales',
    'Customer Support',
    'Research & Development',
    'Legal',
    'Executive'
  ];
  
  return (
    <>
      <Head>
        <title>Add Employee | Payroll System</title>
        <meta name="description" content="Add a new employee to your payroll system" />
      </Head>
      
      <div className="py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Add New Employee</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create a new employee profile with all necessary information
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
              <h2 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Employee ID */}
                <div>
                  <label htmlFor="employee_id" className="block text-sm font-medium text-gray-700">
                    Employee ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="employee_id"
                    id="employee_id"
                    required
                    value={formData.employee_id}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="E.g., EMP001"
                  />
                </div>
                
                {/* First Name */}
                <div>
                  <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    id="first_name"
                    required
                    value={formData.first_name}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                {/* Last Name */}
                <div>
                  <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    id="last_name"
                    required
                    value={formData.last_name}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="phone"
                    id="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                {/* Date of Birth */}
                <div>
                  <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="date_of_birth"
                    id="date_of_birth"
                    required
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                {/* Gender */}
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    required
                    value={formData.gender}
                    onChange={handleChange}
                    className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
                
                {/* Address */}
                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    rows={3}
                    required
                    value={formData.address}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
            
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Employment Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Hire Date */}
                <div>
                  <label htmlFor="hire_date" className="block text-sm font-medium text-gray-700">
                    Hire Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="hire_date"
                    id="hire_date"
                    required
                    value={formData.hire_date}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                {/* Department */}
                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="department"
                    name="department"
                    required
                    value={formData.department}
                    onChange={handleChange}
                    className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Select department</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                
                {/* Job Title */}
                <div>
                  <label htmlFor="job_title" className="block text-sm font-medium text-gray-700">
                    Job Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="job_title"
                    id="job_title"
                    required
                    value={formData.job_title}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
            
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Salary Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Salary Amount */}
                <div>
                  <label htmlFor="salary_amount" className="block text-sm font-medium text-gray-700">
                    Salary Amount <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      name="salary_amount"
                      id="salary_amount"
                      required
                      min="0"
                      step="0.01"
                      value={formData.salary_amount}
                      onChange={handleChange}
                      className="mt-1 block w-full pl-7 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
                
                {/* Payment Frequency */}
                <div>
                  <label htmlFor="payment_frequency" className="block text-sm font-medium text-gray-700">
                    Payment Frequency <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="payment_frequency"
                    name="payment_frequency"
                    required
                    value={formData.payment_frequency}
                    onChange={handleChange}
                    className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="Bi-Weekly">Bi-Weekly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                </div>
                
                {/* Hourly Rate */}
                <div>
                  <label htmlFor="hourly_rate" className="block text-sm font-medium text-gray-700">
                    Hourly Rate
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      name="hourly_rate"
                      id="hourly_rate"
                      min="0"
                      step="0.01"
                      value={formData.hourly_rate || ''}
                      onChange={handleChange}
                      className="mt-1 block w-full pl-7 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Leave blank if salaried employee</p>
                </div>
                
                {/* Exemption Status Section */}
                <div className="md:col-span-2 mt-4">
                  <h3 className="text-md font-medium text-gray-700 mb-2">Exemption Status</h3>
                  
                  <div className="space-y-4">
                    {/* Social Security Exemption */}
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="is_exempt_ss"
                          name="is_exempt_ss"
                          type="checkbox"
                          checked={formData.is_exempt_ss}
                          onChange={handleChange}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="is_exempt_ss" className="font-medium text-gray-700">
                          Exempt from Social Security
                        </label>
                        <p className="text-gray-500">Employee is exempt from Social Security contributions</p>
                      </div>
                    </div>
                    
                    {/* Medical Benefits Exemption */}
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="is_exempt_medical"
                          name="is_exempt_medical"
                          type="checkbox"
                          checked={formData.is_exempt_medical}
                          onChange={handleChange}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="is_exempt_medical" className="font-medium text-gray-700">
                          Exempt from Medical Benefits
                        </label>
                        <p className="text-gray-500">Employee is exempt from Medical Benefits contributions</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => router.push('/dashboard/employees')}
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
                {loading ? 'Saving...' : 'Save Employee'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

// Use the Dashboard layout for this page
AddEmployee.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
