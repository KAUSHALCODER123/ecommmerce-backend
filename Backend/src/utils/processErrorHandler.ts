import logger from "../config/logger";

export const setupProcessErrorHandlers = () => {
  // Handle uncaught exceptions
  process.on("uncaughtException", (error: Error) => {
    logger.fatal({
      error: error.message,
      stack: error.stack,
      type: "uncaughtException",
      timestamp: new Date().toISOString()
    }, "Uncaught Exception - Server shutting down");

    // Send to external monitoring service
    if (process.env.SENTRY_DSN) {
      // Sentry.captureException(error);
    }

    // Graceful shutdown
    process.exit(1);
  });

  // Handle unhandled promise rejections
  process.on("unhandledRejection", (reason: any, promise: Promise<any>) => {
    logger.fatal({
      reason: reason?.message || reason,
      stack: reason?.stack,
      type: "unhandledRejection",
      timestamp: new Date().toISOString()
    }, "Unhandled Promise Rejection - Server shutting down");

    // Send to external monitoring service
    if (process.env.SENTRY_DSN) {
      // Sentry.captureException(new Error(reason));
    }

    // Graceful shutdown
    process.exit(1);
  });

  // Handle SIGTERM for graceful shutdown
  process.on("SIGTERM", () => {
    logger.info("SIGTERM received - Starting graceful shutdown");
    
    // Close server connections, database, etc.
    process.exit(0);
  });

  // Handle SIGINT (Ctrl+C)
  process.on("SIGINT", () => {
    logger.info("SIGINT received - Starting graceful shutdown");
    
    // Close server connections, database, etc.
    process.exit(0);
  });
};