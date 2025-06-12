import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines class names with Tailwind CSS class merging
 * This utility combines clsx and tailwind-merge to provide conditional
 * class application with proper handling of Tailwind's utility classes
 * 
 * @param {...any} inputs - Class name inputs (strings, objects, arrays)
 * @returns {string} - Merged class string
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Extracts initials from a person's name
 * Takes the first letter of each word in the name
 * 
 * @param {string} name - The full name
 * @param {number} [limit=2] - Maximum number of initials to return
 * @returns {string} - Initials string (uppercase)
 */
export function getInitials(name, limit = 2) {
  if (!name) return '';
  
  return name
    .split(' ')
    .filter(part => part.length > 0)
    .slice(0, limit)
    .map(part => part[0].toUpperCase())
    .join('');
}

/**
 * Formats a date to a human-readable string
 * 
 * @param {Date|string|number} date - Date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} - Formatted date string
 */
export function formatDate(date, options = {}) {
  if (!date) return 'N/A';
  
  const defaultOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  };
  
  try {
    // Handle ISO format dates (YYYY-MM-DD)
    if (typeof date === 'string' && date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      // Split the date string into components
      const [year, month, day] = date.split('-').map(Number);
      // Create date object (month is 0-indexed in JavaScript Date)
      const dateObj = new Date(year, month - 1, day);
      return dateObj.toLocaleDateString(
        undefined, 
        { ...defaultOptions, ...options }
      );
    }
    
    // For other date formats
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date';
    }
    
    return dateObj.toLocaleDateString(
      undefined, 
      { ...defaultOptions, ...options }
    );
  } catch (error) {
    console.error("Error formatting date:", error);
    return 'Invalid Date';
  }
}

/**
 * Formats a currency value
 * 
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: 'USD')
 * @returns {string} - Formatted currency string
 */
export function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Truncates text to a specified length
 * 
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @param {string} [suffix='...'] - Suffix to add to truncated text
 * @returns {string} - Truncated text
 */
export function truncateText(text, length, suffix = '...') {
  if (!text || text.length <= length) return text;
  return text.slice(0, length) + suffix;
}

/**
 * Debounces a function call
 * 
 * @param {Function} fn - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} - Debounced function
 */
export function debounce(fn, delay) {
  let timeoutId;
  
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Downloads a blob as a file
 * Handles creating temporary URLs and cleanup after download
 * 
 * @param {Blob} blob - The file data as a Blob
 * @param {string} filename - The filename to save as
 */
export function downloadBlob(blob, filename) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  
  // Clean up
  setTimeout(() => {
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }, 100);
}

/**
 * Formats a date string with validation and fallback options
 * Especially useful for handling API responses where dates might be null/undefined
 * 
 * @param {string|null|undefined} dateString - Date string to format
 * @param {string} [fallback='N/A'] - Fallback string if date is invalid
 * @returns {string} - Formatted date or fallback string
 */
export function formatAPIDate(dateString, fallback = 'N/A') {
  if (!dateString) return fallback;
  
  try {
    return formatDate(dateString);
  } catch (error) {
    console.warn(`Error formatting API date: ${dateString}`, error);
    return fallback;
  }
}

/**
 * Safely handles API response data, ensuring all date fields are properly formatted
 * Can be used in component lifecycle methods when receiving API responses
 * 
 * @param {Object} data - API response data object
 * @param {Array} dateFields - Array of field names that contain dates
 * @param {string} [fallback='N/A'] - Fallback string for invalid dates
 * @returns {Object} - Data with formatted date fields
 */
export function formatAPIResponseDates(data, dateFields = [], fallback = 'N/A') {
  if (!data) return data;
  
  const formattedData = { ...data };
  
  dateFields.forEach(field => {
    if (formattedData[field]) {
      formattedData[field] = formatAPIDate(formattedData[field], fallback);
    }
  });
  
  return formattedData;
}