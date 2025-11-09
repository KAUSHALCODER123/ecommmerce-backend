import * as z from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(8).max(255).refine(
    (val) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(val),
    { message: "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character" }
  ),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(255)
});

export const forgotPasswordSchema = z.object({
  email: z.email()
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8).max(255).refine(
    (val) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(val),
    { message: "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character" }
  )
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1)
});