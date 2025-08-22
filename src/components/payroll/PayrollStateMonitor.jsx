import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { resetPayrollState } from '@/redux/slices/payrollSlice';

// This component monitors payroll state and shows toast notifications
// while preventing duplicate toasts from appearing
export default function PayrollStateMonitor() {
  const dispatch = useDispatch();
  const { success, error, message } = useSelector((state) => state.payroll);
  
  // Use refs to track the last toast message and timestamp
  // This ensures values persist between renders while avoiding duplicates
  const lastToastMessageRef = useRef(null);
  const lastToastTimestampRef = useRef(0);
  
  // Handle success and error states
  useEffect(() => {
    // To prevent duplicate toasts, don't show if the message is the same 
    // and was shown in the last 3 seconds
    const now = Date.now();
    const isDuplicate = 
      (success && message === lastToastMessageRef.current) || 
      (error === lastToastMessageRef.current) &&
      (now - lastToastTimestampRef.current < 3000);
    
    if (success && message && !isDuplicate) {
      toast.success(message);
      lastToastMessageRef.current = message;
      lastToastTimestampRef.current = now;
      
      // Reset state after showing toast
      setTimeout(() => {
        dispatch(resetPayrollState());
      }, 100);
    } else if (error && !isDuplicate) {
      toast.error(error);
      lastToastMessageRef.current = error;
      lastToastTimestampRef.current = now;
      
      // Reset error state after showing toast
      setTimeout(() => {
        dispatch(resetPayrollState());
      }, 100);
    }
  }, [success, error, message, dispatch]);
  
  // Component doesn't render anything
  return null;
}
