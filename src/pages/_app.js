import "@/styles/globals.css";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import store from "@/redux/app/store";
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { checkTokenValidity, getCurrentUser } from "@/redux/slices/authSlice";
import { isAuthenticated, needsMfaVerification } from "@/lib/auth";

function AppContent({ Component, pageProps }) {
  const router = useRouter();
  const publicRoutes = ['/login', '/register', '/forgot-password'];
  const mfaRoutes = ['/mfa-verification'];
  
  useEffect(() => {
    const checkAuth = async () => {
      // Check if user has a temporary MFA token
      if (needsMfaVerification()) {
        // If on a public route but needs MFA verification, redirect to MFA verification page
        if (publicRoutes.includes(router.pathname)) {
          router.push('/mfa-verification');
          return;
        }
        
        // If already on MFA verification page, don't redirect
        if (mfaRoutes.includes(router.pathname)) {
          return;
        }
        
        // If not on MFA verification page but has temp token, redirect to MFA verification
        router.push('/mfa-verification');
        return;
      }
      
      // Check if user is authenticated with a valid token
      if (isAuthenticated() && checkTokenValidity()) {
        // Valid token, get current user
        await store.dispatch(getCurrentUser());
        
        // If we're on the login page or MFA page and already authenticated, redirect to dashboard
        if ([...publicRoutes, ...mfaRoutes].includes(router.pathname)) {
          router.push('/dashboard');
        }
      } else if (!publicRoutes.includes(router.pathname)) {
        // No valid token and not on a public page, redirect to login
        router.push('/login');
      }
    };
    
    checkAuth();
  }, [router.pathname]); // Run on route changes to ensure proper redirects

  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      {getLayout(<Component {...pageProps} />)}
    </>
  );
}

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <AppContent Component={Component} pageProps={pageProps} />
    </Provider>
  );
}
