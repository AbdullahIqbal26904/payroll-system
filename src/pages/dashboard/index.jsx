import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployees } from '@/redux/slices/employeeSlice';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { 
  UserGroupIcon, 
  CurrencyDollarIcon, 
  DocumentTextIcon, 
  ArrowUpIcon, 
  ArrowDownIcon 
} from '@heroicons/react/24/outline';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { employees, totalEmployees, loading: employeesLoading } = useSelector((state) => state.employees);
  
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activePayrolls: 3,
    monthlyExpenses: 0,
    pendingRequests: 7
  });
  
  // Fetch employees data
  useEffect(() => {
    dispatch(fetchEmployees({ page: 1, limit: 10 }));
  }, [dispatch]);
  
  // Update stats when employees data changes
  useEffect(() => {
    if (totalEmployees !== undefined) {
      let totalSalary = 0;
      if (employees && employees.length > 0) {
        totalSalary = employees.reduce((sum, employee) => sum + (employee.salary_amount || 0), 0);
      }
      
      setStats(prev => ({
        ...prev,
        totalEmployees: totalEmployees,
        monthlyExpenses: totalSalary
      }));
    }
  }, [employees, totalEmployees]);

  // Recent activity - in a real app, this would come from the API
  const recentActivity = [
    { id: 1, action: 'Payroll processed', user: 'John Doe', date: '10 Jun 2025', time: '10:30 AM' },
    { id: 2, action: 'New employee added', user: 'Jane Smith', date: '09 Jun 2025', time: '3:45 PM' },
    { id: 3, action: 'Attendance updated', user: 'Mike Johnson', date: '08 Jun 2025', time: '2:15 PM' },
    { id: 4, action: 'Leave request approved', user: 'Sarah Williams', date: '07 Jun 2025', time: '11:05 AM' },
    { id: 5, action: 'Password changed', user: 'David Brown', date: '06 Jun 2025', time: '9:20 AM' }
  ];

  return (
    <>
      <Head>
        <title>Dashboard | Payroll System</title>
        <meta name="description" content="Admin dashboard for the payroll system" />
      </Head>

      <div>
        {/* Welcome message */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name || 'Admin'}!</h1>
          <p className="text-gray-500">Here's what's happening with your payroll system today.</p>
        </div>
        
        {/* Stats overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Employees */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Employees</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.totalEmployees}</h3>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <UserGroupIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-xs font-medium text-green-500">+2.5% </span>
              <span className="text-xs text-gray-500 ml-2">from last month</span>
            </div>
          </div>
          
          {/* Active Payrolls */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Active Payrolls</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.activePayrolls}</h3>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DocumentTextIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <span className="text-xs text-gray-500">No change</span>
            </div>
          </div>
          
          {/* Monthly Expenses */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Monthly Expenses</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">${stats.monthlyExpenses.toLocaleString()}</h3>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <CurrencyDollarIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <ArrowUpIcon className="h-4 w-4 text-red-500 mr-1" />
              <span className="text-xs font-medium text-red-500">+4.3% </span>
              <span className="text-xs text-gray-500 ml-2">from last month</span>
            </div>
          </div>
          
          {/* Pending Requests */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending Requests</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.pendingRequests}</h3>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <DocumentTextIcon className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <ArrowDownIcon className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-xs font-medium text-green-500">-12% </span>
              <span className="text-xs text-gray-500 ml-2">from last week</span>
            </div>
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="font-semibold text-lg text-gray-900">Recent Activity</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentActivity.map((activity) => (
                  <tr key={activity.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {activity.action}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {activity.user}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {activity.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {activity.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

// Use the Dashboard layout for this page
Dashboard.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
