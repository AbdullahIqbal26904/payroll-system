import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHolidaysInRange } from '@/redux/slices/holidaySlice';
import { CalendarIcon } from '@heroicons/react/24/outline';

export default function PayrollHolidaysDisplay({ startDate, endDate }) {
  const dispatch = useDispatch();
  const { holidaysInRange, loading } = useSelector((state) => state.holidays);
  const { settings } = useSelector((state) => state.holidays);
  
  useEffect(() => {
    if (startDate && endDate) {
      dispatch(fetchHolidaysInRange({ startDate, endDate }));
    }
  }, [dispatch, startDate, endDate]);
  
  // If paid holidays are not enabled or there are no holidays in range
  if (!settings?.paid_holidays_enabled || (holidaysInRange && holidaysInRange.length === 0)) {
    return null;
  }
  
  return (
    <div className="mt-4 bg-blue-50 rounded-md p-4">
      <div className="flex items-center mb-2">
        <CalendarIcon className="h-5 w-5 text-blue-500 mr-2" />
        <h3 className="font-medium text-blue-700">Paid Holidays in this Period</h3>
      </div>
      
      {loading ? (
        <p className="text-sm text-blue-600">Loading holidays...</p>
      ) : (
        <ul className="space-y-2">
          {holidaysInRange.map(holiday => (
            <li key={holiday.id} className="text-sm flex justify-between">
              <span className="font-medium">{holiday.name}</span>
              <span>{new Date(holiday.date).toLocaleDateString()}</span>
            </li>
          ))}
        </ul>
      )}
      
      <p className="mt-3 text-xs text-blue-600">
        These holidays will be paid according to your payroll settings.
      </p>
    </div>
  );
}
