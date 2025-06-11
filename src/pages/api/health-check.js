import { healthCheck } from '@/lib/api';

export default async function handler(req, res) {
  try {
    const response = await healthCheck();
    return res.status(200).json({
      frontendStatus: 'OK',
      backendStatus: response.data.status || 'OK',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return res.status(500).json({
      frontendStatus: 'OK',
      backendStatus: 'ERROR',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
