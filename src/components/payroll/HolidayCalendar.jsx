import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHolidays } from '@/redux/slices/holidaySlice';

export default function HolidayCalendar() {
  const dispatch = useDispatch();
  const { holidays, loading } = useSelector((state) => state.holidays);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [calendarData, setCalendarData] = useState([]);
  
  // Fetch holidays whenever year changes
  useEffect(() => {
    dispatch(fetchHolidays({ year: selectedYear }));
  }, [dispatch, selectedYear]);
  
  // Prepare calendar data when holidays are loaded
  useEffect(() => {
    if (!holidays) return;
    
    // Create month calendar structure
    const months = [];
    for (let month = 0; month < 12; month++) {
      const daysInMonth = new Date(selectedYear, month + 1, 0).getDate();
      const firstDayOfMonth = new Date(selectedYear, month, 1).getDay();
      
      // Create weeks array
      const days = [];
      
      // Add empty days for the start of the month
      for (let i = 0; i < firstDayOfMonth; i++) {
        days.push({ day: null, isHoliday: false });
      }
      
      // Add days of the month
      for (let day = 1; day <= daysInMonth; day++) {
        const date = `${selectedYear}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const holiday = holidays.find(h => h.date === date);
        days.push({ day, date, isHoliday: !!holiday, holiday });
      }
      
      months.push({
        name: new Date(selectedYear, month, 1).toLocaleString('default', { month: 'long' }),
        days
      });
    }
    
    setCalendarData(months);
  }, [holidays, selectedYear]);
  
  const getAvailableYears = () => {
    const currentYear = new Date().getFullYear();
    return [
      currentYear - 2,
      currentYear - 1,
      currentYear,
      currentYear + 1,
      currentYear + 2
    ];
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-xl font-bold">Holiday Calendar</h2>
        
        <div className="mt-4 sm:mt-0">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm"
          >
            {getAvailableYears().map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-8">Loading calendar...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {calendarData.map((month, index) => (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-100 px-4 py-2 text-center font-medium text-gray-700">
                {month.name} {selectedYear}
              </div>
              <div className="grid grid-cols-7 gap-px bg-gray-200">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="bg-gray-100 text-center text-xs py-1 font-medium text-gray-500">
                    {day}
                  </div>
                ))}
                
                {month.days.map((day, idx) => (
                  <div 
                    key={idx} 
                    className={`min-h-[2.5rem] p-1 text-center text-xs bg-white ${
                      day.isHoliday 
                        ? 'bg-red-50 hover:bg-red-100' 
                        : 'hover:bg-gray-50'
                    } ${!day.day ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    {day.day && (
                      <>
                        <div 
                          className={`${
                            day.isHoliday 
                              ? 'font-bold text-red-600' 
                              : ''
                          }`}
                        >
                          {day.day}
                        </div>
                        {day.isHoliday && (
                          <div className="mt-1 text-[10px] text-red-600 font-medium truncate">
                            {day.holiday.name}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
