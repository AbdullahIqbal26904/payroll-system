import { XCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

/**
 * A component that displays the results of an email paystub operation
 * Shows success and error counts along with any error messages
 */
export default function EmailPaystubSummary({ 
  stats,
  onClose,
  fullScreen = false
}) {
  if (!stats) return null;
  
  const { sentCount, errorCount, totalCount, errors = [] } = stats;
  
  const containerClasses = fullScreen 
    ? "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" 
    : "";

  return (
    <div className={containerClasses}>
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
        <div className="text-center mb-4">
          {errorCount === 0 ? (
            <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto" />
          ) : errorCount === totalCount ? (
            <XCircleIcon className="h-12 w-12 text-red-500 mx-auto" />
          ) : (
            <div className="relative h-12 w-12 mx-auto">
              <svg className="h-full w-full text-yellow-500" viewBox="0 0 24 24" fill="none">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" />
                <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <circle cx="12" cy="16" r="1" fill="currentColor" />
              </svg>
            </div>
          )}
          
          <h2 className="text-xl font-bold mt-2">
            {errorCount === 0 ? (
              'Paystubs Emailed Successfully'
            ) : errorCount === totalCount ? (
              'Failed to Email Paystubs'
            ) : (
              'Paystubs Partially Emailed'
            )}
          </h2>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Total</span>
            <span>{totalCount}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium text-green-600">Successfully Sent</span>
            <span className="text-green-600">{sentCount}</span>
          </div>
          {errorCount > 0 && (
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium text-red-600">Failed</span>
              <span className="text-red-600">{errorCount}</span>
            </div>
          )}
        </div>
        
        {errors.length > 0 && (
          <div className="mb-4">
            <h3 className="font-medium mb-2 text-red-600">Errors:</h3>
            <div className="bg-red-50 p-3 rounded-md max-h-32 overflow-y-auto">
              <ul className="text-sm text-red-600">
                {errors.map((err, idx) => (
                  <li key={idx} className="mb-1">
                    • {err}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        
        {onClose && (
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
