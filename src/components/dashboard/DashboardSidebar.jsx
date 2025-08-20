import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/redux/slices/authSlice';
import { cn } from '@/lib/utils';
import BuildingIcon from './BuildingIcon';
import {
  HomeIcon,
  UsersIcon,
  UserIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  CalendarIcon,
  ArrowRightOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

// Navigation menu items
const menuItems = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { 
    name: 'Employees', 
    href: '/dashboard/employees', 
    icon: UsersIcon,
    submenu: [
      { name: 'All Employees', href: '/dashboard/employees' },
      { name: 'Add Employee', href: '/dashboard/employees/add' },
    ]
  },
  { 
    name: 'Departments', 
    href: '/dashboard/departments', 
    icon: BuildingIcon 
  },
  { 
    name: 'Payroll', 
    href: '/dashboard/payroll', 
    icon: CurrencyDollarIcon,
    submenu: [
      { name: 'Calculate Payroll', href: '/dashboard/payroll/calculate' },
      { name: 'Payroll History', href: '/dashboard/payroll/reports' },
      { name: 'Upload Timesheet', href: '/dashboard/payroll/upload-timesheet' },
      { name: 'Timesheet Periods', href: '/dashboard/payroll/timesheet-periods' },
      { name: 'Email Paystubs', href: '/dashboard/payroll/email-paystubs' },
      { name: 'Paid Holidays', href: '/dashboard/payroll/holidays' },
      { name: 'Payroll Settings', href: '/dashboard/payroll/settings' },
    ]
  },
  { 
    name: 'Vacation', 
    href: '/dashboard/vacation', 
    icon: CalendarIcon,
    submenu: [
      { name: 'Vacation Dashboard', href: '/dashboard/vacation' },
      { name: 'Initialize Vacation', href: '/dashboard/vacation/initialize' },
    ]
  },
  { 
    name: 'Employee Loans', 
    href: '/dashboard/employeeLoans', 
    icon: DocumentTextIcon,
    submenu: [
      { name: 'All Loans', href: '/dashboard/employeeLoans' },
      { name: 'Add Loan', href: '/dashboard/employeeLoans/add' },
      { name: 'Add Third-Party Loan', href: '/dashboard/employeeLoans/add-third-party' },
      { name: 'Third-Party Payments', href: '/dashboard/employeeLoans/third-party-payments' },
    ]
  },
  { name: 'Reports', href: '/dashboard/reports', icon: ChartBarIcon },
  { 
    name: 'Users', 
    href: '/dashboard/users', 
    icon: UserIcon,
    submenu: [
      { name: 'All Users', href: '/dashboard/users' },
      { name: 'Add User', href: '/dashboard/users/add' },
    ]
  }
];

export default function DashboardSidebar({ sidebarOpen, setSidebarOpen }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  // Create state for submenu open/closed status
  const [submenuStates, setSubmenuStates] = useState(() => {
    // Initialize with menu items that should be open based on current path
    const initialStates = {};
    menuItems.forEach((item, index) => {
      const isActive = item.href === '/dashboard' 
        ? router.pathname === '/dashboard' 
        : router.pathname === item.href || router.pathname.startsWith(`${item.href}/`);
      initialStates[index] = isActive;
    });
    return initialStates;
  });

  // Function to toggle submenu open/closed state
  const toggleSubmenu = (index) => {
    setSubmenuStates(prevStates => ({
      ...prevStates,
      [index]: !prevStates[index]
    }));
  };
  
  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };
  
  return (
    <>
      {/* Mobile sidebar backdrop */}
      <div 
        className={cn(
          "fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden transition-opacity duration-300",
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />
      
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 shadow-sm transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Sidebar header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          <Link href="/dashboard" className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded bg-blue-600 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-lg font-semibold text-gray-900">Payroll</div>
          </Link>
          <button 
            className="lg:hidden p-1 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            onClick={() => setSidebarOpen(false)}
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
        </div>
        
        {/* Sidebar content */}
        <div className="flex flex-col h-[calc(100vh-4rem)] overflow-y-auto">
          <nav className="flex-1 px-2 py-4 space-y-1">
            {menuItems.map((item, index) => {
              // Special case for Dashboard to prevent it from being active on all dashboard/* routes
              const isActive = item.href === '/dashboard' 
                ? router.pathname === '/dashboard' 
                : router.pathname === item.href || router.pathname.startsWith(`${item.href}/`);
              // Get submenu open state from centralized state
              const submenuOpen = submenuStates[index];
              
              // If this menu item has a submenu
              if (item.submenu) {
                return (
                  <div key={item.name} className="space-y-1">
                    <button
                      onClick={() => toggleSubmenu(index)}
                      className={cn(
                        "w-full group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md",
                        isActive
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700 hover:text-blue-700 hover:bg-gray-50"
                      )}
                    >
                      <div className="flex items-center">
                        <item.icon
                          className={cn(
                            "mr-3 h-5 w-5",
                            isActive ? "text-blue-500" : "text-gray-500 group-hover:text-blue-500"
                          )}
                        />
                        {item.name}
                      </div>
                      <ChevronRightIcon
                        className={cn(
                          "h-4 w-4 text-gray-400 transition-transform",
                          submenuOpen && "transform rotate-90"
                        )}
                      />
                    </button>
                    
                    {/* Submenu */}
                    {submenuOpen && (
                      <div className="pl-10 space-y-1">
                        {item.submenu.map((subitem) => {
                          const isSubActive = router.pathname === subitem.href;
                          return (
                            <Link
                              key={subitem.name}
                              href={subitem.href}
                              className={cn(
                                "group flex items-center px-3 py-2 text-sm font-medium rounded-md",
                                isSubActive
                                  ? "bg-blue-50 text-blue-700"
                                  : "text-gray-700 hover:text-blue-700 hover:bg-gray-50"
                              )}
                            >
                              {subitem.name}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }
              
              // Regular menu item without submenu
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-3 py-2 text-sm font-medium rounded-md",
                    isActive 
                      ? "bg-blue-50 text-blue-700" 
                      : "text-gray-700 hover:text-blue-700 hover:bg-gray-50"
                  )}
                >
                  <item.icon 
                    className={cn(
                      "mr-3 h-5 w-5",
                      isActive ? "text-blue-500" : "text-gray-500 group-hover:text-blue-500"
                    )} 
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          
          {/* User account section */}
          <div className="p-4 border-t border-gray-200 space-y-2">
            <Link 
              href="/dashboard/account-settings" 
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 hover:text-blue-700"
            >
              <UserIcon className="mr-3 h-5 w-5 text-gray-500" />
              Account Settings
            </Link>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50"
            >
              <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 text-red-500" />
              Sign out
            </button>
          </div>
        </div>
      </aside>
      
      {/* Sidebar toggle button (visible on mobile) */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed z-40 bottom-4 left-4 p-2 rounded-full bg-blue-600 text-white shadow-lg lg:hidden"
        >
          <ChevronRightIcon className="h-6 w-6" />
        </button>
      )}
    </>
  );
}
