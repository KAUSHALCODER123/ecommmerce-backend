import { Request, Response } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler";
import {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  forgotPassword,
  resetPassword,
  verifyEmail
} from "./auth.service";
import { sendMail } from "../../utils/email";
import logger from "../../config/logger";
import ApiError from "../../utils/apierror";

export const registerController = asyncHandler(async (req: Request, res: Response) => {
  const { user, verificationToken } = await registerUser(req.body);
  
  // Send verification email
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
  
  try {
    await sendMail({
      to: user.email,
      subject: "Verify Your Email",
      html: `
        <h2>Welcome to Our Platform!</h2>
        <p>Thank you for registering. Please verify your email address by clicking the link below:</p>
        <a href="${verificationUrl}">Verify Email</a>
        <p>This link will expire in 24 hours.</p>
      `
    });
  } catch (emailError) {
    logger.error(`Failed to send verification email to ${user.email}: ${emailError instanceof Error ? emailError.message : String(emailError)}`);
    // Don't fail registration if email fails
  }

  logger.info(`User registered: ${user.email}`);

  res.status(201).json({
    success: true,
    message: "User registered successfully. Please check your email for verification.",
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      }
    }
  });
});

export const loginController = asyncHandler(async (req: Request, res: Response) => {
  const authData = await loginUser(req.body);
  
  // Set refresh token as httpOnly cookie
  res.cookie('refreshToken', authData.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  logger.info(`User logged in: ${authData.user.email}`);

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      user: authData.user,
      accessToken: authData.accessToken
    }
  });
});

export const logoutController = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
  
  if (refreshToken) {
    await logoutUser(refreshToken);
  }

  // Clear refresh token cookie
  res.clearCookie('refreshToken');

  logger.info(`User logged out`);

  res.status(200).json({
    success: true,
    message: "Logout successful"
  });
});

export const refreshTokenController = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
  
  if (!refreshToken) {
    throw new ApiError(401, "Refresh token not provided");
  }

  const { accessToken } = await refreshAccessToken(refreshToken);

  res.status(200).json({
    success: true,
    message: "Token refreshed successfully",
    data: {
      accessToken
    }
  });
});

export const forgotPasswordController = asyncHandler(async (req: Request, res: Response) => {
  await forgotPassword(req.body.email);

  res.status(200).json({
    success: true,
    message: "If an account with that email exists, we've sent a password reset link."
  });
});

export const resetPasswordController = asyncHandler(async (req: Request, res: Response) => {
  await resetPassword(req.body.token, req.body.password);

  logger.info(`Password reset completed`);

  res.status(200).json({
    success: true,
    message: "Password reset successful"
  });
});

export const verifyEmailController = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.params;
  
  await verifyEmail(token);

  logger.info(`Email verified successfully`);

  res.status(200).json({
    success: true,
    message: "Email verified successfully"
  });
});