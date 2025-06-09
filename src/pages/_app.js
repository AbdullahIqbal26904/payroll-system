import "@/styles/globals.css";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import store from "@/redux/app/store";
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { checkTokenValidity, getCurrentUser } from "@/redux/slices/authSlice";

function AppContent({ Component, pageProps }) {
  const router = useRouter();
  const publicRoutes = ['/login', '/register', '/forgot-password'];
  
  useEffect(() => {
    const checkAuth = async () => {
      // Only do the auth check when the component mounts, not on every route change
      if (checkTokenValidity()) {
        // Valid token, get current user
        await store.dispatch(getCurrentUser());
        
        // If we're on the login page and already authenticated, redirect to dashboard
        if (publicRoutes.includes(router.pathname)) {
          router.push('/dashboard');
        }
      } else if (!publicRoutes.includes(router.pathname)) {
        // No valid token and not on a public page, redirect to login
        router.push('/login');
      }
    };
    
    checkAuth();
  }, []); // Empty dependency array so this only runs once on mount

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
