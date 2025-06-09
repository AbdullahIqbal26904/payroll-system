'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { 
  ChartBarIcon,
  UserGroupIcon,
  ClipboardDocumentCheckIcon,
  BanknotesIcon,
  CalendarIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ArrowRightOnRectangleIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  FolderIcon,
  BellIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

// Navigation menu items
const navItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: ChartBarIcon,
  },
  {
    title: 'User Management',
    icon: UserGroupIcon,
    submenu: true,
    subMenuItems: [
      { title: 'Users List', href: '/dashboard/user-management' },
      { title: 'User Profile', href: '/dashboard/user-management/profile' },
      { title: 'Permissions', href: '/dashboard/user-management/permissions' },
    ],
  },
  {
    title: 'Payroll Management',
    icon: BanknotesIcon,
    submenu: true,
    subMenuItems: [
      { title: 'Employee Salary', href: '/dashboard/payroll-management' },
      { title: 'Salary Calculation', href: '/dashboard/payroll-management/calculation' },
      { title: 'Payment History', href: '/dashboard/payroll-management/history' },
    ],
  },
  {
    title: 'Attendance',
    href: '/dashboard/attendance',
    icon: ClipboardDocumentCheckIcon,
  },
  {
    title: 'Calendar',
    href: '/dashboard/calendar',
    icon: CalendarIcon,
  },
  {
    title: 'Documents',
    icon: DocumentTextIcon,
    submenu: true,
    subMenuItems: [
      { title: 'File Manager', href: '/dashboard/documents/files' },
      { title: 'Reports', href: '/dashboard/documents/reports' },
    ],
  },
  {
    title: 'Messages',
    href: '/dashboard/messages',
    icon: ChatBubbleLeftRightIcon,
  },
  {
    title: 'Notifications',
    href: '/dashboard/notifications',
    icon: BellIcon,
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Cog6ToothIcon,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (title) => {
    setOpenMenus(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const toggleSidebar = () => {
    setCollapsed(prev => !prev);
    // Close all submenus when collapsing
    if (!collapsed) {
      setOpenMenus({});
    }
  };

  return (
    <aside 
      className={cn(
        "bg-white dark:bg-secondary-800 border-r border-secondary-200 dark:border-secondary-700 transition-all duration-300 flex flex-col h-full z-20",
        collapsed ? "w-[var(--collapsed-sidebar-width)]" : "w-[var(--sidebar-width)]",
        "fixed md:relative"
      )}
    >
      {/* Sidebar Header with Logo */}
      <div className="h-[var(--navbar-height)] flex items-center justify-between px-4 border-b border-secondary-200 dark:border-secondary-700">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-9 w-9 flex items-center justify-center bg-primary-600 rounded-lg">
            <span className="text-white font-bold text-lg">PM</span>
          </div>
          {!collapsed && (
            <span className="ml-3 font-semibold text-lg">Payroll Master</span>
          )}
        </div>
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg text-secondary-500 hover:bg-secondary-100 dark:hover:bg-secondary-700"
        >
          {collapsed ? (
            <ChevronDoubleRightIcon className="h-5 w-5" />
          ) : (
            <ChevronDoubleLeftIcon className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-4 scrollbar-hidden">
        <ul className="px-3 space-y-1">
          {navItems.map((item) => (
            <li key={item.title}>
              {item.submenu ? (
                <div>
                  <button
                    onClick={() => toggleMenu(item.title)}
                    className={cn(
                      "w-full sidebar-link",
                      openMenus[item.title] && "bg-secondary-100 dark:bg-secondary-800",
                      pathname.includes(item.title.toLowerCase().replace(/\s+/g, '-')) && "text-primary-600 font-medium"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {!collapsed && (
                      <>
                        <span className="flex-1 text-left">{item.title}</span>
                        {openMenus[item.title] ? (
                          <ChevronDownIcon className="h-4 w-4" />
                        ) : (
                          <ChevronRightIcon className="h-4 w-4" />
                        )}
                      </>
                    )}
                  </button>
                  {!collapsed && openMenus[item.title] && (
                    <ul className="pl-9 mt-1 space-y-1">
                      {item.subMenuItems.map((subItem) => (
                        <li key={subItem.title}>
                          <Link 
                            href={subItem.href}
                            className={cn(
                              "block py-2 px-3 rounded-md text-sm transition-colors",
                              pathname === subItem.href
                                ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 font-medium"
                                : "text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-800"
                            )}
                          >
                            {subItem.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "sidebar-link",
                    pathname === item.href && "active"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {!collapsed && <span>{item.title}</span>}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Sidebar Footer */}
      <div className="border-t border-secondary-200 dark:border-secondary-700 p-3">
        <Link 
          href="/auth/login" 
          className={cn(
            "flex items-center px-3 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors",
          )}
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          {!collapsed && <span className="ml-3">Logout</span>}
        </Link>
      </div>
    </aside>
  );
}
