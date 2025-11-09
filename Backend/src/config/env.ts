import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),
  PORT: z.string().default("8000"),
  MONGO_URI: z.string().url(),
  JWT_SECRET: z.string().min(16),
  JWT_EXPIRY: z.string().default("7d"),
  REDIS_URL: z.string().optional(),
  EMAIL_USER: z.string().email(),
  EMAIL_PASS: z.string(),
  CLOUDINARY_URL: z.string().optional()
});

export const env = envSchema.parse(process.env);
