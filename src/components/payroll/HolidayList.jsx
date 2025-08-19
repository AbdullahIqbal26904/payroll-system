import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchHolidays,
  createHoliday,
  updateHoliday,
  deleteHoliday,
  resetHolidayState
} from '@/redux/slices/holidaySlice';
import { 
  PlusIcon, 
  PencilSquareIcon, 
  TrashIcon,
  CalendarIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

export default function HolidayList() {
  const dispatch = useDispatch();
  const { holidays, loading, success, error } = useSelector((state) => state.holidays);
  
  // Local state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHoliday, setSelectedHoliday] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    description: ''
  });
  const [message, setMessage] = useState('');
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  
  // Fetch holidays on component mount and when filter year changes
  useEffect(() => {
    dispatch(fetchHolidays({ year: filterYear }));
  }, [dispatch, filterYear]);
  
  // Handle success/error messages
  useEffect(() => {
    if (success) {
      setMessage('Operation completed successfully');
      setIsModalOpen(false);
      resetForm();
      
      const timer = setTimeout(() => {
        setMessage('');
        dispatch(resetHolidayState());
      }, 3000);
      
      return () => clearTimeout(timer);
    }
    
    if (error) {
      setMessage(error);
      
      const timer = setTimeout(() => {
        setMessage('');
        dispatch(resetHolidayState());
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [success, error, dispatch]);
  
  const resetForm = () => {
    setFormData({
      name: '',
      date: '',
      description: ''
    });
    setSelectedHoliday(null);
  };
  
  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };
  
  const openEditModal = (holiday) => {
    setSelectedHoliday(holiday);
    setFormData({
      name: holiday.name,
      date: holiday.date,
      description: holiday.description || ''
    });
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.date) {
      setMessage('Name and date are required');
      return;
    }
    
    if (selectedHoliday) {
      // Update existing holiday
      dispatch(updateHoliday({ 
        id: selectedHoliday.id, 
        holidayData: formData 
      }));
    } else {
      // Create new holiday
      dispatch(createHoliday(formData));
    }
  };
  
  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this holiday?')) {
      dispatch(deleteHoliday(id));
    }
  };
  
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
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <h2 className="text-xl font-bold">Public Holidays</h2>
          
          <div className="flex items-center mt-4 sm:mt-0">
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(parseInt(e.target.value))}
              className="mr-4 px-4 py-2 border border-gray-300 rounded-md text-sm"
            >
              {getAvailableYears().map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            
            <button
              onClick={openAddModal}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Holiday
            </button>
          </div>
        </div>
        
        {message && (
          <div className={`mb-4 p-3 rounded ${success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message}
          </div>
        )}
      </div>
      
      {/* Holiday List */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created By
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : holidays && holidays.length > 0 ? (
              holidays.map((holiday) => (
                <tr key={holiday.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {holiday.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(holiday.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {holiday.description || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {holiday.created_by_name || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => openEditModal(holiday)}
                      className="text-blue-600 hover:text-blue-800 mr-4"
                    >
                      <PencilSquareIcon className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(holiday.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No holidays found for {filterYear}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Modal for adding/editing holidays */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">
                {selectedHoliday ? 'Edit Holiday' : 'Add New Holiday'}
              </h3>
              <button 
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="px-6 py-4">
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Holiday Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. New Year's Day"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Date *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Holiday description (optional)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="mr-3 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  {loading ? 'Saving...' : selectedHoliday ? 'Update Holiday' : 'Add Holiday'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
