
import dotenv from "dotenv";
import initializeDatabase from "./loaders/mongoose";
import { loadExpressApp } from "./loaders/express";
import { setupProcessErrorHandlers } from "./utils/processErrorHandler";
import { externalLogger } from "./utils/externalLogging";
import logger from "./config/logger";
import { JobScheduler } from "./jobs/scheduler";
import { createOptimizedIndexes } from "./scripts/createIndexes";

dotenv.config({
    path: './.env'
});

// Setup process-level error handlers
setupProcessErrorHandlers();

const startServer = async () => {
  try {
    logger.info('🚀 Starting Express Application');
    
    // Initialize database
    await initializeDatabase();
    logger.info('✅ Database connected successfully');
    
    // Initialize external logging services
    externalLogger.captureMessage('Application starting', 'info', {
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    });
    
    // Create optimized database indexes
    await createOptimizedIndexes();
    
    // Load Express app
    const app = await loadExpressApp();
    
    // Start background jobs
    const jobScheduler = new JobScheduler();
    jobScheduler.start();
    
    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => {
      logger.info(`🚀 Server running on http://localhost:${PORT}`);
      logger.info(`📊 Environment: ${process.env.NODE_ENV}`);
    });
    
    // Graceful shutdown handling
    const gracefulShutdown = () => {
      logger.info('🔄 Starting graceful shutdown');
      server.close(() => {
        logger.info('✅ HTTP server closed');
        process.exit(0);
      });
    };
    
    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);
    
  } catch (error) {
    logger.fatal(`💥 Server failed to start: ${error}`);
    externalLogger.captureError(error as Error, {
      context: 'server_startup',
      timestamp: new Date().toISOString()
    });
    process.exit(1);
  }
};

startServer();