import { Router } from "express";
import { auth } from "../../middlewares/authGuard";

import { validateRequest } from "../../middlewares/validateRequest";
import { limiter } from "../../middlewares/rateLimiter";
import { cacheMiddleware } from "../../middlewares/cache";
import {
  createProductSchema,
  updateProductSchema,
  productQuerySchema
} from "./product.validation";
import {
  createProductController,
  getProductController,
  updateProductController,
  deleteProductController,
  listProductsController,
} from "./product.controller";

const router = Router();

// Apply rate limiting to all product routes
router.use(limiter);

// GET /products/search - Search products (public, cached for 2 minutes)
router.get(
  "/search",
  cacheMiddleware(120),
  listProductsController
);

// GET /products - List products with filters (public, cached for 5 minutes)
router.get(
  "/",
  cacheMiddleware(300),
  validateRequest({ query: productQuerySchema }),
  listProductsController
);

// POST /products - Create product (authenticated users only)
router.post(
  "/",
  auth,
  validateRequest({ body: createProductSchema }),
  createProductController
);

// GET /products/:id - Get product by ID (public, cached for 10 minutes)
router.get(
  "/:id",
  cacheMiddleware(600),
  getProductController
);

// PATCH /products/:id - Update product (authenticated users only)
router.patch(
  "/:id",
  auth,
  validateRequest({ body: updateProductSchema }),
  updateProductController
);

// DELETE /products/:id - Delete product (authenticated users only)
router.delete(
  "/:id",
  auth,
  deleteProductController
);

export default router;