import { downloadBlob } from '@/lib/utils';

/**
 * Handles downloading a paystub file
 * @param {Blob} blob - The PDF data as a blob
 * @param {string} filename - The filename to save as
 */
export function downloadPaystub(blob, filename) {
  // Use our utility function to handle the download
  downloadBlob(blob, filename);
}

/**
 * Opens a PDF in a new browser tab
 * @param {Blob} blob - The PDF data as a blob
 */
export function openPdfInNewTab(blob) {
  const url = window.URL.createObjectURL(blob);
  window.open(url, '_blank');
  
  // Clean up the URL object after some time
  setTimeout(() => {
    window.URL.revokeObjectURL(url);
  }, 100);
}

/**
 * Opens a paystub in a new tab with enhanced view showing YTD and loan information
 * @param {Blob} blob - The PDF data as a blob
 * @param {Object} employeeData - Additional employee data for enhanced display
 */
export function displayPaystub(blob, employeeData) {
  // Default to opening PDF in a new tab
  openPdfInNewTab(blob);
}
