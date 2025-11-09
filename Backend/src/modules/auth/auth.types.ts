export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  isVerified: boolean;
}

export interface LoginResponse {
  user: AuthUser;
  accessToken: string;
}

export interface RegisterResponse {
  user: AuthUser;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  isAdmin: boolean;
  iat?: number;
  exp?: number;
}

export interface VerificationTokenPayload {
  userId: string;
  type: 'verification' | 'password-reset';
  iat?: number;
  exp?: number;
}