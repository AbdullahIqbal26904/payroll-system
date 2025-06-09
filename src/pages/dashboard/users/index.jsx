import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '@/redux/slices/userSlice';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { PencilIcon, TrashIcon, KeyIcon } from '@heroicons/react/24/outline';

export default function UsersList() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.users);
  
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);
  
  const handleEdit = (id) => {
    router.push(`/dashboard/users/edit/${id}`);
  };
  
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      // Will implement delete functionality
    }
  };
  
  const handleResetPassword = (id) => {
    router.push(`/dashboard/users/reset-password/${id}`);
  };
  
  const handleAddUser = () => {
    router.push('/dashboard/users/add');
  };
  
  return (
    <>
      <Head>
        <title>Users | Payroll System</title>
        <meta name="description" content="Manage users in your payroll system" />
      </Head>
      
      <div className="py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Users</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage system users and their access rights
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <button
              onClick={handleAddUser}
              className="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add User
            </button>
          </div>
        </div>
        
        {/* Users Table */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 p-4 text-sm text-red-700 rounded-md">
              {error}
            </div>
          ) : users?.length === 0 ? (
            <div className="text-center py-16 px-4">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No users found</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by adding a new user.</p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleAddUser}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Add User
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created At
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users?.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleResetPassword(user.id)}
                          className="text-gray-600 hover:text-gray-900 mr-4"
                          title="Reset Password"
                        >
                          <KeyIcon className="h-5 w-5" />
                          <span className="sr-only">Reset Password</span>
                        </button>
                        <button
                          onClick={() => handleEdit(user.id)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                          title="Edit User"
                        >
                          <PencilIcon className="h-5 w-5" />
                          <span className="sr-only">Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete User"
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
        </div>
      </div>
    </>
  );
}

// Use the Dashboard layout for this page
UsersList.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
