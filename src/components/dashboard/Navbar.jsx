'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn, getInitials } from '@/lib/utils';
import { 
  MagnifyingGlassIcon,
  BellIcon,
  EnvelopeIcon,
  MoonIcon,
  SunIcon,
  Bars3Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

// Dummy user data - in a real app, this would come from authentication context
const user = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  role: 'Administrator',
  avatar: null
};

// Dummy notification data
const notifications = [
  {
    id: 1,
    title: 'New Salary Approved',
    description: 'Your salary increase has been approved.',
    time: '2 min ago',
    read: false,
  },
  {
    id: 2,
    title: 'Meeting Reminder',
    description: 'HR meeting starts in 30 minutes',
    time: '30 min ago',
    read: false,
  },
  {
    id: 3,
    title: 'Document Uploaded',
    description: 'New policy document has been uploaded',
    time: '1 hour ago',
    read: true,
  },
  {
    id: 4,
    title: 'System Maintenance',
    description: 'The system will be down for maintenance tonight',
    time: '3 hours ago',
    read: true,
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const [darkMode, setDarkMode] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const notificationsRef = useRef(null);
  const profileRef = useRef(null);
  
  // Generate breadcrumbs from pathname
  const generateBreadcrumbs = () => {
    if (pathname === '/dashboard') {
      return [{ label: 'Dashboard', path: '/dashboard' }];
    }
    
    const segments = pathname
      .split('/')
      .filter(segment => segment !== '')
      .map((segment, index, segments) => {
        const path = `/${segments.slice(0, index + 1).join('/')}`;
        return {
          label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
          path,
        };
      });
    
    return segments;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Handle clicks outside of dropdown menus
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (notificationsRef.current && !notificationsRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Check for dark mode preference on initial load
  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark') || 
                      window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDarkMode);
  }, []);

  return (
    <header className="h-[var(--navbar-height)] bg-white dark:bg-secondary-800 border-b border-secondary-200 dark:border-secondary-700 px-4 flex items-center justify-between z-10">
      {/* Left section: Mobile menu toggle & Breadcrumbs */}
      <div className="flex items-center space-x-4">
        <button 
          className="md:hidden p-1.5 rounded-lg text-secondary-500 hover:bg-secondary-100 dark:hover:bg-secondary-700"
          onClick={() => setSidebarOpen(prev => !prev)}
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
        
        {/* Breadcrumbs */}
        <nav className="hidden sm:flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            {breadcrumbs.map((crumb, index) => (
              <li key={crumb.path} className="flex items-center">
                {index > 0 && (
                  <ChevronRightIcon className="h-4 w-4 mx-1 text-secondary-400" />
                )}
                <Link
                  href={crumb.path}
                  className={cn(
                    "text-sm hover:text-primary-600 transition-colors",
                    index === breadcrumbs.length - 1
                      ? "font-medium text-secondary-800 dark:text-secondary-200"
                      : "text-secondary-600 dark:text-secondary-400"
                  )}
                >
                  {crumb.label}
                </Link>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      {/* Middle section: Search */}
      <div className="hidden md:block flex-1 mx-8">
        <div className={cn(
          "relative max-w-lg mx-auto transition-all duration-200",
          searchFocused ? "w-full" : "w-72"
        )}>
          <input
            type="search"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-secondary-100 dark:bg-secondary-700/50 border border-transparent dark:border-secondary-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-secondary-400 dark:text-secondary-500" />
        </div>
      </div>

      {/* Right section: Actions & User profile */}
      <div className="flex items-center space-x-1 sm:space-x-2">
        {/* Dark/Light mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700"
        >
          {darkMode ? (
            <SunIcon className="h-5 w-5" />
          ) : (
            <MoonIcon className="h-5 w-5" />
          )}
        </button>
        
        {/* Notifications */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-lg text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700 relative"
          >
            <BellIcon className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>
          
          {/* Notifications dropdown */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-secondary-800 rounded-lg shadow-lg border border-secondary-200 dark:border-secondary-700 overflow-hidden z-50">
              <div className="p-3 border-b border-secondary-200 dark:border-secondary-700 flex justify-between items-center">
                <h3 className="font-medium">Notifications</h3>
                <button className="text-xs text-primary-600 dark:text-primary-400 hover:underline">
                  Mark all as read
                </button>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={cn(
                      "p-3 border-b border-secondary-200 dark:border-secondary-700 hover:bg-secondary-50 dark:hover:bg-secondary-700/50 transition-colors",
                      !notification.read && "bg-primary-50 dark:bg-primary-900/20"
                    )}
                  >
                    <div className="flex justify-between">
                      <h4 className="font-medium text-sm">{notification.title}</h4>
                      <span className="text-xs text-secondary-500">{notification.time}</span>
                    </div>
                    <p className="text-xs text-secondary-600 dark:text-secondary-400 mt-1">
                      {notification.description}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="p-2 text-center border-t border-secondary-200 dark:border-secondary-700">
                <Link 
                  href="/dashboard/notifications"
                  className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                >
                  View all notifications
                </Link>
              </div>
            </div>
          )}
        </div>
        
        {/* Messages */}
        <button className="p-2 rounded-lg text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700 relative">
          <EnvelopeIcon className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>
        
        {/* Profile dropdown */}
        <div className="relative ml-2" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center space-x-2 focus:outline-none"
          >
            <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 flex items-center justify-center font-medium text-sm border border-primary-200 dark:border-primary-700">
              {getInitials(user.name)}
            </div>
            <span className="hidden md:inline-block text-sm font-medium text-secondary-800 dark:text-secondary-200">
              {user.name}
            </span>
          </button>
          
          {/* Profile dropdown menu */}
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-secondary-800 rounded-lg shadow-lg border border-secondary-200 dark:border-secondary-700 overflow-hidden z-50">
              <div className="p-4 border-b border-secondary-200 dark:border-secondary-700 text-center">
                <div className="h-16 w-16 mx-auto rounded-full bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 flex items-center justify-center text-xl font-medium border border-primary-200 dark:border-primary-700">
                  {getInitials(user.name)}
                </div>
                <h4 className="mt-2 font-medium">{user.name}</h4>
                <p className="text-xs text-secondary-500 dark:text-secondary-400">{user.email}</p>
                <p className="text-xs text-secondary-600 dark:text-secondary-300 mt-1">{user.role}</p>
              </div>
              
              <div className="py-1">
                <Link 
                  href="/dashboard/profile"
                  className="block px-4 py-2 text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700/50"
                >
                  Your Profile
                </Link>
                <Link 
                  href="/dashboard/settings"
                  className="block px-4 py-2 text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700/50"
                >
                  Settings
                </Link>
                <Link 
                  href="/auth/login"
                  className="block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-secondary-50 dark:hover:bg-secondary-700/50"
                >
                  Sign out
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
