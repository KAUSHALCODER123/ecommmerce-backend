import { formatDistance } from "date-fns/formatDistance";
import { subDays } from "date-fns/subDays";
import logger from "@config/logger";

export const product_name_slugify = (productname: string) => {
  const slugged = productname
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // remove special chars
    .replace(/\s+/g, "-"); // replace spaces with dashes

  return slugged;
};

export const DateTimeHelper = (timestamp: string) => {
  const date = new Date(timestamp);

  if (isNaN(date.getTime())) {
    logger.error("Invalid timestamp in DateTimeHelper");
    throw new Error("Invalid date timestamp");
  }

  const readable_date = new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeStyle: "long",
    timeZone: "Asia/Kolkata",
  }).format(date);

  const result = formatDistance(subDays(new Date(), 3), new Date(), { addSuffix: true });


  return { readable_date, result };
};


// ======================
// OBJECT & ARRAY HELPERS
// ======================

// Deep clone an object safely
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

// Deep merge two objects
export const deepMerge = (target: any, source: any): any => {
  if (typeof target !== 'object' || typeof source !== 'object') return source;
  const merged = { ...target };
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      merged[key] =
        typeof source[key] === 'object' && !Array.isArray(source[key])
          ? deepMerge(target[key] || {}, source[key])
          : source[key];
    }
  }
  return merged;
};

// Pick specific keys from an object
export const pick = <T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Partial<T> => {
  const result: Partial<T> = {};
  keys.forEach((key) => {
    if (key in obj) result[key] = obj[key];
  });
  return result;
};

// Remove undefined or null fields from an object
export const cleanObject = <T extends object>(obj: T): Partial<T> => {
  const result: Partial<T> = {};
  Object.keys(obj).forEach((key) => {
    const value = obj[key as keyof T];
    if (value !== undefined && value !== null) result[key as keyof T] = value;
  });
  return result;
};

// ======================
// VALIDATION & PARSING HELPERS
// ======================

// Check if string is a valid email
export const isEmail = (str: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(str);
};

// Check if string is a valid phone number (simple international format)
export const isPhone = (str: string): boolean => {
  const regex = /^\+?[1-9]\d{1,14}$/;
  return regex.test(str);
};

// Check if string is a valid UUID (v4)
export const isUUID = (str: string): boolean => {
  const regex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return regex.test(str);
};

// Parse JSON safely
export const safeJsonParse = <T = any>(str: string, defaultValue: T): T => {
  try {
    return JSON.parse(str);
  } catch {
    return defaultValue;
  }
};

// ======================
// MISCELLANEOUS UTILITIES
// ======================

// Generate a random number between min and max
export const randomNumber = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// Generate a random string of given length
export const randomString = (length: number): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

// Generate initials from a full name
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((word) => word[0]?.toUpperCase() || '')
    .join('');
};

// Clean file paths (replace backslashes with forward slashes, remove trailing slashes)
export const cleanFilePath = (path: string): string => {
  return path.replace(/\\/g, '/').replace(/\/+$/, '');
};

// Normalize filenames (remove invalid characters)
export const normalizeFilename = (filename: string): string => {
  return filename.replace(/[^a-zA-Z0-9.\-_]/g, '_');
};
