export default function DashboardFooter() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-200 py-4 px-6">
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          &copy; {currentYear} Payroll System Inc. All rights reserved.
        </div>
        <div className="text-sm text-gray-500">
          Version 1.0.0
        </div>
      </div>
    </footer>
  );
}
