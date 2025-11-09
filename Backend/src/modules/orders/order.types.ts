import { Document } from "mongoose";

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

export interface PaymentInfo {
  method: "stripe" | "razorpay" | "paypal" | "cash";
  transactionId?: string;
  status: "pending" | "completed" | "failed" | "refunded";
  amount: number;
  currency: string;
  paidAt?: Date;
}

export interface IOrder extends Document {
  orderId: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentInfo: PaymentInfo;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderResponse {
  _id: string;
  orderId: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: string;
  paymentInfo: PaymentInfo;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt: Date;
  updatedAt: Date;
}