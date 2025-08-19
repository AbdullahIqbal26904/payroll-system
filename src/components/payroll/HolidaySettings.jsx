import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHolidaySettings, updateHolidaySettings } from '@/redux/slices/holidaySlice';
import { Switch } from '@headlessui/react';

export default function HolidaySettings() {
  const dispatch = useDispatch();
  const { settings, loading, success, error } = useSelector((state) => state.holidays);
  const [enabled, setEnabled] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch holiday settings on component mount
  useEffect(() => {
    dispatch(fetchHolidaySettings());
  }, [dispatch]);

  // Update local state when settings data is loaded
  useEffect(() => {
    if (settings && settings.paid_holidays_enabled !== undefined) {
      setEnabled(settings.paid_holidays_enabled);
    }
  }, [settings]);

  // Handle success/error messages
  useEffect(() => {
    if (success) {
      setMessage('Holiday settings updated successfully');
      const timer = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(timer);
    }
    if (error) {
      setMessage(error);
      const timer = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const handleToggle = () => {
    const newStatus = !enabled;
    setEnabled(newStatus);
    dispatch(updateHolidaySettings({ paid_holidays_enabled: newStatus }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold mb-4">Paid Holidays Settings</h2>
      
      <div className="flex items-center justify-between py-4 border-b border-gray-200">
        <div>
          <p className="text-gray-700 font-medium">Enable Paid Holidays</p>
          <p className="text-gray-500 text-sm">
            When enabled, holidays will be paid according to payroll settings
          </p>
        </div>
        <Switch
          checked={enabled}
          onChange={handleToggle}
          disabled={loading}
          className={`${
            enabled ? 'bg-blue-600' : 'bg-gray-200'
          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
        >
          <span
            className={`${
              enabled ? 'translate-x-6' : 'translate-x-1'
            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
          />
        </Switch>
      </div>

      {message && (
        <div className={`mt-4 p-3 rounded ${success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message}
        </div>
      )}
    </div>
  );
}
