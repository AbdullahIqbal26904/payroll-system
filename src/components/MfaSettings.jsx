import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  setupMfa, 
  verifySetupMfa, 
  disableMfa, 
  generateBackupCodes,
  setupEmailMfa,
  verifyEmailMfaSetup,
  disableEmailMfa
} from '@/redux/slices/authSlice';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

const AppMfaSetup = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState('initial'); // initial, setup, verify, success
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [isBackupCode, setIsBackupCode] = useState(false);
  
  const dispatch = useDispatch();
  const { loading, error, mfa, user } = useSelector((state) => state.auth);
  
  const isMfaEnabled = user?.mfaEnabled && user?.mfaType === 'app';
  
  const handleInitiateSetup = async () => {
    try {
      const resultAction = await dispatch(setupMfa());
      
      if (resultAction.error) {
        toast.error(resultAction.error || 'Failed to set up MFA');
        return;
      }
      
      setStep('setup');
    } catch (error) {
      console.error('MFA setup error:', error);
      toast.error('An error occurred during MFA setup. Please try again.');
    }
  };
  
  const handleVerifySetup = async (e) => {
    e.preventDefault();
    
    if (verificationCode.length < 6 && !isBackupCode) {
      toast.error('Please enter a valid verification code');
      return;
    }
    
    try {
      // If we're using a backup code or standard verification code
      const resultAction = await dispatch(verifySetupMfa({
        code: verificationCode,
        isBackupCode: isBackupCode
      }));
      
      if (resultAction.error) {
        toast.error(resultAction.error || 'Failed to verify MFA setup');
        return;
      }
      
      toast.success('MFA setup completed successfully');
      
      // Store backup codes in a secure cookie that expires in 1 day
      // This allows users to access their backup codes if they accidentally close the page
      if (mfa.backupCodes && mfa.backupCodes.length > 0) {
        Cookies.set('temp_backup_codes', JSON.stringify(mfa.backupCodes), { expires: 1, secure: true, sameSite: 'strict' });
      }
      
      setStep('success');
      setShowBackupCodes(false);
    } catch (error) {
      console.error('MFA setup verification error:', error);
      toast.error('An error occurred during MFA verification. Please try again.');
    }
  };
  
  const handleDisableMfa = async (e) => {
    e.preventDefault();
    
    if (!password) {
      toast.error('Please enter your password');
      return;
    }
    
    // Security confirmation before disabling MFA
    if (!confirm('Are you sure you want to disable two-factor authentication? This will reduce the security of your account.')) {
      return;
    }
    
    const resultAction = await dispatch(disableMfa(password));
    
    if (!resultAction.error) {
      toast.success('MFA disabled successfully');
      setStep('initial');
      setPassword('');
    }
  };
  
  const handleGenerateBackupCodes = async () => {
    // Security confirmation before generating new backup codes
    if (!confirm('Generating new backup codes will invalidate all your existing backup codes. Are you sure you want to continue?')) {
      return;
    }
    
    const resultAction = await dispatch(generateBackupCodes());
    
    if (!resultAction.error) {
      toast.success('New backup codes generated successfully');
      setShowBackupCodes(true); // Automatically show the newly generated backup codes
    }
  };
  
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success('Copied to clipboard'))
      .catch(() => toast.error('Failed to copy to clipboard. Please try again.'));
  };
  
  // Render based on the current step and MFA status
  if (isMfaEnabled) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-medium text-gray-900 mb-4">App-Based Two-Factor Authentication</h3>
        
        <div className="bg-green-50 p-4 rounded-md mb-6">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-sm text-green-700">App-based two-factor authentication is enabled.</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <button
              onClick={() => setShowBackupCodes(!showBackupCodes)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-4"
            >
              {showBackupCodes ? 'Hide Backup Codes' : 'View Backup Codes'}
            </button>
            
            <button
              onClick={handleGenerateBackupCodes}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              disabled={loading}
            >
              Generate New Backup Codes
            </button>
          </div>
          
          {showBackupCodes && mfa.backupCodes && mfa.backupCodes.length > 0 && (
            <div className="mt-4 p-4 bg-gray-100 rounded-md">
              <div className="flex justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-700">Backup Codes</h4>
                <button 
                  onClick={() => copyToClipboard(mfa.backupCodes.join('\n'))}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  Copy All
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {mfa.backupCodes.map((code, index) => (
                  <div key={index} className="flex items-center justify-between bg-white p-2 rounded border">
                    <code className="text-sm font-mono">{code}</code>
                    <button
                      onClick={() => copyToClipboard(code)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-gray-500">
                Save these backup codes in a secure location. Each code can only be used once.
              </p>
            </div>
          )}
          
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Disable Two-Factor Authentication</h4>
            <form onSubmit={handleDisableMfa} className="space-y-3">
              <div>
                <label htmlFor="password" className="block text-sm text-gray-700 mb-1">
                  Enter your password to disable 2FA
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Disable 2FA'}
              </button>
              
              {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              )}
            </form>
          </div>
        </div>
      </div>
    );
  }
  
  // Initial setup flow
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-medium text-gray-900 mb-4">App-Based Two-Factor Authentication</h3>
      
      {error && (
        <div className="bg-red-50 p-4 rounded-md mb-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
      
      {step === 'initial' && (
        <div>
          <p className="text-sm text-gray-500 mb-4">
            Two-factor authentication adds an extra layer of security to your account by requiring a code from an authenticator app in addition to your password.
          </p>
          
          <button
            onClick={(e) => {
              e.preventDefault();
              handleInitiateSetup();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={loading}
            type="button"
          >
            {loading ? 'Setting up...' : 'Set up two-factor authentication'}
          </button>
        </div>
      )}
      
      {step === 'setup' && mfa.setupData && (
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">1. Scan this QR code</h4>
            <p className="text-xs text-gray-500 mb-3">
              Scan this QR code with your authenticator app (like Google Authenticator, Authy, or Microsoft Authenticator).
            </p>
            <div className="p-4 bg-gray-100 rounded-md flex justify-center">
              <img src={mfa.setupData.qrCode} alt="QR Code" className="max-w-full h-48" />
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">2. Or enter this code manually</h4>
            <div className="flex items-center space-x-3">
              <code className="p-2 bg-gray-100 rounded text-sm font-mono">{mfa.setupData.secret}</code>
              <button
                onClick={() => copyToClipboard(mfa.setupData.secret)}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Copy
              </button>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">3. Verify setup</h4>
            <form onSubmit={handleVerifySetup} className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="verificationCode" className="block text-sm text-gray-700">
                    {isBackupCode 
                      ? 'Enter one of your backup codes' 
                      : 'Enter the 6-digit code from your authenticator app'}
                  </label>
                  <button 
                    type="button"
                    onClick={() => setIsBackupCode(!isBackupCode)}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    {isBackupCode ? 'Use authenticator code instead' : 'Use backup code instead'}
                  </button>
                </div>
                <input
                  id="verificationCode"
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder={isBackupCode ? "Enter your backup code" : "000000"}
                  maxLength={isBackupCode ? 12 : 6}
                  required
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setStep('initial')}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={loading}
                >
                  {loading ? 'Verifying...' : 'Verify and activate'}
                </button>
              </div>
            </form>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">4. Save your backup codes</h4>
            <p className="text-xs text-gray-500 mb-3">
              If you lose access to your authenticator app, you can use one of these backup codes to sign in.
              Each code can only be used once. Store these in a safe place.
            </p>
            
            <div className="p-4 bg-gray-100 rounded-md">
              <div className="flex justify-between mb-2">
                <h5 className="text-sm font-medium text-gray-700">Backup Codes</h5>
                <button 
                  onClick={() => copyToClipboard(mfa.backupCodes.join('\n'))}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  Copy All
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {mfa.backupCodes && mfa.backupCodes.map((code, index) => (
                  <div key={index} className="flex items-center justify-between bg-white p-2 rounded border">
                    <code className="text-sm font-mono">{code}</code>
                    <button
                      onClick={() => copyToClipboard(code)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {step === 'success' && (
        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-md">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-sm text-green-700">Two-factor authentication has been successfully enabled.</p>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Important: Save your backup codes</h4>
            <p className="text-sm text-gray-500 mb-4">
              Please ensure you have saved your backup codes in a secure location. You will need them if you lose access to your authenticator app.
            </p>
            
            {(() => {
              // Try to get backup codes from the cookie
              const storedBackupCodes = Cookies.get('temp_backup_codes');
              if (storedBackupCodes) {
                try {
                  const codes = JSON.parse(storedBackupCodes);
                  if (codes && codes.length > 0) {
                    return (
                      <div className="p-4 bg-gray-100 rounded-md">
                        <div className="flex justify-between mb-2">
                          <h5 className="text-sm font-medium text-gray-700">Your Backup Codes</h5>
                          <button 
                            onClick={() => copyToClipboard(codes.join('\n'))}
                            className="text-xs text-blue-600 hover:text-blue-800"
                          >
                            Copy All
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          {codes.map((code, index) => (
                            <div key={index} className="flex items-center justify-between bg-white p-2 rounded border">
                              <code className="text-sm font-mono">{code}</code>
                              <button
                                onClick={() => copyToClipboard(code)}
                                className="text-gray-500 hover:text-gray-700"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={() => {
                            Cookies.remove('temp_backup_codes');
                            toast.success("Backup codes removed from browser. Make sure you've saved them elsewhere!");
                          }}
                          className="mt-3 text-xs text-blue-600 hover:text-blue-800"
                        >
                          I've saved these codes, remove them from my browser
                        </button>
                      </div>
                    );
                  }
                } catch (e) {
                  // Handle parse error silently
                  console.error("Error parsing backup codes", e);
                }
              }
              return null;
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

const EmailMfaSetup = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState('initial'); // initial, confirm, verify, success
  
  const dispatch = useDispatch();
  const { loading, error, mfa, user } = useSelector((state) => state.auth);
  
  const isMfaEnabled = user?.mfaEnabled && user?.mfaType === 'email';
  
  const handleInitiateSetup = () => {
    // First just show confirmation step
    setStep('confirm');
  };
  
  const handleConfirmSetup = async () => {
    // Only send the email code after user confirms
    await dispatch(setupEmailMfa());
    setStep('verify');
  };
  
  const handleVerifySetup = async (e) => {
    e.preventDefault();
    
    if (verificationCode.length < 6) {
      toast.error('Please enter a valid verification code');
      return;
    }
    
    const resultAction = await dispatch(verifyEmailMfaSetup(verificationCode));
    
    if (!resultAction.error) {
      toast.success('Email MFA setup completed successfully');
      setStep('success');
    }
  };
  
  const handleDisableMfa = async (e) => {
    e.preventDefault();
    
    if (!password) {
      toast.error('Please enter your password');
      return;
    }
    
    const resultAction = await dispatch(disableEmailMfa(password));
    
    if (!resultAction.error) {
      toast.success('Email MFA disabled successfully');
      setStep('initial');
      setPassword('');
    }
  };
  
  // Render based on the current step and MFA status
  if (isMfaEnabled) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Email-Based Two-Factor Authentication</h3>
        
        <div className="bg-green-50 p-4 rounded-md mb-6">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-sm text-green-700">Email-based two-factor authentication is enabled.</p>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Disable Email Two-Factor Authentication</h4>
          <form onSubmit={handleDisableMfa} className="space-y-3">
            <div>
              <label htmlFor="password" className="block text-sm text-gray-700 mb-1">
                Enter your password to disable email 2FA
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>
            
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Disable Email 2FA'}
            </button>
            
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </form>
        </div>
      </div>
    );
  }
  
  // Initial setup flow
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Email-Based Two-Factor Authentication</h3>
      
      {error && (
        <div className="bg-red-50 p-4 rounded-md mb-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
      
      {step === 'initial' && (
        <div>
          <p className="text-sm text-gray-500 mb-4">
            Email-based two-factor authentication adds an extra layer of security by sending a verification code to your email whenever you log in.
          </p>
          
          <button
            onClick={handleInitiateSetup}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Set up email authentication'}
          </button>
        </div>
      )}
      
      {step === 'confirm' && (
        <div>
          <div className="bg-yellow-50 p-4 rounded-md mb-4">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-sm text-yellow-700">
                After enabling email MFA, you will need to verify your identity with a code sent to your email each time you log in.
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-700">
              When you enable email-based MFA:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
              <li>A verification code will be sent to your email address</li>
              <li>You'll need to verify this code to enable MFA</li>
              <li>For all future logins, you'll need to enter a code sent to your email</li>
            </ul>
            
            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setStep('initial')}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              
              <button
                onClick={handleConfirmSetup}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={loading}
              >
                {loading ? 'Sending code...' : 'Send verification code'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {step === 'verify' && mfa.emailSent && (
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Verification code sent</h4>
            <p className="text-sm text-gray-500 mb-4">
              A verification code has been sent to your email address. Please check your inbox and enter the code below.
            </p>
            
            <form onSubmit={handleVerifySetup} className="space-y-3">
              <div>
                <label htmlFor="verificationCode" className="block text-sm text-gray-700 mb-1">
                  Enter the verification code from your email
                </label>
                <input
                  id="verificationCode"
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="000000"
                  maxLength={6}
                  required
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setStep('initial')}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={loading}
                >
                  {loading ? 'Verifying...' : 'Verify and activate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {step === 'success' && (
        <div className="bg-green-50 p-4 rounded-md">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-sm text-green-700">Email-based two-factor authentication has been successfully enabled.</p>
          </div>
        </div>
      )}
    </div>
  );
};

const MfaSettings = () => {
  const [activeTab, setActiveTab] = useState('app');
  const { user } = useSelector((state) => state.auth);
  
  // If MFA is already enabled, show the active type first
  useEffect(() => {
    if (user?.mfaEnabled) {
      setActiveTab(user.mfaType || 'app');
    }
  }, [user]);
  
  // Show warning if user has both types of MFA enabled
  useEffect(() => {
    if (user?.mfaEnabled && user?.mfaType === 'app' && document.referrer.includes('login')) {
      toast.info('You have successfully authenticated using App-based MFA.');
    } else if (user?.mfaEnabled && user?.mfaType === 'email' && document.referrer.includes('login')) {
      toast.info('You have successfully authenticated using Email-based MFA.');
    }
  }, []);
  
  return (
    <div className="max-w-3xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="pb-5 border-b border-gray-200">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          Two-Factor Authentication
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Set up an additional layer of security for your account.
        </p>
      </div>
      
      <div className="mt-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('app')}
              className={`${
                activeTab === 'app'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Authenticator App
            </button>
            <button
              onClick={() => setActiveTab('email')}
              className={`${
                activeTab === 'email'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Email-Based
            </button>
          </nav>
        </div>
        
        <div className="mt-6">
          {activeTab === 'app' ? <AppMfaSetup /> : <EmailMfaSetup />}
        </div>
      </div>
    </div>
  );
};

export default MfaSettings;
