# E-commerce Backend API

TypeScript + Express + MongoDB backend with comprehensive testing and CI/CD.

## Quick Start

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env.development

# Setup git hooks
npm run prepare

# Run in development
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm test` | Run all tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage |
| `npm run test:unit` | Run unit tests only |
| `npm run test:integration` | Run integration tests only |

## Testing

- **Framework**: Jest with TypeScript support
- **Database**: MongoDB Memory Server for isolated tests
- **HTTP Testing**: Supertest for API endpoint testing
- **Coverage**: Comprehensive coverage reporting
- **CI/CD**: GitHub Actions with multi-Node.js version testing

See [README.testing.md](./README.testing.md) for detailed testing documentation.

## Project Structure

```
src/
├── config/           # Configuration files
├── modules/          # Feature modules (auth, user, product, orders)
├── middlewares/      # Express middlewares
├── utils/           # Utility functions
├── tests/           # Test files
├── loaders/         # Application loaders
└── app.ts           # Express app setup
```

## Features

- ✅ TypeScript with strict mode
- ✅ Express.js with security middlewares
- ✅ MongoDB with Mongoose ODM
- ✅ JWT authentication with refresh tokens
- ✅ Input validation with Zod
- ✅ Comprehensive error handling
- ✅ Request logging with Pino
- ✅ Rate limiting and security headers
- ✅ File upload with Cloudinary
- ✅ Email service with Nodemailer
- ✅ Redis caching support
- ✅ Comprehensive testing suite
- ✅ CI/CD with GitHub Actions
- ✅ Pre-commit hooks with Husky
- ✅ Code formatting and linting

## Environment Variables

Create `.env.development`, `.env.production`, and `.env.test` files:

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
REDIS_URL=redis://localhost:6379
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## API Documentation

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/logout` - Logout user
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password` - Reset password

### Users
- `GET /api/v1/users/profile` - Get user profile
- `PATCH /api/v1/users/profile` - Update user profile
- `GET /api/v1/users` - List users (admin only)

### Products
- `GET /api/v1/products` - List products
- `POST /api/v1/products` - Create product (admin only)
- `GET /api/v1/products/:id` - Get product by ID
- `PATCH /api/v1/products/:id` - Update product (admin only)
- `DELETE /api/v1/products/:id` - Delete product (admin only)

### Orders
- `GET /api/v1/orders` - List user orders
- `POST /api/v1/orders` - Create new order
- `GET /api/v1/orders/:id` - Get order by ID
- `PATCH /api/v1/orders/:id/status` - Update order status (admin only)

## Deployment

### Docker
```bash
docker build -t ecommerce-backend .
docker run -p 3000:3000 ecommerce-backend
```

### Production Checklist
- [ ] Set production environment variables
- [ ] Configure MongoDB Atlas
- [ ] Setup Redis Cloud
- [ ] Configure email service
- [ ] Setup monitoring (Sentry, DataDog)
- [ ] Configure reverse proxy (Nginx)
- [ ] Enable HTTPS/TLS
- [ ] Setup backup strategy

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

MIT License - see [LICENSE](LICENSE) file for details.