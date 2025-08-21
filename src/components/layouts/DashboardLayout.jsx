import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';
import DashboardFooter from '@/components/dashboard/DashboardFooter';

export default function DashboardLayout({ children }) {
  // Use localStorage to persist sidebar state across page navigations
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    // Check if we're on the client side before accessing localStorage
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('sidebarOpen');
      return savedState !== null ? JSON.parse(savedState) : true; // Default to open
    }
    return true; // Default state when rendering on server
  });
  
  // Update localStorage whenever sidebar state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebarOpen', JSON.stringify(sidebarOpen));
    }
  }, [sidebarOpen]);
  
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);
  const router = useRouter();
  
  // Show loading spinner while authentication state is being determined
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // The redirection logic is handled in _app.js now
  // This component will only render if the user is authenticated
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Sidebar */}
      <DashboardSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      {/* Main content area */}
      <div className={`flex flex-col flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:pl-64' : 'lg:pl-0'}`}>
        {/* Navbar */}
        <DashboardNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        {/* Page content */}
        <main className="flex-1 p-6">
          {children}
        </main>
        
        {/* Footer */}
        <DashboardFooter />
      </div>
    </div>
  );
}
