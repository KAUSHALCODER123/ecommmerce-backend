import { Request, Response } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler";
import {
  createOrder,
  getOrderById,
  getUserOrders,
  updateOrderStatus,
  getAllOrders
} from "./order.service";
import logger from "../../config/logger";
import ApiError from "../../utils/apierror";

export const createOrderController = asyncHandler(async (req: Request, res: Response) => {
  const orderData = {
    ...req.body,
    userId: req.user?.userId
  };

  const order = await createOrder(orderData);
  logger.info(`Order created: ${order.orderId} by user ${req.user?.userId}`);

  res.status(201).json({
    success: true,
    message: "Order created successfully",
    data: order
  });
});

export const getOrderController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.isAdmin ? undefined : req.user?.userId;
  
  const order = await getOrderById(id, userId);
  
  if (!order) {
    throw new ApiError(404, "Order not found");
  }
  
  res.status(200).json({
    success: true,
    data: order
  });
});

export const getUserOrdersController = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 10 } = req.query;
  const userId = req.user?.userId;
  
  const orders = await getUserOrders(
    userId,
    Number(page),
    Number(limit)
  );
  
  res.status(200).json({
    success: true,
    data: orders,
    pagination: {
      currentPage: orders.page,
      totalPages: orders.totalPages,
      totalOrders: orders.totalDocs,
      hasNextPage: orders.hasNextPage,
      hasPrevPage: orders.hasPrevPage
    }
  });
});

export const updateOrderStatusController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const userId = req.user?.isAdmin ? undefined : req.user?.userId;
  
  const order = await updateOrderStatus(id, status, userId);
  
  if (!order) {
    throw new ApiError(404, "Order not found");
  }
  
  logger.info(`Order status updated: ${order.orderId} to ${status} by user ${req.user?.userId}`);
  
  res.status(200).json({
    success: true,
    message: "Order status updated successfully",
    data: order
  });
});

export const getAllOrdersController = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, status } = req.query;
  
  const orders = await getAllOrders(
    Number(page),
    Number(limit),
    status as string
  );
  
  res.status(200).json({
    success: true,
    data: orders,
    pagination: {
      currentPage: orders.page,
      totalPages: orders.totalPages,
      totalOrders: orders.totalDocs,
      hasNextPage: orders.hasNextPage,
      hasPrevPage: orders.hasPrevPage
    }
  });
});