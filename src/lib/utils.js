
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
  const defaultOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  };
  
  return new Date(date).toLocaleDateString(
    undefined, 
    { ...defaultOptions, ...options }
  );
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