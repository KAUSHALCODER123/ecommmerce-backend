/**
 * Utility functions for sanitizing user input to prevent injection attacks
 */

export const sanitizeForLog = (input: any): string => {
  if (typeof input !== 'string') {
    input = String(input);
  }
  
  // Remove or escape potentially dangerous characters for logging
  return input
    .replace(/[\r\n\t]/g, ' ') // Replace newlines and tabs with spaces
    .replace(/[<>]/g, '') // Remove angle brackets
    .substring(0, 100); // Limit length
};

export const sanitizeEmail = (email: string): string => {
  return email.toLowerCase().trim();
};

export const sanitizeName = (name: string): string => {
  return name.trim().replace(/[<>]/g, '');
};