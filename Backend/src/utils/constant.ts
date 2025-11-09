//⚒️ utils/constants.ts
//Keep constants like roles, rate limits, etc.

// src/utils/constants.ts

// User roles
export enum UserRoles {
  ADMIN = "admin",
  USER = "user",
  SELLER = "seller",
}

// Rate limiting values
export const RATE_LIMIT = {
  MAX_REQUESTS_PER_HOUR: 200,
  WINDOW_MS: 60 * 60 * 1000, // 1 hour
};

// Password policies
export const PASSWORD_POLICY = {
  MIN_LENGTH: 8,
  MAX_LENGTH: 64,
};

// Token expiry times
export const TOKEN_EXPIRY = {
  ACCESS: "15m",
  REFRESH: "7d",
};

// Generic messages (optional)
export const MESSAGES = {
  UNAUTHORIZED: "You are not authorized to access this resource.",
  FORBIDDEN: "You don't have permission to perform this action.",
  SERVER_ERROR: "Something went wrong. Please try again later.",
};
