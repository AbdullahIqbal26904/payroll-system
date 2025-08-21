import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { emailSinglePaystub } from '@/redux/slices/payrollSlice';
import { EnvelopeIcon } from '@heroicons/react/24/outline';

/**
 * A reusable button component for sending a single paystub email
 * Can be used in payroll report details or employee paystub listings
 */
export default function EmailPaystubButton({ 
  payrollRunId, 
  employeeId, 
  employeeName, 
  disabled = false,
  onSuccess = () => {},
  size = "default"  // "small", "default", or "large"
}) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Size-based styling
  const sizeClasses = {
    small: "px-2 py-1 text-xs",
    default: "px-3 py-1 text-sm",
    large: "px-4 py-2 text-sm"
  };

  const handleClick = async () => {
    if (window.confirm(`Send paystub email to ${employeeName}?`)) {
      setLoading(true);
      setError(null);
      
      try {
        await dispatch(emailSinglePaystub({ payrollRunId, employeeId })).unwrap();
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
        onSuccess();
      } catch (err) {
        setError(err);
        setTimeout(() => {
          setError(null);
        }, 5000);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="inline-block">
      <button
        type="button"
        disabled={disabled || loading}
        onClick={handleClick}
        className={`inline-flex items-center border border-transparent font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed
          ${success ? 'bg-green-100 text-green-700 hover:bg-green-200' : 
                  error ? 'bg-red-100 text-red-700 hover:bg-red-200' : 
                  'bg-blue-100 text-blue-700 hover:bg-blue-200'}
          ${sizeClasses[size]}`}
      >
        {loading ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-1 h-4 w-4 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Sending...
          </span>
        ) : success ? (
          <span className="flex items-center">
            <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Sent
          </span>
        ) : error ? (
          <span className="flex items-center">
            <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            Error
          </span>
        ) : (
          <span className="flex items-center">
            <EnvelopeIcon className="h-4 w-4 mr-1" />
            Email
          </span>
        )}
      </button>
      
      {error && (
        <div className="absolute mt-2 z-10 bg-white border border-red-200 text-xs text-red-700 p-2 rounded shadow-md max-w-xs">
          {error}
        </div>
      )}
    </div>
  );
}
