import { payrollAPI } from '@/lib/api';

/**
 * API handler for emailing a single paystub
 * This routes through the Next.js API to handle the email sending process
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    // Extract parameters from request body
    const { payrollRunId, employeeId } = req.body;
    
    if (!payrollRunId || !employeeId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Both payrollRunId and employeeId are required' 
      });
    }

    // Use the API utility to email the single paystub
    const response = await payrollAPI.emailSinglePaystub(payrollRunId, employeeId);
    
    // Return the response from the backend
    return res.status(200).json({
      success: true,
      message: 'Paystub emailed successfully',
      data: response.data
    });
  } catch (error) {
    console.error('Error sending paystub email:', error);
    
    // Extract error information from the API response
    const errorMessage = error.response?.data?.message || 'Failed to email paystub';
    const statusCode = error.response?.status || 500;
    
    return res.status(statusCode).json({
      success: false,
      message: errorMessage,
      error: error.response?.data?.error || errorMessage
    });
  }
}
