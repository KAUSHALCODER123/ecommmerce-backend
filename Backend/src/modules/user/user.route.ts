import { Router } from "express";
import { auth } from "../../middlewares/authGuard";
import { permission } from "../../middlewares/permissionGuard";
import { validateRequest } from "../../middlewares/validateRequest";
import { limiter } from "../../middlewares/rateLimiter";
import { createUserSchema, UpdateUserSchema } from "./user.validation";
import {
  createUserController,
  getUserController,
  updateUserController,
  deleteUserController,
  listUsersController
} from "./user.controller";

const router = Router();

// Apply rate limiting to all user routes
router.use(limiter);

// GET /users/profile - Get current user profile
router.get(
  "/profile",
  auth,
  getUserController
);

// PATCH /users/profile - Update current user profile
router.patch(
  "/profile",
  auth,
  validateRequest({ body: UpdateUserSchema }),
  updateUserController
);

// POST /users - Create user (admin only)
router.post(
  "/",
  auth,
  permission,
  validateRequest({ body: createUserSchema }),
  createUserController
);

// GET /users - List users (admin only)
router.get(
  "/",
  auth,
  permission,
  listUsersController
);

// GET /users/:id - Get user by ID (authenticated users)
router.get(
  "/:id",
  auth,
  getUserController
);

// PATCH /users/:id - Update user (admin only)
router.patch(
  "/:id",
  auth,
  permission,
  validateRequest({ body: UpdateUserSchema }),
  updateUserController
);

// DELETE /users/:id - Delete user (admin only)
router.delete(
  "/:id",
  auth,
  permission,
  deleteUserController
);

export default router;