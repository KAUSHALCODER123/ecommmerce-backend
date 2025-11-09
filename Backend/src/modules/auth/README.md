# Auth Module

Complete authentication system with JWT tokens, email verification, password reset, and refresh token functionality.

## Features

- ✅ User registration with email verification
- ✅ User login with JWT tokens
- ✅ Refresh token mechanism
- ✅ Password reset via email
- ✅ Email verification
- ✅ Secure logout
- ✅ Input validation with Zod
- ✅ Rate limiting
- ✅ Error handling with custom ApiError
- ✅ TypeScript support

## API Endpoints

### POST /auth/register
Register a new user
- **Body**: `{ name, email, password }`
- **Response**: User data + verification email sent

### POST /auth/login
Login user
- **Body**: `{ email, password }`
- **Response**: User data + access token + refresh token (httpOnly cookie)

### POST /auth/logout
Logout user
- **Body**: `{ refreshToken }` (optional, can use cookie)
- **Response**: Success message

### POST /auth/refresh
Refresh access token
- **Body**: `{ refreshToken }` (optional, can use cookie)
- **Response**: New access token

### POST /auth/forgot-password
Request password reset
- **Body**: `{ email }`
- **Response**: Success message (email sent if user exists)

### POST /auth/reset-password
Reset password with token
- **Body**: `{ token, password }`
- **Response**: Success message

### GET /auth/verify/:token
Verify email address
- **Params**: `token` (JWT token from email)
- **Response**: Success message

## Environment Variables

Required environment variables:
```env
# JWT Configuration
JWT_PRIVATE_KEY=your_jwt_secret_key
JWT_ACCESS_SECRET=your_access_token_secret (optional, falls back to JWT_PRIVATE_KEY)
JWT_REFRESH_SECRET=your_refresh_token_secret (optional, falls back to JWT_PRIVATE_KEY)
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Frontend URL for email links
FRONTEND_URL=http://localhost:3000

# Environment
NODE_ENV=development
```

## Integration Example

```typescript
// In your main app.ts or server.ts
import express from 'express';
import cookieParser from 'cookie-parser';
import { authRoutes } from './modules/auth';
import { ErrorHandler } from './middlewares/errorHandler';

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser()); // Required for refresh token cookies

// Routes
app.use('/api/auth', authRoutes);

// Error handling (must be last)
app.use(ErrorHandler);

export default app;
```

## Usage Examples

### Register a User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

### Refresh Token
```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "your_refresh_token"
  }'
```

### Forgot Password
```bash
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com"
  }'
```

## Security Features

1. **Password Hashing**: Bcrypt with configurable salt rounds
2. **JWT Tokens**: Separate access and refresh tokens
3. **HttpOnly Cookies**: Refresh tokens stored securely
4. **Rate Limiting**: Prevents brute force attacks
5. **Email Verification**: Users must verify email before full access
6. **Token Expiry**: Short-lived access tokens, longer refresh tokens
7. **Input Validation**: Strong password requirements and email validation

## Token Flow

1. **Registration**: User registers → Email verification sent
2. **Login**: User logs in → Access token + Refresh token returned
3. **API Calls**: Use access token in Authorization header
4. **Token Refresh**: When access token expires, use refresh token
5. **Logout**: Invalidate refresh token

## Email Templates

The module includes HTML email templates for:
- **Welcome/Verification**: Sent after registration
- **Password Reset**: Sent when user requests password reset

## Error Handling

All endpoints use consistent error responses:
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error description"
}
```

## Production Considerations

1. **Use Redis**: Replace in-memory refresh token store with Redis
2. **Rate Limiting**: Configure appropriate limits for your use case
3. **Email Service**: Use professional email service (SendGrid, AWS SES)
4. **HTTPS**: Always use HTTPS in production
5. **Token Rotation**: Implement refresh token rotation for enhanced security
6. **Monitoring**: Add logging and monitoring for auth events