import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import pinoHTTP from "pino-http";

import { apiLimiter } from "../middlewares/advancedRateLimiter";
import { sanitizeInputs } from "../middlewares/sanitizeInput";
import { requestLogger, ErrorHandler } from "../middlewares/errorHandler";

import { loadRoutes } from "./routes";
import logger from "../config/logger";

export const loadExpressApp = async () => {
  const app = express();

  // Trust proxy if behind load balancer
  app.set("trust proxy", 1);

  // Security middleware
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  }));

  // Compression middleware
  app.use(compression());

  // CORS configuration for production
  const corsOptions = {
    origin: process.env.NODE_ENV === "production" 
      ? process.env.FRONTEND_URL?.split(",") || ["https://yourdomain.com"]
      : ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  };
  app.use(cors(corsOptions));

  // Body parsing middleware with size limit
  app.use(express.json({ limit: "10kb" }));
  app.use(express.urlencoded({ extended: true, limit: "10kb" }));
  app.use(cookieParser());

  // Request logging middleware
  app.use(requestLogger);
  
  // Pino HTTP logging
  app.use(pinoHTTP({ 
    logger,
    customLogLevel: (req, res, err) => {
      if (res.statusCode >= 400 && res.statusCode < 500) return "warn";
      if (res.statusCode >= 500 || err) return "error";
      return "info";
    },
  }));

  // Rate limiting
  app.use(apiLimiter);
  
  // Input sanitization
  app.use(sanitizeInputs);

  // Health check endpoint
  app.get("/health", (_, res) => res.json({ status: "OK", timestamp: new Date().toISOString() }));

  // Load application routes
  await loadRoutes(app);

  // Global error handler (must be last)
  app.use(ErrorHandler);

  return app;
};