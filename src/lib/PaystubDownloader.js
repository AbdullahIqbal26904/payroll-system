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
