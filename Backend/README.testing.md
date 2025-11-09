# Testing & CI/CD Setup

## Overview
Complete testing setup with Jest, MongoDB Memory Server, and GitHub Actions CI/CD pipeline.

## Testing Stack
- **Jest**: Testing framework
- **ts-jest**: TypeScript support for Jest
- **Supertest**: HTTP assertion library
- **MongoDB Memory Server**: In-memory MongoDB for tests
- **Husky**: Git hooks
- **Lint-staged**: Run linters on staged files

## Test Structure
```
src/tests/
├── setup.ts              # Global test setup
├── testUtils.ts           # Test utilities
├── config/
│   └── testDb.ts         # Test database utilities
├── unit/                 # Unit tests
│   ├── auth.service.test.ts
│   ├── user.service.test.ts
│   └── product.service.test.ts
└── integration/          # Integration tests
    ├── auth.controller.test.ts
    └── user.controller.test.ts
```

## Available Scripts
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration

# Run tests in Docker
make test-docker
```

## Pre-commit Hooks
- Linting with ESLint
- Code formatting with Prettier
- Unit tests execution
- Staged files processing

## Pre-push Hooks
- Full test suite
- Build verification

## CI/CD Pipeline
GitHub Actions workflow includes:
- Multi-Node.js version testing (18.x, 20.x)
- Linting
- Testing with coverage
- Security audit
- Build verification
- Coverage reporting to Codecov

## Setup Instructions

1. **Install dependencies** (if not already installed):
```bash
npm install
```

2. **Initialize Husky**:
```bash
npm run prepare
```

3. **Run tests**:
```bash
npm test
```

4. **Check coverage**:
```bash
npm run test:coverage
```

## Test Environment Variables
Tests use these environment variables:
- `NODE_ENV=test`
- `JWT_SECRET=test-jwt-secret`
- `JWT_REFRESH_SECRET=test-refresh-secret`
- `REDIS_URL=redis://localhost:6379`

## Writing Tests

### Unit Test Example
```typescript
import { UserService } from '@modules/user/user.service';
import { createTestUser } from '../testUtils';

describe('UserService', () => {
  it('should create a user', async () => {
    const userData = { name: 'Test', email: 'test@example.com', password: 'password123' };
    const user = await UserService.createUser(userData);
    expect(user.email).toBe(userData.email);
  });
});
```

### Integration Test Example
```typescript
import request from 'supertest';
import { app } from '../../app';

describe('Auth Controller', () => {
  it('should register a user', async () => {
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({ name: 'Test', email: 'test@example.com', password: 'password123' })
      .expect(201);
    
    expect(response.body.success).toBe(true);
  });
});
```

## Coverage Goals
- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

## Docker Testing
Run tests in isolated Docker environment:
```bash
docker-compose -f docker-compose.test.yml up --build
```

## Troubleshooting

### Common Issues
1. **MongoDB Memory Server fails**: Ensure sufficient memory and no port conflicts
2. **Tests timeout**: Increase timeout in Jest config or individual tests
3. **Path resolution**: Check tsconfig.json paths match Jest moduleNameMapping

### Debug Tests
```bash
# Run specific test file
npm test -- auth.service.test.ts

# Run tests with verbose output
npm test -- --verbose

# Debug with Node inspector
node --inspect-brk node_modules/.bin/jest --runInBand
```