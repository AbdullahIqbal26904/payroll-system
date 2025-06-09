import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/redux/slices/authSlice';
import { cn } from '@/lib/utils';
import {
  BellIcon,
  MagnifyingGlassIcon,
  SunIcon,
  MoonIcon,
  ChevronDownIcon,
  Bars3Icon
} from '@heroicons/react/24/outline';

export default function DashboardNavbar({ sidebarOpen, setSidebarOpen }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const profileRef = useRef(null);
  const notificationsRef = useRef(null);
  
  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };
  
  // Sample notifications - in a real app, these would come from an API
  const notifications = [
    {
      id: 1,
      title: 'New Employee Added',
      message: 'Jane Smith has been added to the system',
      time: '5 minutes ago',
      read: false,
    },
    {
      id: 2,
      title: 'Payroll Processing',
      message: 'Monthly payroll has been processed successfully',
      time: '1 hour ago',
      read: false,
    },
    {
      id: 3,
      title: 'System Update',
      message: 'The system will be down for maintenance tonight at 10 PM',
      time: '2 hours ago',
      read: true,
    },
  ];
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // You can implement actual dark mode functionality here
  };
  
  // Calculate unread notifications count
  const unreadCount = notifications.filter(notification => !notification.read).length;
  
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6">
      {/* Left section: Mobile menu button and search bar */}
      <div className="flex items-center">
        <button
          className="lg:hidden mr-2 p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          onClick={() => setSidebarOpen(true)}
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
        
        <div className="relative hidden md:block">
          <input
            type="text"
            className="w-72 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Search..."
          />
          <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>
      
      {/* Right section: User profile, notifications, etc. */}
      <div className="flex items-center space-x-3">
        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-1.5 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100"
        >
          {darkMode ? (
            <SunIcon className="h-5 w-5" />
          ) : (
            <MoonIcon className="h-5 w-5" />
          )}
        </button>
        
        {/* Notifications dropdown */}
        <div className="relative" ref={notificationsRef}>
          <button
            className="p-1.5 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 relative"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
          >
            <BellIcon className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 inline-block h-4 w-4 rounded-full bg-red-500 text-xs text-white font-medium flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="text-xs text-blue-600 cursor-pointer hover:text-blue-800">
                      Mark all as read
                    </span>
                  )}
                </div>
              </div>
              
              <div className="max-h-64 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map(notification => (
                    <div
                      key={notification.id}
                      className={cn(
                        "px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-200 last:border-0",
                        !notification.read && "bg-blue-50"
                      )}
                    >
                      <div className="flex justify-between">
                        <span className="font-medium text-sm text-gray-900">{notification.title}</span>
                        <span className="text-xs text-gray-500">{notification.time}</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-500">No notifications</div>
                )}
              </div>
              
              <div className="px-4 py-2 border-t border-gray-200">
                <Link 
                  href="/dashboard/notifications"
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  View all notifications
                </Link>
              </div>
            </div>
          )}
        </div>
        
        {/* User profile dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            className="flex items-center space-x-2 p-1.5 rounded-md hover:bg-gray-100"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-700">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-500">{user?.role || 'Admin'}</p>
            </div>
            <ChevronDownIcon className="h-4 w-4 text-gray-500" />
          </button>
          
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-200">
                <p className="font-medium text-gray-900">{user?.name || 'User'}</p>
                <p className="text-sm text-gray-500 truncate">{user?.email || 'user@example.com'}</p>
              </div>
              
              <div className="py-1">
                <Link
                  href="/dashboard/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Your Profile
                </Link>
                <Link
                  href="/dashboard/settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Settings
                </Link>
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    handleLogout();
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
