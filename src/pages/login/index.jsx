import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '@/redux/slices/authSlice';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);
  
  useEffect(() => {
    // Clear any previous errors on component mount
    dispatch(clearError());
    
    // We don't need to redirect here, _app.js will handle it
    // This prevents double redirection
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const resultAction = await dispatch(loginUser({ email, password }));
      if (loginUser.fulfilled.match(resultAction)) {
        toast.success('Login successful!');
        // Explicitly navigate to dashboard after successful login
        router.push('/dashboard');
      }
    } catch (err) {
      // Error is handled by the reducer
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Login | Payroll Application</title>
        <meta name="description" content="Login to your payroll dashboard" />
      </Head>
      
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-8 sm:px-10">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          
          <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-8">
            Sign in to your account
          </h2>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="text-sm">
                  <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                    Forgot your password?
                  </a>
                </div>
              </div>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : null}
                Sign in
              </button>
            </div>
          </form>

          <div className="mt-6 flex items-center justify-center">
            <div className="text-sm">
              <span className="text-gray-500">Don't have an account?</span>{' '}
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                Contact administrator
              </a>
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between">
          <p className="text-xs text-gray-500">
            © 2025 Payroll System Inc.
          </p>
          <p className="text-xs text-gray-500">
            v1.0.0
          </p>
        </div>
      </div>
    </div>
  );
}