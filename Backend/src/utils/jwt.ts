import jwt, { SignOptions, JwtPayload } from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || process.env.JWT_PRIVATE_KEY as string;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || process.env.JWT_PRIVATE_KEY as string;

export const generateAccessToken = (payload: object) => {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_ACCESS_EXPIRES_IN || "15m") as any,
  };

  const token = jwt.sign(payload, ACCESS_SECRET, options);
  return token;
};

export const generateRefreshToken = (payload: object) => {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || "7d") as any,
  };

  const token = jwt.sign(payload, REFRESH_SECRET, options);
  return token;
};

export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, ACCESS_SECRET) as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, REFRESH_SECRET) as JwtPayload;
};
