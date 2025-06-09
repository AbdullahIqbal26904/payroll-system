import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';
import DashboardFooter from '@/components/dashboard/DashboardFooter';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
      <div className="lg:pl-64 flex flex-col flex-1">
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
