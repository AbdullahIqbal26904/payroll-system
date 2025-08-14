import React from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';

const AccountSettingsNavbar = ({ activeTab }) => {
  const { user } = useSelector((state) => state.auth);
  
  const tabs = [
    { key: 'profile', label: 'Profile', href: '/dashboard/account-settings?tab=profile' },
    { key: 'security', label: 'Security', href: '/dashboard/account-settings?tab=security' },
    { key: 'notifications', label: 'Notifications', href: '/dashboard/account-settings?tab=notifications' }
  ];
  
  return (
    <div className="border-b border-gray-200">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Account Settings
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your account preferences and security settings
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <div className="flex items-center space-x-2">
            <div className="flex-shrink-0">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-500">
                <span className="text-sm font-medium leading-none text-white">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900">{user?.name || 'User'}</span>
              <span className="text-xs text-gray-500">{user?.email || ''}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <div className="sm:hidden">
          <label htmlFor="tabs" className="sr-only">
            Select a tab
          </label>
          <select
            id="tabs"
            name="tabs"
            className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            defaultValue={tabs.find((tab) => tab.key === activeTab)?.key}
            onChange={(e) => {
              const tab = tabs.find((tab) => tab.key === e.target.value);
              if (tab) {
                window.location.href = tab.href;
              }
            }}
          >
            {tabs.map((tab) => (
              <option key={tab.key} value={tab.key}>
                {tab.label}
              </option>
            ))}
          </select>
        </div>
        <div className="hidden sm:block">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {tabs.map((tab) => (
                <Link
                  key={tab.key}
                  href={tab.href}
                  className={`${
                    activeTab === tab.key
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
                  aria-current={activeTab === tab.key ? 'page' : undefined}
                >
                  {tab.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettingsNavbar;
