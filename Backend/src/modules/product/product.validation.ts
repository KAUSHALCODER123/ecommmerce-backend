import * as z from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().min(10).max(1000),
  price: z.number().min(0).finite(),
  stock: z.number().int().min(0),
  category: z.enum(["electronics", "clothing", "books", "home", "sports", "beauty", "toys", "other"]),
  images: z.array(z.string().url()).max(10).optional().default([])
});

export const updateProductSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  description: z.string().min(10).max(1000).optional(),
  price: z.number().min(0).finite().optional(),
  stock: z.number().int().min(0).optional(),
  category: z.enum(["electronics", "clothing", "books", "home", "sports", "beauty", "toys", "other"]).optional(),
  images: z.array(z.string().url()).max(10).optional()
});

export const productQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  category: z.enum(["electronics", "clothing", "books", "home", "sports", "beauty", "toys", "other"]).optional(),
  minPrice: z.string().regex(/^\d+(\.\d+)?$/).transform(Number).optional(),
  maxPrice: z.string().regex(/^\d+(\.\d+)?$/).transform(Number).optional(),
  search: z.string().optional(),
  sortBy: z.enum(["name", "price", "createdAt", "stock"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional()
});