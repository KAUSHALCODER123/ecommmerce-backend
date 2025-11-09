import { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  avatar: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  isPasswordCorrect(password: string): Promise<boolean>;
}

export interface UserResponse {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  avatar: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedUsers {
  docs: UserResponse[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}