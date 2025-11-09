import request from 'supertest';
import { getTestApp } from '../testApp';
import { createTestUser } from '../testUtils';

describe('Auth Controller', () => {
  let testApp: any;

  beforeAll(async () => {
    testApp = await getTestApp();
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
      };

      const response = await request(testApp)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(userData.email);
    });

    it('should return 400 for invalid data', async () => {
      const response = await request(testApp)
        .post('/api/v1/auth/register')
        .send({ email: 'invalid-email' })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login with valid credentials', async () => {
      await createTestUser({
        email: 'login@example.com',
        password: 'Password123!',
      });

      const response = await request(testApp)
        .post('/api/v1/auth/login')
        .send({
          email: 'login@example.com',
          password: 'Password123!',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.accessToken).toBeDefined();
    });

    it('should return 401 for invalid credentials', async () => {
      const response = await request(testApp)
        .post('/api/v1/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });
});