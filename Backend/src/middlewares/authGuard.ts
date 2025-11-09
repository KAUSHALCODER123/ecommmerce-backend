import logger from "../config/logger";

import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/apierror";
import { verifyAccessToken } from "../utils/jwt";

// Extend Express Request interface to include user property
declare module "express" {
    interface Request {
        user?: any;
    }
}

export const auth = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.access_token || req.header('Authorization')?.replace("Bearer ", "");
        
        if (!token) {
            logger.warn({
                message: "Authentication attempt without token",
                ip: req.ip,
                userAgent: req.get('User-Agent'),
                path: req.path
            });
            throw new ApiError(401, "Access denied. No token provided.");
        }

        const decoded = verifyAccessToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        if (error instanceof ApiError) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message
            });
        }
        
        logger.warn({
            message: "Invalid token attempt",
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            path: req.path
        });
        
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

