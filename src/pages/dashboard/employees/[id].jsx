import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployeeById, updateEmployee, resetEmployeeState } from '@/redux/slices/employeeSlice';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { toast } from 'react-toastify';

export default function EmployeeDetails() {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch();
  const { employee, loading, error, success } = useSelector((state) => state.employees);
  
  const [isEditing, setIsEditing] = useState(false);
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
    department_id: '',
    employee_type: '',
    salary_amount: '',
    payment_frequency: 'Monthly',
    hourly_rate: null,
    standard_hours: 40,
    is_exempt_ss: false,
    is_exempt_medical: false,
    status: 'active'
  });
  
  useEffect(() => {
    // Reset employee state on component unmount
    return () => {
      dispatch(resetEmployeeState());
    };
  }, [dispatch]);
  
  useEffect(() => {
    if (id) {
      dispatch(fetchEmployeeById(id));
    }
  }, [dispatch, id]);
  
  // Populate form when employee data is loaded
  useEffect(() => {
    if (employee) {
      setFormData({
        employee_id: employee.id || '',
        first_name: employee.first_name || '',
        last_name: employee.last_name || '',
        email: employee.email || '',
        date_of_birth: employee.date_of_birth ? new Date(employee.date_of_birth).toISOString().split('T')[0] : '',
        gender: employee.gender || '',
        address: employee.address || '',
        phone: employee.phone || '',
        hire_date: employee.hire_date ? new Date(employee.hire_date).toISOString().split('T')[0] : '',
        job_title: employee.job_title || '',
        department: employee.department || '',
        department_id: employee.department_id || '',
        employee_type: employee.employee_type || '',
        salary_amount: employee.salary_amount || '',
        payment_frequency: employee.payment_frequency || 'Monthly',
        hourly_rate: employee.hourly_rate || null,
        standard_hours: employee.standard_hours || 40,
        is_exempt_ss: employee.is_exempt_ss || false,
        is_exempt_medical: employee.is_exempt_medical || false,
        status: employee.status || 'active'
      });
    }
  }, [employee]);
  
  // Handle success state changes
  useEffect(() => {
    if (success) {
      setIsEditing(false);
    }
  }, [success]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    let updatedData = {
      ...formData,
      [name]: type === 'checkbox' ? checked : 
              name === 'salary_amount' ? parseFloat(value) || '' :
              name === 'hourly_rate' ? (value === '' ? null : parseFloat(value)) :
              value
    };
    
    // If changing employee type to hourly or private_duty_nurse, set salary to 0
    if (name === 'employee_type' && (value === 'hourly' || value === 'private_duty_nurse')) {
      updatedData.salary_amount = 0;
    }
    
    setFormData(updatedData);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Clean up the data before sending
      const cleanedData = { ...formData };
      
      // Validate required fields
      if (!cleanedData.employee_id || cleanedData.employee_id.trim() === '') {
        toast.error('Employee ID is required');
        return;
      }
      
      if (!cleanedData.first_name || cleanedData.first_name.trim() === '') {
        toast.error('First Name is required');
        return;
      }
      
      if (!cleanedData.last_name || cleanedData.last_name.trim() === '') {
        toast.error('Last Name is required');
        return;
      }
      
      if (!cleanedData.employee_type) {
        toast.error('Employee type is required');
        return;
      }
      
      if (!cleanedData.status) {
        toast.error('Status is required');
        return;
      }
      
      // Only validate salary amount for salaried employees
      if (cleanedData.employee_type !== 'hourly' && cleanedData.employee_type !== 'private_duty_nurse' && !cleanedData.salary_amount) {
        toast.error('Salary amount is required for salaried employees');
        return;
      }
      
      if (!cleanedData.payment_frequency) {
        toast.error('Payment frequency is required');
        return;
      }
      
      // Conditional validation for hourly employees and private duty nurses
      if ((cleanedData.employee_type === 'hourly' || cleanedData.employee_type === 'private_duty_nurse') && !cleanedData.hourly_rate) {
        toast.error('Hourly rate is required for hourly employees and private duty nurses');
        return;
      }
      
      // Ensure salary is set to 0 for hourly employees and private duty nurses
      if (cleanedData.employee_type === 'hourly' || cleanedData.employee_type === 'private_duty_nurse') {
        cleanedData.salary_amount = 0;
      }
      
      // Remove hourly_rate if it's null or empty (for salaried employees)
      if (cleanedData.hourly_rate === null || cleanedData.hourly_rate === '') {
        delete cleanedData.hourly_rate;
      }
      
      // Convert numeric fields to appropriate types
      if (cleanedData.salary_amount) cleanedData.salary_amount = parseFloat(cleanedData.salary_amount);
      if (cleanedData.hourly_rate) cleanedData.hourly_rate = parseFloat(cleanedData.hourly_rate);
      if (cleanedData.standard_hours) cleanedData.standard_hours = parseFloat(cleanedData.standard_hours);
      if (cleanedData.department_id) cleanedData.department_id = parseInt(cleanedData.department_id, 10);
      
      const resultAction = await dispatch(updateEmployee({ id, data: cleanedData }));
      if (updateEmployee.fulfilled.match(resultAction)) {
        toast.success('Employee updated successfully!');
      } else if (updateEmployee.rejected.match(resultAction)) {
        toast.error(resultAction.payload || 'Failed to update employee');
      }
    } catch (err) {
      console.error('Failed to update employee:', err);
      toast.error('Failed to update employee');
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
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 p-4 text-sm text-red-700 rounded-md">
        {error}
      </div>
    );
  }
  
  return (
    <>
      <Head>
        <title>{`${isEditing ? 'Edit Employee' : 'Employee Details'} | Payroll System`}</title>
        <meta name="description" content="View or edit employee details in your payroll system" />
      </Head>
      
      <div className="py-6">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Edit Employee' : 'Employee Details'}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {isEditing 
                ? 'Update employee information' 
                : `Viewing information for ${employee?.first_name || ''} ${employee?.last_name || ''}`}
            </p>
          </div>
          
          <div className="flex space-x-3">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Edit Employee
              </button>
            )}
            <button
              onClick={() => router.push('/dashboard/employees')}
              className="px-4 py-2 border border-gray-300 rounded-md shadow text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Back to List
            </button>
          </div>
        </div>
        
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          {isEditing ? (
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
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
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
                  
                  {/* Status */}
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="status"
                      name="status"
                      required
                      value={formData.status}
                      onChange={handleChange}
                      className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Salary Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Employee Type */}
                  <div>
                    <label htmlFor="employee_type" className="block text-sm font-medium text-gray-700">
                      Employee Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="employee_type"
                      name="employee_type"
                      required
                      value={formData.employee_type}
                      onChange={handleChange}
                      className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="">Select employee type</option>
                      <option value="salary">Salary</option>
                      <option value="hourly">Hourly</option>
                      <option value="private_duty_nurse">Private Duty Nurse</option>
                    </select>
                  </div>
                  
                  {/* Salary Amount */}
                  <div>
                    <label htmlFor="salary_amount" className="block text-sm font-medium text-gray-700">
                      Salary Amount {formData.employee_type !== 'hourly' && formData.employee_type !== 'private_duty_nurse' && <span className="text-red-500">*</span>}
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        name="salary_amount"
                        id="salary_amount"
                        required={formData.employee_type !== 'hourly' && formData.employee_type !== 'private_duty_nurse'}
                        disabled={formData.employee_type === 'hourly' || formData.employee_type === 'private_duty_nurse'}
                        min="0"
                        step="0.01"
                        value={formData.employee_type === 'hourly' || formData.employee_type === 'private_duty_nurse' ? 0 : formData.salary_amount}
                        onChange={handleChange}
                        className={`mt-1 block w-full pl-7 border ${(formData.employee_type === 'hourly' || formData.employee_type === 'private_duty_nurse') ? 'bg-gray-100 text-gray-500' : ''} border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                      />
                    </div>
                    {(formData.employee_type === 'hourly' || formData.employee_type === 'private_duty_nurse') && (
                      <p className="mt-1 text-xs text-gray-500">Salary set to 0 for hourly employees and private duty nurses</p>
                    )}
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
                      <option value="Monthly">Monthly</option>
                      <option value="Bi-Weekly">Bi-Weekly</option>
                      <option value="Semi-Monthly">Semi-Monthly</option>
                    </select>
                  </div>
                  
                  {/* Hourly Rate */}
                  <div>
                    <label htmlFor="hourly_rate" className="block text-sm font-medium text-gray-700">
                      Hourly Rate {(formData.employee_type === 'hourly' || formData.employee_type === 'private_duty_nurse') && <span className="text-red-500">*</span>}
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
                        required={formData.employee_type === 'hourly' || formData.employee_type === 'private_duty_nurse'}
                        value={formData.hourly_rate || ''}
                        onChange={handleChange}
                        className="mt-1 block w-full pl-7 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      {formData.employee_type === 'hourly' || formData.employee_type === 'private_duty_nurse' 
                        ? 'Required for hourly employees and private duty nurses' 
                        : 'Leave blank if not an hourly employee or private duty nurse'}
                    </p>
                  </div>
                  
                  {/* Standard Hours */}
                  <div>
                    <label htmlFor="standard_hours" className="block text-sm font-medium text-gray-700">
                      Standard Hours Per Week
                    </label>
                    <input
                      type="number"
                      name="standard_hours"
                      id="standard_hours"
                      min="0"
                      step="1"
                      value={formData.standard_hours}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    <p className="mt-1 text-xs text-gray-500">Default: 40 hours per week</p>
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
            <div className="divide-y divide-gray-200">
              {/* Personal Information Section */}
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h2>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Employee ID</dt>
                    <dd className="mt-1 text-sm text-gray-900">{employee?.employee_id}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                    <dd className="mt-1 text-sm text-gray-900">{employee?.first_name} {employee?.last_name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email Address</dt>
                    <dd className="mt-1 text-sm text-gray-900">{employee?.email || '-'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Phone Number</dt>
                    <dd className="mt-1 text-sm text-gray-900">{employee?.phone}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {employee?.date_of_birth ? new Date(employee.date_of_birth).toLocaleDateString() : '-'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Gender</dt>
                    <dd className="mt-1 text-sm text-gray-900">{employee?.gender || '-'}</dd>
                  </div>
                  <div className="md:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Address</dt>
                    <dd className="mt-1 text-sm text-gray-900 whitespace-pre-line">{employee?.address}</dd>
                  </div>
                </dl>
              </div>
              
              {/* Employment Information Section */}
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Employment Information</h2>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Hire Date</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {employee?.hire_date ? new Date(employee.hire_date).toLocaleDateString() : '-'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Department</dt>
                    <dd className="mt-1 text-sm text-gray-900">{employee?.department || '-'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Job Title</dt>
                    <dd className="mt-1 text-sm text-gray-900">{employee?.job_title || '-'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Employee Type</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {employee?.employee_type ? (
                        <span className="capitalize">{employee.employee_type.replace('_', ' ')}</span>
                      ) : '-'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        employee?.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {employee?.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>
              
              {/* Salary Information Section */}
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Salary Information</h2>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  {employee?.employee_type !== 'hourly' && employee?.employee_type !== 'private_duty_nurse' && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Salary Amount</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        ${employee?.salary_amount ? parseFloat(employee.salary_amount).toFixed(2) : '0.00'}
                      </dd>
                    </div>
                  )}
                  
                  {(employee?.employee_type === 'hourly' || employee?.employee_type === 'private_duty_nurse') && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Hourly Rate</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        ${employee?.hourly_rate ? parseFloat(employee.hourly_rate).toFixed(2) : '0.00'}/hour
                      </dd>
                    </div>
                  )}
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Payment Frequency</dt>
                    <dd className="mt-1 text-sm text-gray-900">{employee?.payment_frequency || '-'}</dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Standard Hours Per Week</dt>
                    <dd className="mt-1 text-sm text-gray-900">{employee?.standard_hours || 40}</dd>
                  </div>
                  
                  <div className="md:col-span-2 mt-2">
                    <dt className="text-sm font-medium text-gray-500 mb-2">Exemption Status</dt>
                    <dd className="mt-1 text-sm text-gray-900 space-y-2">
                      <div className="flex items-center">
                        <span className={`h-4 w-4 rounded border ${employee?.is_exempt_ss ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                          {employee?.is_exempt_ss && (
                            <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </span>
                        <span className="ml-2">Exempt from Social Security</span>
                      </div>
                      <div className="flex items-center">
                        <span className={`h-4 w-4 rounded border ${employee?.is_exempt_medical ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                          {employee?.is_exempt_medical && (
                            <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </span>
                        <span className="ml-2">Exempt from Medical Benefits</span>
                      </div>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Use the Dashboard layout for this page
EmployeeDetails.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
