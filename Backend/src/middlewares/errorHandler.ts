import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import logger from "../config/logger";
import ApiError  from "../utils/apierror";

const handleMongooseError = (err: mongoose.Error | any): ApiError => {
  if (err instanceof mongoose.Error.CastError) {
    return new ApiError( 400,`Invalid ${err.path}: ${err.value}`);
  }

  if (err instanceof mongoose.Error.ValidationError) {
    const messages = Object.values(err.errors)
      .map((el: any) => el.message)
      .join(", ");
    return new ApiError( 400,`Validation error: ${messages}`,);
  }

  // Handle duplicate key errors
  if (err.code === 11000 && err.keyValue) {
    const field = Object.keys(err.keyValue).join(", ");
    return new ApiError( 400,`Duplicate value for field(s): ${field}`,);
  }

  // Return a generic Mongoose error wrapper
  return new ApiError(500, "Database error", [err.message]);
};

export const ErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Convert mongoose errors
  if (err instanceof mongoose.Error || err.code === 11000) {
    err = handleMongooseError(err);
  }

  // Ensure it's an ApiError
  if (!(err instanceof ApiError)) {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Something went wrong";
    err = new ApiError(statusCode, message);
  }

  const { statusCode, message, stack } = err as ApiError;

  // Enhanced error logging with request context
  const errorContext = {
    statusCode,
    message,
    stack,
    path: req.originalUrl,
    method: req.method,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    timestamp: new Date().toISOString(),
    userId: (req as any).user?.id,
    body: req.method !== 'GET' ? req.body : undefined,
    query: req.query
  };

  // Log error with full context
  logger.error(errorContext, 'Request Error');

  // Send error to external monitoring service if configured
  if (process.env.SENTRY_DSN && statusCode >= 500) {
    // Sentry integration would go here
    // Sentry.captureException(err, { extra: errorContext });
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    ...(process.env.NODE_ENV === "development" && { stack }),
  });
};

// Request logging middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      userId: (req as any).user?.id
    };

    if (res.statusCode >= 400) {
      logger.warn(logData, 'HTTP Request');
    } else {
      logger.info(logData, 'HTTP Request');
    }
  });

  next();
};
