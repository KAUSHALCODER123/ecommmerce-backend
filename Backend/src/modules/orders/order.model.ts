import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import { IOrder } from "./order.types";

const OrderItemSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: [true, "Product ID is required"]
  },
  name: {
    type: String,
    required: [true, "Product name is required"],
    trim: true
  },
  price: {
    type: Number,
    required: [true, "Product price is required"],
    min: [0, "Price cannot be negative"]
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
    min: [1, "Quantity must be at least 1"]
  },
  total: {
    type: Number,
    required: [true, "Item total is required"],
    min: [0, "Total cannot be negative"]
  }
});

const PaymentInfoSchema = new Schema({
  method: {
    type: String,
    enum: ["stripe", "razorpay", "paypal", "cash"],
    required: [true, "Payment method is required"]
  },
  transactionId: {
    type: String,
    sparse: true
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed", "refunded"],
    default: "pending"
  },
  amount: {
    type: Number,
    required: [true, "Payment amount is required"],
    min: [0, "Amount cannot be negative"]
  },
  currency: {
    type: String,
    required: [true, "Currency is required"],
    default: "USD"
  },
  paidAt: {
    type: Date
  }
});

const ShippingAddressSchema = new Schema({
  street: {
    type: String,
    required: [true, "Street address is required"],
    trim: true
  },
  city: {
    type: String,
    required: [true, "City is required"],
    trim: true
  },
  state: {
    type: String,
    required: [true, "State is required"],
    trim: true
  },
  zipCode: {
    type: String,
    required: [true, "Zip code is required"],
    trim: true
  },
  country: {
    type: String,
    required: [true, "Country is required"],
    trim: true,
    default: "USA"
  }
});

const OrderSchema = new Schema<IOrder>({
  orderId: {
    type: String,
    required: [true, "Order ID is required"],
    unique: true,
    index: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User ID is required"],
    index: true
  } as any,
  items: {
    type: [OrderItemSchema],
    required: [true, "Order items are required"],
    validate: {
      validator: function(items: any[]) {
        return items.length > 0;
      },
      message: "Order must have at least one item"
    }
  },
  total: {
    type: Number,
    required: [true, "Order total is required"],
    min: [0, "Total cannot be negative"]
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"],
    default: "pending",
    index: true
  },
  paymentInfo: {
    type: PaymentInfoSchema,
    required: [true, "Payment information is required"]
  },
  shippingAddress: {
    type: ShippingAddressSchema,
    required: [true, "Shipping address is required"]
  }
}, {
  timestamps: true
});

// Generate orderId before saving
OrderSchema.pre("save", function(next) {
  if (!(this as any).orderId) {
    (this as any).orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }
  next();
});

// Indexes
OrderSchema.index({ userId: 1, createdAt: -1 });
OrderSchema.index({ status: 1, createdAt: -1 });
OrderSchema.index({ "paymentInfo.status": 1 });

// Add pagination plugin
OrderSchema.plugin(mongooseAggregatePaginate);

export const Order = mongoose.model<IOrder>("Order", OrderSchema);