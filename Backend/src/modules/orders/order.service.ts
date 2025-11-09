import { Order } from "./order.model";
import { Product } from "../product/product.model";
import {  OrderResponse, OrderItem } from "./order.types";
import { processPayment } from "./payment.service";
import ApiError from "../../utils/apierror";
import mongoose from "mongoose";

export interface CreateOrderInput {
  items: {
    productId: string;
    quantity: number;
  }[];
  paymentMethod: "stripe" | "razorpay" | "paypal" | "cash";
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  userId: string;
}

export const createOrder = async (orderData: CreateOrderInput): Promise<OrderResponse> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Validate and get product details
    const orderItems: OrderItem[] = [];
    let totalAmount = 0;

    for (const item of orderData.items) {
      const product = await Product.findById(item.productId).session(session);
      if (!product) {
        throw new ApiError(404, `Product not found: ${item.productId}`);
      }

      if (product.stock < item.quantity) {
        throw new ApiError(400, `Insufficient stock for ${product.name}. Available: ${product.stock}`);
      }

      const itemTotal = product.price * item.quantity;
      orderItems.push({
        productId: (product._id as any).toString(),
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        total: itemTotal
      });

      totalAmount += itemTotal;

      // Update product stock
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.quantity } },
        { session }
      );
    }

    // Create order
    const order = new Order({
      userId: orderData.userId,
      items: orderItems,
      total: totalAmount,
      paymentInfo: {
        method: orderData.paymentMethod,
        status: "pending",
        amount: totalAmount,
        currency: "USD"
      },
      shippingAddress: orderData.shippingAddress
    });

    const savedOrder = await order.save({ session });

    // Process payment
    const paymentResult = await processPayment(
      orderData.paymentMethod,
      totalAmount,
      "USD"
    );

    if (paymentResult.success) {
      savedOrder.paymentInfo.status = "completed";
      savedOrder.paymentInfo.transactionId = paymentResult.transactionId;
      savedOrder.paymentInfo.paidAt = new Date();
      savedOrder.status = "confirmed";
    } else {
      savedOrder.paymentInfo.status = "failed";
      // Restore product stock on payment failure
      for (const item of orderData.items) {
        await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { stock: item.quantity } },
          { session }
        );
      }
      throw new ApiError(400, paymentResult.error || "Payment failed");
    }

    await savedOrder.save({ session });
    await session.commitTransaction();

    return savedOrder.toObject() as OrderResponse;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const getOrderById = async (id: string, userId?: string): Promise<OrderResponse | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid order ID format");
  }

  const query: any = { _id: id };
  if (userId) {
    query.userId = userId;
  }

  return await Order.findOne(query)
    .populate("userId", "name email")
    .lean() as OrderResponse | null;
};

export const getUserOrders = async (
  userId: string,
  page = 1,
  limit = 10
): Promise<any> => {
  const query = Order.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    { $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
        pipeline: [{ $project: { name: 1, email: 1 } }]
      }
    },
    { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
    { $sort: { createdAt: -1 } }
  ]);

  return await (Order as any).aggregatePaginate(query, {
    page: Math.max(1, page),
    limit: Math.min(100, Math.max(1, limit))
  });
};

export const updateOrderStatus = async (
  id: string,
  status: string,
  userId?: string
): Promise<OrderResponse | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid order ID format");
  }

  const query: any = { _id: id };
  if (userId) {
    query.userId = userId;
  }

  return await Order.findOneAndUpdate(
    query,
    { status },
    { new: true, runValidators: true }
  ).populate("userId", "name email").lean() as OrderResponse | null;
};

export const getAllOrders = async (
  page = 1,
  limit = 10,
  status?: string
): Promise<any> => {
  const matchConditions: any = {};
  if (status) {
    matchConditions.status = status;
  }

  const query = Order.aggregate([
    { $match: matchConditions },
    { $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
        pipeline: [{ $project: { name: 1, email: 1 } }]
      }
    },
    { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
    { $sort: { createdAt: -1 } }
  ]);

  return await (Order as any).aggregatePaginate(query, {
    page: Math.max(1, page),
    limit: Math.min(100, Math.max(1, limit))
  });
};