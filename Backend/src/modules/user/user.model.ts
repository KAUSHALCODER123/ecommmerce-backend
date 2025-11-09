import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import { hashPassword, comparePassword } from "../../utils/password";
import { IUser } from "./user.types";

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    minlength: [2, "Name must be at least 2 characters long"],
    maxlength: [50, "Name cannot exceed 50 characters"]
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    index: true,
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please provide a valid email"]
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters long"]
  },
  role: {
    type: String,
    enum: {
      values: ["user", "admin"],
      message: "Role must be either user or admin"
    },
    default: "user"
  },
  avatar: {
    type: String,
    default: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      const { password, ...userObject } = ret;
      return userObject;
    }
  }
});

// Indexes
UserSchema.index({ name: "text" });
UserSchema.index({ role: 1 });
UserSchema.index({ createdAt: -1 });

// Pre-save middleware to hash password
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await hashPassword(this.password);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare password
UserSchema.methods.isPasswordCorrect = async function (password: string): Promise<boolean> {
  return await comparePassword(password, this.password);
};

// Add pagination plugin
UserSchema.plugin(mongooseAggregatePaginate);

export const User = mongoose.model<IUser>("User", UserSchema);