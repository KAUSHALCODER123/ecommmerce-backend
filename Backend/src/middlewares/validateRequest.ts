

import { ZodObject, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";
import logger from "../config/logger";

interface SchemaSet {
  body?: ZodObject;
  query?: ZodObject;
  params?: ZodObject;
}

// A middleware factory: takes schemas → returns an Express middleware
export const validateRequest =
  (schemas: SchemaSet) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate body, query, and params if provided
      if (schemas.body) 
        {
        const parsedBody = schemas.body.parse(req.body);
        req.body = parsedBody;
      }

      if (schemas.query) {
        const parsedQuery = schemas.query.parse(req.query);
        req.query = parsedQuery as any;
      }

      if (schemas.params) {
        const parsedParams = schemas.params.parse(req.params);
        req.params = parsedParams as any;
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details = error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        logger.warn(`Validation failed, ${ details }`);

        return res.status(400).json({
          success: false,
          error: "Validation Error",
          details,
        });
      }

      // Catch unexpected errors
      logger.error(`Unexpected validation error${error}`);
      return res.status(500).json({
        success: false,
        error: "Internal Server Error during validation",
      });
    }
  };
