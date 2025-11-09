import { Request, Response, NextFunction } from 'express';
import { createHash } from 'crypto';

// Simple in-memory cache (use Redis in production)
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

export const cacheMiddleware = (ttlSeconds: number = 300) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = generateCacheKey(req);
    const cached = cache.get(key);

    if (cached && Date.now() - cached.timestamp < cached.ttl * 1000) {
      return res.json(cached.data);
    }

    // Override res.json to cache the response
    const originalJson = res.json;
    res.json = function(data: any) {
      cache.set(key, {
        data,
        timestamp: Date.now(),
        ttl: ttlSeconds
      });
      
      // Clean up expired entries periodically
      if (Math.random() < 0.01) {
        cleanupCache();
      }
      
      return originalJson.call(this, data);
    };

    next();
  };
};

const generateCacheKey = (req: Request): string => {
  const key = `${req.originalUrl}:${JSON.stringify(req.query)}`;
  return createHash('md5').update(key).digest('hex');
};

const cleanupCache = () => {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > value.ttl * 1000) {
      cache.delete(key);
    }
  }
};