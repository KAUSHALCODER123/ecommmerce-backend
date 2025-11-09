import { Request, Response, NextFunction } from 'express';
import mongoSanitize from 'express-mongo-sanitize';

// Sanitize all user inputs
export const sanitizeInputs = (req: Request, res: Response, next: NextFunction) => {
  // Remove any keys that start with '$' or contain '.'
  mongoSanitize.sanitize(req.body);
  mongoSanitize.sanitize(req.query);
  mongoSanitize.sanitize(req.params);
  
  // Additional sanitization for common XSS patterns
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  
  next();
};

const sanitizeObject = (obj: any): any => {
  if (typeof obj !== 'object' || obj === null) {
    return typeof obj === 'string' ? sanitizeString(obj) : obj;
  }
  
  const sanitized: any = Array.isArray(obj) ? [] : {};
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      sanitized[key] = sanitizeObject(obj[key]);
    }
  }
  
  return sanitized;
};

const sanitizeString = (str: string): string => {
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
};