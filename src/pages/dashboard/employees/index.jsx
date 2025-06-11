import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployees, deleteEmployee } from '@/redux/slices/employeeSlice';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

export default function EmployeesList() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { employees, totalEmployees, loading, error } = useSelector((state) => state.employees);
  
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');
  
  useEffect(() => {
    dispatch(fetchEmployees({ page, limit, search, sortBy, sortOrder }));
  }, [dispatch, page, limit, search, sortBy, sortOrder]);
  
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page when searching
  };
  
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };
  
  const handleEdit = (id) => {
    router.push(`/dashboard/employees/edit/${id}`);
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        const resultAction = await dispatch(deleteEmployee(id));
        if (deleteEmployee.fulfilled.match(resultAction)) {
          toast.success('Employee deleted successfully!');
        }
      } catch (err) {
        console.error('Failed to delete employee:', err);
        toast.error('Failed to delete employee');
      }
    }
  };
  
  const handleAddEmployee = () => {
    router.push('/dashboard/employees/add');
  };
  
  return (
    <>
      <Head>
        <title>Employees | Payroll System</title>
        <meta name="description" content="Manage employees in your payroll system" />
      </Head>
      
      <div className="py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your employees and their information
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <button
              onClick={handleAddEmployee}
              className="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Employee
            </button>
          </div>
        </div>
        
        {/* Search and filters */}
        <div className="bg-white shadow-sm rounded-lg mb-6 p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="w-full md:w-64">
              <label htmlFor="search" className="sr-only">Search</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="search"
                  value={search}
                  onChange={handleSearchChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search employees..."
                />
              </div>
            </div>
            
            <div className="flex flex-row gap-4">
              <select
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="block w-full py-2 pl-3 pr-10 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Employees Table */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 p-4 text-sm text-red-700 rounded-md">
              {error}
            </div>
          ) : employees?.length === 0 ? (
            <div className="text-center py-16 px-4">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No employees found</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by adding a new employee.</p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleAddEmployee}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Add Employee
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('id')}
                    >
                      ID {sortBy === 'id' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('first_name')}
                    >
                      Name {sortBy === 'first_name' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('email')}
                    >
                      Email {sortBy === 'email' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('job_title')}
                    >
                      Job Title {sortBy === 'job_title' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('department')}
                    >
                      Department {sortBy === 'department' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {employees?.map((employee) => (
                    <tr key={employee.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{employee.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {employee.first_name} {employee.last_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.job_title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.department}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(employee.id)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          <PencilIcon className="h-5 w-5" />
                          <span className="sr-only">Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(employee.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="h-5 w-5" />
                          <span className="sr-only">Delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Pagination */}
          {!loading && employees?.length > 0 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{((page - 1) * limit) + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(page * limit, totalEmployees || 0)}
                    </span>{' '}
                    of <span className="font-medium">{totalEmployees || 0}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setPage(page - 1)}
                      disabled={page <= 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                        page <= 1
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span className="sr-only">Previous</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    
                    {/* Page numbers would go here in a more complete implementation */}
                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium">
                      Page {page}
                    </span>
                    
                    <button
                      onClick={() => setPage(page + 1)}
                      disabled={page * limit >= totalEmployees}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                        page * limit >= totalEmployees
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span className="sr-only">Next</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Use the Dashboard layout for this page
EmployeesList.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
