import { payrollAPI } from '@/lib/api';

export default async function handler(req, res) {
  const { payrollRunId, employeeId } = req.query;
  
  if (!payrollRunId || !employeeId) {
    return res.status(400).json({ message: 'Missing required parameters' });
  }
  
  try {
    // Use the API utility to download the paystub
    const response = await payrollAPI.downloadPaystub(payrollRunId, employeeId);
    
    // Set appropriate headers
    const contentDisposition = response.headers['content-disposition'] || `attachment; filename=paystub-${employeeId}.pdf`;
    const contentType = response.headers['content-type'] || 'application/pdf';
    
    res.setHeader('Content-Disposition', contentDisposition);
    res.setHeader('Content-Type', contentType);
    
    // Return the binary data
    return res.send(response.data);
  } catch (error) {
    console.error('Error downloading paystub:', error);
    return res.status(500).json({ 
      message: error.response?.data?.message || 'Failed to download paystub' 
    });
  }
}
