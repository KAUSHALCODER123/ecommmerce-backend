import { User } from "./user.model";
import { IUser, UserResponse, PaginatedUsers } from "./user.types";
import ApiError from "../../utils/apierror";
import mongoose from "mongoose";

export interface UserInput {
  name: string;
  email: string;
  password: string;
  role?: "user" | "admin";
  avatar?: string;
}

export interface UserUpdateInput {
  name?: string;
  email?: string;
  role?: "user" | "admin";
  avatar?: string;
}

export interface UserFilters {
  name?: string;
  email?: string;
  role?: "user" | "admin";
  isVerified?: boolean;
}

export const createUser = async (userData: UserInput): Promise<UserResponse> => {
  // Check if user already exists
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new ApiError( 400,"User with this email already exists");
  }

  const user = new User(userData);
  const savedUser = await user.save();
  
  // Return user without password
  const { password, ...userResponse } = savedUser.toObject();
  return userResponse as UserResponse;
};

export const getUserById = async (id: string): Promise<UserResponse | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError( 400,"Invalid user ID format");
  }
  
  return await User.findById(id).select("-password").lean() as UserResponse | null;
};

export const getUserByEmail = async (email: string): Promise<IUser | null> => {
  return await User.findOne({ email });
};

export const updateUser = async (id: string, updateData: UserUpdateInput): Promise<UserResponse | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400,"Invalid user ID format");
  }

  // Check if email is being updated and already exists
  if (updateData.email) {
    const existingUser = await User.findOne({ 
      email: updateData.email, 
      _id: { $ne: id } 
    });
    if (existingUser) {
      throw new ApiError( 400,"Email already in use by another user");
    }
  }

  return await User.findByIdAndUpdate(
    id, 
    updateData, 
    { new: true, runValidators: true }
  ).select("-password").lean() as UserResponse | null;
};

export const deleteUser = async (id: string): Promise<UserResponse | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError( 400,"Invalid user ID format");
  }
  
  return await User.findByIdAndDelete(id).select("-password").lean() as UserResponse | null;
};

export const listUsers = async (
  filters: UserFilters = {}, 
  page = 1, 
  limit = 10
): Promise<PaginatedUsers> => {
  // Build match conditions
  const matchConditions: any = {};
  
  if (filters.name) {
    matchConditions.$text = { $search: filters.name };
  }
  if (filters.email) {
    matchConditions.email = { $regex: filters.email, $options: 'i' };
  }
  if (filters.role) {
    matchConditions.role = filters.role;
  }
  if (filters.isVerified !== undefined) {
    matchConditions.isVerified = filters.isVerified;
  }

  const query = User.aggregate([
    { $match: matchConditions },
    { $project: { password: 0 } },
    { $sort: { createdAt: -1 } }
  ]);
  
  return await (User as any).aggregatePaginate(query, { 
    page: Math.max(1, page), 
    limit: Math.min(100, Math.max(1, limit)) 
  });
}; 