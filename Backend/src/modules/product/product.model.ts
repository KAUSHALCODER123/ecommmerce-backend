import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import { IProduct } from "./product.types";

const ProductSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: [true, "Product name is required"],
    trim: true,
    minlength: [2, "Product name must be at least 2 characters long"],
    maxlength: [100, "Product name cannot exceed 100 characters"]
  },
  description: {
    type: String,
    required: [true, "Product description is required"],
    trim: true,
    minlength: [10, "Description must be at least 10 characters long"],
    maxlength: [1000, "Description cannot exceed 1000 characters"]
  },
  price: {
    type: Number,
    required: [true, "Product price is required"],
    min: [0, "Price cannot be negative"],
    validate: {
      validator: function(value: number) {
        return Number.isFinite(value) && value >= 0;
      },
      message: "Price must be a valid positive number"
    }
  },
  stock: {
    type: Number,
    required: [true, "Stock quantity is required"],
    min: [0, "Stock cannot be negative"],
    validate: {
      validator: function(value: number) {
        return Number.isInteger(value) && value >= 0;
      },
      message: "Stock must be a non-negative integer"
    }
  },
  category: {
    type: String,
    required: [true, "Product category is required"],
    trim: true,
    enum: {
      values: ["electronics", "clothing", "books", "home", "sports", "beauty", "toys", "other"],
      message: "Category must be one of: electronics, clothing, books, home, sports, beauty, toys, other"
    }
  },
  images: {
    type: [String],
    default: [],
    validate: {
      validator: function(images: string[]) {
        return images.length <= 10;
      },
      message: "Cannot have more than 10 images"
    }
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Created by user is required"]
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      return ret;
    }
  }
});

// Indexes for better performance
ProductSchema.index({ name: "text", description: "text" });
ProductSchema.index({ category: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ stock: 1 });
ProductSchema.index({ createdBy: 1 });
ProductSchema.index({ createdAt: -1 });

// Add pagination plugin
ProductSchema.plugin(mongooseAggregatePaginate);

export const Product = mongoose.model<IProduct>("Product", ProductSchema);