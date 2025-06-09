import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployees } from '@/redux/slices/employeeSlice';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { CurrencyDollarIcon, DocumentReportIcon } from '@heroicons/react/24/outline';

export default function CalculatePayroll() {
  const dispatch = useDispatch();
  const { employees, loading } = useSelector((state) => state.employees);
  
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [payPeriod, setPayPeriod] = useState({
    startDate: '',
    endDate: ''
  });
  const [deductions, setDeductions] = useState({
    tax: 15, // Default tax percentage
    insurance: 5, // Default insurance percentage
    otherDeductions: 0 // Default other deductions
  });
  
  useEffect(() => {
    dispatch(fetchEmployees({ limit: 100 })); // Get up to 100 employees for payroll calculation
  }, [dispatch]);
  
  // Handle checkbox selection of employees
  const handleEmployeeSelection = (e, employeeId) => {
    if (e.target.checked) {
      setSelectedEmployees([...selectedEmployees, employeeId]);
    } else {
      setSelectedEmployees(selectedEmployees.filter(id => id !== employeeId));
    }
  };
  
  // Handle select all employees checkbox
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = employees.map(emp => emp.id);
      setSelectedEmployees(allIds);
    } else {
      setSelectedEmployees([]);
    }
  };
  
  // Handle date range changes
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setPayPeriod({
      ...payPeriod,
      [name]: value
    });
  };
  
  // Handle deduction changes
  const handleDeductionChange = (e) => {
    const { name, value } = e.target;
    setDeductions({
      ...deductions,
      [name]: parseFloat(value) || 0
    });
  };
  
  // Calculate payroll function
  const calculatePayroll = (e) => {
    e.preventDefault();
    
    if (selectedEmployees.length === 0) {
      alert('Please select at least one employee');
      return;
    }
    
    if (!payPeriod.startDate || !payPeriod.endDate) {
      alert('Please set the pay period dates');
      return;
    }
    
    // In a real app, this would be an API call to calculate payroll
    alert('Payroll calculation would be sent to the server here');
  };
  
  return (
    <>
      <Head>
        <title>Calculate Payroll | Payroll System</title>
        <meta name="description" content="Calculate payroll for your employees" />
      </Head>
      
      <div className="py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Calculate Payroll</h1>
          <p className="mt-1 text-sm text-gray-500">
            Generate payroll calculations for your employees
          </p>
        </div>
        
        <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Pay Period</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={payPeriod.startDate}
                  onChange={handleDateChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                  End Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={payPeriod.endDate}
                  onChange={handleDateChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Deductions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="tax" className="block text-sm font-medium text-gray-700">
                  Tax Percentage (%)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="number"
                    id="tax"
                    name="tax"
                    min="0"
                    step="0.01"
                    value={deductions.tax}
                    onChange={handleDeductionChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="insurance" className="block text-sm font-medium text-gray-700">
                  Insurance Percentage (%)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="number"
                    id="insurance"
                    name="insurance"
                    min="0"
                    step="0.01"
                    value={deductions.insurance}
                    onChange={handleDeductionChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="otherDeductions" className="block text-sm font-medium text-gray-700">
                  Other Deductions (%)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="number"
                    id="otherDeductions"
                    name="otherDeductions"
                    min="0"
                    step="0.01"
                    value={deductions.otherDeductions}
                    onChange={handleDeductionChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Select Employees</h2>
            
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      onChange={handleSelectAll}
                      checked={selectedEmployees.length === employees?.length && employees?.length > 0}
                    />
                    <span className="ml-2 text-sm text-gray-700">Select All</span>
                  </label>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Select
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Job Title
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Department
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Salary
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {employees?.map((employee) => (
                        <tr key={employee.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                              checked={selectedEmployees.includes(employee.id)}
                              onChange={(e) => handleEmployeeSelection(e, employee.id)}
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {employee.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {employee.first_name} {employee.last_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {employee.job_title}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {employee.department}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${employee.salary_amount?.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                      
                      {employees?.length === 0 && (
                        <tr>
                          <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                            No employees found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
          
          <div className="px-6 py-4 bg-gray-50 flex justify-end">
            <button
              type="button"
              onClick={calculatePayroll}
              disabled={loading}
              className={`flex items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              <CurrencyDollarIcon className="mr-2 h-5 w-5" />
              Calculate Payroll
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// Use the Dashboard layout for this page
CalculatePayroll.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
