import { Router } from "express";
import { auth } from "../../middlewares/authGuard";
import { permission } from "../../middlewares/permissionGuard";
import { validateRequest } from "../../middlewares/validateRequest";
import { limiter } from "../../middlewares/rateLimiter";
import {
  createOrderSchema,
  updateOrderStatusSchema
} from "./order.validation";
import {
  createOrderController,
  getOrderController,
  getUserOrdersController,
  updateOrderStatusController,
  getAllOrdersController
} from "./order.controller";

const router = Router();

// Apply rate limiting and authentication to all routes
router.use(limiter);
router.use(auth);

// POST /orders - Create order (authenticated users)
router.post(
  "/",
  validateRequest({ body: createOrderSchema }),
  createOrderController
);

// GET /orders - Get user's orders (authenticated users)
router.get(
  "/",
  getUserOrdersController
);

// GET /orders/all - Get all orders (admin only)
router.get(
  "/all",
  permission,
  getAllOrdersController
);

// GET /orders/:id - Get order by ID (authenticated users)
router.get(
  "/:id",
  getOrderController
);

// PATCH /orders/:id/status - Update order status (authenticated users)
router.patch(
  "/:id/status",
  validateRequest({ body: updateOrderStatusSchema }),
  updateOrderStatusController
);

export default router;