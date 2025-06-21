import { downloadBlob } from '@/lib/utils';

/**
 * Handles downloading a paystub file
 * @param {string} payrollRunId - ID of the payroll run
 * @param {string} employeeId - ID of the employee
 */
export async function downloadPaystub(payrollRunId, employeeId) {
  try {
    // Make request to our API endpoint
    const response = await fetch(`/api/downloadPaystub?payrollRunId=${payrollRunId}&employeeId=${employeeId}`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    
    const blob = await response.blob();
    const filename = `paystub-${employeeId}.pdf`;
    
    // Use our utility function
    downloadBlob(blob, filename);
  } catch (error) {
    console.error('Error downloading paystub:', error);
    throw error;
  }
}
