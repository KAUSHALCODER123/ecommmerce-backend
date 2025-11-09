# User Module

This module provides complete user management functionality with authentication, authorization, validation, and rate limiting.

## Features

- ✅ User CRUD operations
- ✅ Password hashing with bcrypt
- ✅ Input validation with Zod
- ✅ Authentication middleware
- ✅ Admin permission guards
- ✅ Rate limiting
- ✅ Error handling with custom ApiError
- ✅ Pagination support
- ✅ TypeScript support

## API Endpoints

### POST /api/users
Create a new user (Admin only)
- **Auth Required**: Yes (Admin)
- **Body**: `{ name, email, password, role?, avatar? }`

### GET /api/users
List all users with pagination (Admin only)
- **Auth Required**: Yes (Admin)
- **Query Params**: `page`, `limit`, `name`, `email`, `role`, `isVerified`

### GET /api/users/:id
Get user by ID (Authenticated users)
- **Auth Required**: Yes
- **Params**: `id` (MongoDB ObjectId)

### PATCH /api/users/:id
Update user (Admin only)
- **Auth Required**: Yes (Admin)
- **Params**: `id` (MongoDB ObjectId)
- **Body**: `{ name?, email?, avatar? }`

### DELETE /api/users/:id
Delete user (Admin only)
- **Auth Required**: Yes (Admin)
- **Params**: `id` (MongoDB ObjectId)

## Integration Example

```typescript
// In your main app.ts or server.ts
import express from 'express';
import { userRoutes } from './modules/user';
import { ErrorHandler } from './middlewares/errorHandler';

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);

// Error handling (must be last)
app.use(ErrorHandler);

export default app;
```

## Middleware Stack

Each route uses the following middleware stack:
1. **Rate Limiter** - Prevents abuse (100 requests per 15 minutes)
2. **Authentication** - Validates JWT token
3. **Permission Guard** - Checks admin role (where required)
4. **Request Validation** - Validates request body with Zod schemas
5. **Controller** - Handles business logic
6. **Error Handler** - Catches and formats errors

## Environment Variables

Make sure to set these environment variables:
```env
JWT_PRIVATE_KEY=your_jwt_secret_key
BCRYPT_SALT_ROUNDS=10
NODE_ENV=development
```

## Usage Examples

### Creating a User (Admin)
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -H "x-auth-token: YOUR_ADMIN_JWT_TOKEN" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "role": "user"
  }'
```

### Listing Users with Filters
```bash
curl "http://localhost:3000/api/users?page=1&limit=10&role=user" \
  -H "x-auth-token: YOUR_ADMIN_JWT_TOKEN"
```

### Getting a User
```bash
curl http://localhost:3000/api/users/USER_ID \
  -H "x-auth-token: YOUR_JWT_TOKEN"
```