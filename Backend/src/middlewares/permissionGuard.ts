import logger from "../config/logger";
import { Request, Response, NextFunction } from "express";

export const permission = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    logger.error("Access denied. No user found or invalid token.");
    res.status(401).json({ success: false, message: "Access denied. No token provided." });
    return;
  }

  // If user exists but not admin
  if (!req.user.isAdmin) {
    logger.error(`Access denied. User '${req.user.id || "unknown"}' is not an admin.`);
    res.status(403).json({ success: false, message: "Forbidden. Admin access required." });
    return;
  }


  
  next();
};
