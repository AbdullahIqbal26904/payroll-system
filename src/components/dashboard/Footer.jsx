'use client';

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t border-secondary-200 dark:border-secondary-800 py-4 px-6 bg-white dark:bg-secondary-950">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        <p className="text-sm text-secondary-500 dark:text-secondary-400">
          &copy; {currentYear} Payroll Master. All rights reserved.
        </p>
        <div className="flex items-center space-x-4 mt-2 sm:mt-0">
          <Link 
            href="/privacy-policy" 
            className="text-xs text-secondary-500 hover:text-primary-600 dark:text-secondary-400 dark:hover:text-primary-400 transition-colors"
          >
            Privacy Policy
          </Link>
          <Link 
            href="/terms" 
            className="text-xs text-secondary-500 hover:text-primary-600 dark:text-secondary-400 dark:hover:text-primary-400 transition-colors"
          >
            Terms of Service
          </Link>
          <Link 
            href="/support" 
            className="text-xs text-secondary-500 hover:text-primary-600 dark:text-secondary-400 dark:hover:text-primary-400 transition-colors"
          >
            Support
          </Link>
        </div>
      </div>
    </footer>
  );
}
