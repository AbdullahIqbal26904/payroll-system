import { useState } from 'react';
import Head from 'next/head';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import HolidaySettings from '@/components/payroll/HolidaySettings';
import HolidayList from '@/components/payroll/HolidayList';
import HolidayCalendar from '@/components/payroll/HolidayCalendar';

export default function HolidaysManagement() {
  const [activeTab, setActiveTab] = useState('list'); // 'list' or 'calendar'
  
  return (
    <>
      <Head>
        <title>Paid Holidays Management | Payroll System</title>
        <meta name="description" content="Manage paid holidays in the payroll system" />
      </Head>

      <div className="space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Paid Holidays Management</h1>
          <p className="text-gray-500 mt-1">
            Manage public holidays and paid holiday settings for your organization
          </p>
        </div>
        
        {/* Holiday settings */}
        <HolidaySettings />
        
        {/* Tab navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('list')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'list'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'calendar'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Calendar View
            </button>
          </nav>
        </div>
        
        {/* Tab content */}
        {activeTab === 'list' ? <HolidayList /> : <HolidayCalendar />}
      </div>
    </>
  );
}

// Use the Dashboard layout for this page
HolidaysManagement.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
