import * as z from 'zod';

const orderItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1)
});

const shippingAddressSchema = z.object({
  street: z.string().min(1).max(200),
  city: z.string().min(1).max(100),
  state: z.string().min(1).max(100),
  zipCode: z.string().min(1).max(20),
  country: z.string().min(1).max(100).default("USA")
});

export const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1),
  paymentMethod: z.enum(["stripe", "razorpay", "paypal", "cash"]),
  shippingAddress: shippingAddressSchema
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"])
});