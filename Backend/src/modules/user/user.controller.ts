import { asyncHandler } from "../../middlewares/asyncHandler";
import { createUser, getUserById, updateUser, deleteUser, listUsers } from "./user.service";
import logger from "../../config/logger";
import { Request, Response } from "express";
import ApiError from "../../utils/apierror";
import { ApiResponse } from "../../utils/apiResponse";
import { sanitizeForLog } from "../../utils/sanitizer";

const createUserController = asyncHandler(async (req: Request, res: Response) => {
  const user = await createUser(req.body);
  logger.info({
    message: "User created successfully",
    userId: user._id,
    email: sanitizeForLog(user.email)
  });
  
  ApiResponse.success(res, user, "User created successfully", 201);
});

const getUserController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  // If no ID provided (profile route), use authenticated user's ID
  const userId = id || (req.user as any)?.userId;
  
  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }
  
  const user = await getUserById(userId);
  
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  
  ApiResponse.success(res, user);
});

const updateUserController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  // If no ID provided (profile route), use authenticated user's ID
  const userId = id || (req.user as any)?.userId;
  
  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }
  
  const user = await updateUser(userId, req.body);
  
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  
  logger.info({
    message: "User updated successfully",
    userId: user._id,
    email: sanitizeForLog(user.email)
  });
  
  ApiResponse.success(res, user, "User updated successfully");
});

const deleteUserController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await deleteUser(id);
  
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  
  logger.info({
    message: "User deleted successfully",
    userId: user._id,
    email: sanitizeForLog(user.email)
  });
  
  ApiResponse.success(res, null, "User deleted successfully");
});

const listUsersController = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, ...filters } = req.query;
  
  // Convert query params to proper types
  const pageNum = parseInt(page as string) || 1;
  const limitNum = parseInt(limit as string) || 10;
  
  const users = await listUsers(filters, pageNum, limitNum);
  
  ApiResponse.success(res, {
    users: users.docs,
    pagination: {
      currentPage: users.page,
      totalPages: users.totalPages,
      totalUsers: users.totalDocs,
      hasNextPage: users.hasNextPage,
      hasPrevPage: users.hasPrevPage
    }
  });
});

export {
  createUserController,
  getUserController,
  updateUserController,
  deleteUserController,
  listUsersController
};