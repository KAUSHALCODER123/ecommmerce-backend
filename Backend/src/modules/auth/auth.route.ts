import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { authLimiter, passwordResetLimiter } from "../../middlewares/advancedRateLimiter";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  refreshTokenSchema
} from "./auth.validation";
import {
  registerController,
  loginController,
  logoutController,
  refreshTokenController,
  forgotPasswordController,
  resetPasswordController,
  verifyEmailController
} from "./auth.controller";

const router = Router();

// Apply strict rate limiting to auth routes
router.use(authLimiter);

// POST /auth/register
router.post(
  "/register",
  validateRequest({ body: registerSchema }),
  registerController
);

// POST /auth/login
router.post(
  "/login",
  validateRequest({ body: loginSchema }),
  loginController
);

// POST /auth/logout
router.post(
  "/logout",
  logoutController
);

// POST /auth/refresh
router.post(
  "/refresh",
  validateRequest({ body: refreshTokenSchema }),
  refreshTokenController
);

// POST /auth/forgot-password
router.post(
  "/forgot-password",
  passwordResetLimiter,
  validateRequest({ body: forgotPasswordSchema }),
  forgotPasswordController
);

// POST /auth/reset-password
router.post(
  "/reset-password",
  passwordResetLimiter,
  validateRequest({ body: resetPasswordSchema }),
  resetPasswordController
);

// GET /auth/verify/:token
router.get(
  "/verify/:token",
  verifyEmailController
);

export default router;