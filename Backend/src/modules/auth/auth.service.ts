import { User } from "../user/user.model";
import { IUser } from "../user/user.types";
import ApiError from "../../utils/apierror";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt";
import { sendMail } from "../../utils/email";
import jwt from "jsonwebtoken";
// import redisClient from "../../config/redis";


export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    isVerified: boolean;
  };
  accessToken: string;
  refreshToken: string;
}

// const REFRESH_TOKEN_SET_KEY = "refresh_tokens";

export const registerUser = async (userData: RegisterInput): Promise<{ user: IUser; verificationToken: string }> => {
  // Check if user already exists
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new ApiError(400, "User with this email already exists");
  }

  // Create user
  const user = new User(userData);
  await user.save();

  // Generate verification token using JWT
  const tokenPayload = { userId: user._id, type: 'verification' };
  const token = jwt.sign(tokenPayload, process.env.JWT_PRIVATE_KEY!, { expiresIn: '24h' });

  return { user, verificationToken: token };
};

export const loginUser = async (loginData: LoginInput): Promise<AuthResponse> => {
  // Find user by email
  const user = await User.findOne({ email: loginData.email });
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  // Check password
  const isPasswordValid = await user.isPasswordCorrect(loginData.password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  // Generate tokens
  const tokenPayload = { 
    userId: user._id, 
    email: user.email, 
    role: user.role,
    isAdmin: user.role === 'admin'
  };
  
  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken({ userId: user._id });

  // Store refresh token in memory (use Redis in production)
  // await redisClient.sAdd(REFRESH_TOKEN_SET_KEY, refreshToken);

  return {
    user: {
      id: (user._id as any).toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified
    },
    accessToken,
    refreshToken
  };
};

export const refreshAccessToken = async (refreshToken: string): Promise<{ accessToken: string }> => {
  // Check if refresh token exists (simplified for now)
  // const tokenExists = await redisClient.sIsMember(REFRESH_TOKEN_SET_KEY, refreshToken);
  // if (!tokenExists) {
  //   throw new ApiError(401, "Invalid refresh token");
  // }

  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as any;
    
    // Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Generate new access token
    const tokenPayload = { 
      userId: user._id, 
      email: user.email, 
      role: user.role,
      isAdmin: user.role === 'admin'
    };
    
    const accessToken = generateAccessToken(tokenPayload);

    return { accessToken };
  } catch (error) {
    // await redisClient.sRem(REFRESH_TOKEN_SET_KEY, refreshToken);
    throw new ApiError(401, "Invalid refresh token");
  }
};

export const logoutUser = async (refreshToken: string): Promise<void> => {
  // await redisClient.sRem(REFRESH_TOKEN_SET_KEY, refreshToken);
};

export const forgotPassword = async (email: string): Promise<void> => {
  const user = await User.findOne({ email });
  if (!user) {
    // Don't reveal if email exists or not
    return;
  }

  // Generate reset token
  const tokenPayload = { userId: user._id, type: 'password-reset' };
  const token = jwt.sign(tokenPayload, process.env.JWT_PRIVATE_KEY!, { expiresIn: '1h' });

  // Send reset email
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  
  await sendMail({
    to: user.email,
    subject: "Password Reset Request",
    html: `
      <h2>Password Reset</h2>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `
  });
};

export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY!) as any;
    
    if (decoded.type !== 'password-reset') {
      throw new ApiError(400, "Invalid token");
    }

    // Find user and update password
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    user.password = newPassword;
    await user.save();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new ApiError(400, "Invalid or expired token");
    }
    throw error;
  }
};

export const verifyEmail = async (token: string): Promise<void> => {
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY!) as any;
    
    if (decoded.type !== 'verification') {
      throw new ApiError(400, "Invalid token");
    }

    // Find user and verify email
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (user.isVerified) {
      throw new ApiError(400, "Email already verified");
    }

    user.isVerified = true;
    await user.save();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new ApiError(400, "Invalid or expired token");
    }
    throw error;
  }
};