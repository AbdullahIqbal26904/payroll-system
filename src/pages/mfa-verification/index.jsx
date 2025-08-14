import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { 
  verifyMfa, 
  verifyEmailMfa, 
  sendMfaCode,
  logout
} from '@/redux/slices/authSlice';
import { getMfaTemporaryData } from '@/lib/auth';

const MfaVerificationPage = () => {
  const [token, setToken] = useState('');
  const [isUsingBackupCode, setIsUsingBackupCode] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading, error, mfa } = useSelector((state) => state.auth);
  
  // Check if MFA verification is needed
  useEffect(() => {
    const { tempToken, userId } = getMfaTemporaryData();
    
    if (!tempToken || !userId) {
      router.replace('/login');
      return;
    }
  }, [router]);

  // Handle countdown for resending email code
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Send email code on initial load for email MFA
  useEffect(() => {
    const { userId } = getMfaTemporaryData();
    if (mfa.type === 'email' && userId) {
      handleSendEmailCode();
    }
  }, [mfa.type]);

  const handleVerifyAppMfa = async (e) => {
    e.preventDefault();
    
    if (token.length < 6) return;
    
    const result = await dispatch(verifyMfa({ token, useBackupCode: isUsingBackupCode }));
    
    if (!result.error) {
      router.replace('/dashboard');
    }
  };

  const handleVerifyEmailMfa = async (e) => {
    e.preventDefault();
    
    if (token.length < 6) return;
    
    const result = await dispatch(verifyEmailMfa(token));
    
    if (!result.error) {
      router.replace('/dashboard');
    }
  };

  const handleSendEmailCode = async () => {
    await dispatch(sendMfaCode());
    setCountdown(60); // 60 second cooldown
  };

  const handleCancel = () => {
    dispatch(logout());
    router.replace('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Two-Factor Authentication</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {mfa.type === 'app' ? (
          <>
            <form onSubmit={handleVerifyAppMfa} className="space-y-6">
              <div>
                <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-1">
                  {isUsingBackupCode ? 'Backup Code' : 'Authentication Code'}
                </label>
                <input
                  id="token"
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder={isUsingBackupCode ? "Enter backup code" : "Enter 6-digit code"}
                  autoComplete="off"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  id="useBackupCode"
                  type="checkbox"
                  checked={isUsingBackupCode}
                  onChange={() => setIsUsingBackupCode(!isUsingBackupCode)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="useBackupCode" className="ml-2 block text-sm text-gray-700">
                  Use backup code instead
                </label>
              </div>
              
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : 'Verify'}
                </button>
              </div>
            </form>
            
            <div className="mt-6 text-sm text-gray-500 text-center">
              <p>Open your authenticator app and enter the code displayed for this account.</p>
            </div>
          </>
        ) : (
          <>
            <form onSubmit={handleVerifyEmailMfa} className="space-y-6">
              <div>
                <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Verification Code
                </label>
                <input
                  id="token"
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter verification code"
                  autoComplete="off"
                />
              </div>
              
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : 'Verify'}
                </button>
              </div>
            </form>
            
            <div className="mt-6 text-sm text-center">
              <p className="text-gray-500">A verification code has been sent to your email address.</p>
              {countdown > 0 ? (
                <p className="text-gray-400 mt-2">Resend code in {countdown}s</p>
              ) : (
                <button
                  onClick={handleSendEmailCode}
                  disabled={loading}
                  className="mt-2 text-indigo-600 hover:text-indigo-500"
                >
                  Resend code
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MfaVerificationPage;
