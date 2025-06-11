import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { uploadTimesheet, resetPayrollState } from '@/redux/slices/payrollSlice';
import { 
  ArrowUpOnSquareIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

export default function UploadTimesheet() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error, success, message } = useSelector((state) => state.payroll);
  
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const fileInputRef = useRef(null);
  
  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (selectedFile) {
      // Check if the file is a CSV or TXT (tab-delimited file)
      if (!['text/csv', 'text/plain', 'text/tab-separated-values'].includes(selectedFile.type) && 
          !selectedFile.name.endsWith('.csv') && 
          !selectedFile.name.endsWith('.txt') && 
          !selectedFile.name.endsWith('.tsv')) {
        setFileError('Please upload a CSV or tab-delimited file');
        setFile(null);
        return;
      }
      
      setFile(selectedFile);
      setFileError('');
    }
  };
  
  // Handle file upload
  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setFileError('Please select a file to upload');
      return;
    }
    
    const formData = new FormData();
    formData.append('file', file);
    
    await dispatch(uploadTimesheet(formData));
  };
  
  // Show notification on success or error
  useEffect(() => {
    if (success) {
      toast.success(message || 'Timesheet uploaded successfully');
      dispatch(resetPayrollState());
      router.push('/dashboard/payroll/timesheet-periods');
    }
    
    if (error) {
      toast.error(error);
      dispatch(resetPayrollState());
    }
  }, [success, error, dispatch, message, router]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Upload Timesheet</h1>
        <p className="mt-2 text-sm text-gray-600">
          Upload CSV timesheets in Attend Time Clock format for payroll processing
        </p>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Upload Timesheet File</h2>
          <p className="text-sm text-gray-600 mb-4">
            Please ensure the CSV file is in the correct format. The system accepts Attend Time Clock punch report format.
          </p>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              type="file"
              accept=".csv,.txt,.tsv"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            
            {!file ? (
              <div>
                <ArrowUpOnSquareIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">Drag and drop your CSV file here, or</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Browse Files
                </button>
                {fileError && (
                  <p className="mt-2 text-sm text-red-600">
                    <ExclamationCircleIcon className="inline-block h-4 w-4 mr-1" />
                    {fileError}
                  </p>
                )}
              </div>
            ) : (
              <div className="text-left">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <DocumentTextIcon className="h-10 w-10 text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                    <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                  <div>
                    <button
                      onClick={() => {
                        setFile(null);
                        fileInputRef.current.value = '';
                      }}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                
                <div className="mt-6">
                  <button
                    onClick={handleUpload}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      'Upload Timesheet'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-8">
          <h3 className="text-md font-medium text-gray-900 mb-2">Instructions</h3>
          <div className="bg-gray-50 p-4 rounded-md">
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
              <li>Upload file must be in Attend Time Clock punch report format (CSV or tab-delimited)</li>
              <li>File should contain employee ID, name, date, punch in, and punch out times</li>
              <li>Upload one timesheet file per pay period</li>
              <li>After uploading, you'll be redirected to the Timesheet Periods page</li>
              <li>Maximum file size is 10MB</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// Use the Dashboard layout for this page
UploadTimesheet.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
