/**
 * Utility function to extract error message from HTTP error response
 */
export function extractErrorMessage(error: any): string {
  // Try to get message from error response body
  if (error?.error?.message) {
    return error.error.message;
  }
  
  // Try to get message from error object itself
  if (error?.message) {
    return error.message;
  }
  
  // Try to get message from error string
  if (typeof error === 'string') {
    return error;
  }
  
  // Default fallback
  return 'An unexpected error occurred. Please try again.';
}

/**
 * Utility function to log errors for debugging
 */
export function logError(context: string, error: any): void {
  console.error(`[${context}] Error:`, error);
  console.error(`[${context}] Error structure:`, {
    error: error?.error,
    message: error?.message,
    status: error?.status,
    statusText: error?.statusText
  });
}
