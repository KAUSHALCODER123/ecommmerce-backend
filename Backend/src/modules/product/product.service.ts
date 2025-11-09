import { Product } from "./product.model";
import {  ProductResponse, PaginatedProducts } from "./product.types";
import ApiError from "../../utils/apierror";
import mongoose from "mongoose";

export interface ProductInput {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  images?: string[];
  createdBy: string;
}

export interface ProductUpdateInput {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  category?: string;
  images?: string[];
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  createdBy?: string;
}

export interface ProductSortOptions {
  sortBy?: "name" | "price" | "createdAt" | "stock";
  sortOrder?: "asc" | "desc";
}

export const createProduct = async (productData: ProductInput): Promise<ProductResponse> => {
  const product = new Product(productData);
  const savedProduct = await product.save();
  return savedProduct.toObject() as ProductResponse;
};

export const getProductById = async (id: string): Promise<ProductResponse | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid product ID format");
  }
  
  return await Product.findById(id).populate("createdBy", "name email").lean() as ProductResponse | null;
};

export const updateProduct = async (id: string, updateData: ProductUpdateInput): Promise<ProductResponse | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid product ID format");
  }

  return await Product.findByIdAndUpdate(
    id, 
    updateData, 
    { new: true, runValidators: true }
  ).populate("createdBy", "name email").lean() as ProductResponse | null;
};

export const deleteProduct = async (id: string): Promise<ProductResponse | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid product ID format");
  }
  
  return await Product.findByIdAndDelete(id).lean() as ProductResponse | null;
};

export const listProducts = async (
  filters: ProductFilters = {}, 
  sortOptions: ProductSortOptions = {},
  page = 1, 
  limit = 10
): Promise<PaginatedProducts> => {
  // Build match conditions
  const matchConditions: any = {};
  
  if (filters.category) {
    matchConditions.category = filters.category;
  }
  
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    matchConditions.price = {};
    if (filters.minPrice !== undefined) {
      matchConditions.price.$gte = filters.minPrice;
    }
    if (filters.maxPrice !== undefined) {
      matchConditions.price.$lte = filters.maxPrice;
    }
  }
  
  if (filters.search) {
    matchConditions.$text = { $search: filters.search };
  }
  
  if (filters.createdBy) {
    matchConditions.createdBy = new mongoose.Types.ObjectId(filters.createdBy);
  }

  // Build sort conditions
  const sortConditions: any = {};
  const sortBy = sortOptions.sortBy || "createdAt";
  const sortOrder = sortOptions.sortOrder === "asc" ? 1 : -1;
  sortConditions[sortBy] = sortOrder;

  const query = Product.aggregate([
    { $match: matchConditions },
    { $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "createdBy",
        pipeline: [{ $project: { name: 1, email: 1 } }]
      }
    },
    { $unwind: { path: "$createdBy", preserveNullAndEmptyArrays: true } },
    { $sort: sortConditions }
  ]);
  
  return await (Product as any).aggregatePaginate(query, { 
    page: Math.max(1, page), 
    limit: Math.min(100, Math.max(1, limit)) 
  });
};
