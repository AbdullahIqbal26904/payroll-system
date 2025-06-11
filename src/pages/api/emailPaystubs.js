import { payrollAPI } from '@/lib/api';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  const { payrollRunId, sendToAll, employeeIds } = req.body;
  
  if (!payrollRunId) {
    return res.status(400).json({ message: 'Missing required parameters' });
  }
  
  try {
    const data = {
      payrollRunId,
      sendToAll: sendToAll || false,
      employeeIds: employeeIds || []
    };
    
    // Use the API utility to email paystubs
    const response = await payrollAPI.emailPaystubs(data);
    
    return res.status(200).json(response.data);
  } catch (error) {
    console.error('Error emailing paystubs:', error);
    return res.status(500).json({ 
      message: error.response?.data?.message || 'Failed to email paystubs' 
    });
  }
}
