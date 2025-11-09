import request from 'supertest';
import { Express } from 'express';
import { User } from '../modules/user/user.model';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';

export const createTestUser = async (userData = {}) => {
  const defaultUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    role: 'user',
    isVerified: true,
  };
  
  const user = new User({ ...defaultUser, ...userData });
  await user.save();
  return user;
};

export const createAuthenticatedUser = async (app: Express, userData = {}) => {
  const user = await createTestUser(userData);
  const accessToken = generateAccessToken({ userId: (user._id as any).toString() });
  const refreshToken = generateRefreshToken({ userId: (user._id as any).toString() });
  
  return {
    user,
    tokens: { accessToken, refreshToken },
    authHeader: `Bearer ${accessToken}`,
  };
};

export const makeRequest = (app: Express) => request(app);