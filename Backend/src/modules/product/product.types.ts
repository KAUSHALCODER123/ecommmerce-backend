import { Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  images: string[];
  createdBy: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductResponse {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  images: string[];
  createdBy: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedProducts {
  docs: ProductResponse[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}