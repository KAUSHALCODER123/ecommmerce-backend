import { Request, Response } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler";
import {
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  listProducts,
} from "./product.service";
import logger from "../../config/logger";
import ApiError from "../../utils/apierror";

export const createProductController = asyncHandler(async (req: Request, res: Response) => {
  // Add createdBy from authenticated user
  const productData = {
    ...req.body,
    createdBy: req.user?.userId
  };

  const product = await createProduct(productData);
  logger.info(`Product created: ${product.name} by user ${req.user?.userId}`);
  
  res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: product
  });
});

export const getProductController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await getProductById(id);
  
  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  
  res.status(200).json({
    success: true,
    data: product
  });
});

export const updateProductController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await updateProduct(id, req.body);
  
  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  
  logger.info(`Product updated: ${product.name} by user ${req.user?.userId}`);
  
  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: product
  });
});

export const deleteProductController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await deleteProduct(id);
  
  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  
  logger.info(`Product deleted: ${product.name} by user ${req.user?.userId}`);
  
  res.status(200).json({
    success: true,
    message: "Product deleted successfully"
  });
});

export const listProductsController = asyncHandler(async (req: Request, res: Response) => {
  const { 
    page = 1, 
    limit = 10, 
    category,
    minPrice,
    maxPrice,
    search,
    sortBy = "createdAt",
    sortOrder = "desc"
  } = req.query;
  
  const filters = {
    ...(category && { category: category as string }),
    ...(minPrice && { minPrice: Number(minPrice) }),
    ...(maxPrice && { maxPrice: Number(maxPrice) }),
    ...(search && { search: search as string })
  };

  const sortOptions = {
    sortBy: sortBy as "name" | "price" | "createdAt" | "stock",
    sortOrder: sortOrder as "asc" | "desc"
  };
  
  const products = await listProducts(
    filters, 
    sortOptions,
    Number(page), 
    Number(limit)
  );
  
  res.status(200).json({
    success: true,
    data: products,
    pagination: {
      currentPage: products.page,
      totalPages: products.totalPages,
      totalProducts: products.totalDocs,
      hasNextPage: products.hasNextPage,
      hasPrevPage: products.hasPrevPage
    }
  });
});

export const searchProductsController = asyncHandler(async (req: Request, res: Response) => {
  const { q: searchTerm, page = 1, limit = 10 } = req.query;
  
  if (!searchTerm) {
    throw new ApiError(400, "Search term is required");
  }
  
  const products = await listProducts(
    { search: searchTerm as string },
    { sortBy: "createdAt", sortOrder: "desc" },
    Number(page),
    Number(limit)
  );
  
  res.status(200).json({
    success: true,
    data: products,
    pagination: {
      currentPage: products.page,
      totalPages: products.totalPages,
      totalProducts: products.totalDocs,
      hasNextPage: products.hasNextPage,
      hasPrevPage: products.hasPrevPage
    }
  });
});