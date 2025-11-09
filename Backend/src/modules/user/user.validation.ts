/*Validation (user.validation.ts)

Zod/Joi schemas for:

Creating user

Updating profile

Changing password*/ 

import * as z from 'zod';


export const createUserSchema = z.object({
  name: z.string().min(4).max(50),
  email: z.email(),
  password: z.string().min(8).max(255).refine(
    (val) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(val),
    { message: "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character" }
  ),
  role: z.enum(['user', 'admin']).optional(),
  avatar: z.string().optional(),
  isVerified: z.boolean().optional(),
});

export const UpdateUserSchema=z.object({
  name:z.string().min(4).max(50).optional(),
  email:z.email().optional(),
  avatar:z.string().optional()
})

export const LoginUserSchema=z.object({
  email:z.email(),
  password:z.string().min(8).max(255)
})