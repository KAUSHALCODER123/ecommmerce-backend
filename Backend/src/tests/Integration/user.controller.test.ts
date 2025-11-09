import request from 'supertest';
import { getTestApp } from '../testApp';
import { createAuthenticatedUser } from '../testUtils';

describe('User Controller', () => {
  let testApp: any;

  beforeAll(async () => {
    testApp = await getTestApp();
  });

  describe('GET /api/v1/users/profile', () => {
    it('should get user profile with valid token', async () => {
      const { authHeader, user } = await createAuthenticatedUser(testApp);

      const response = await request(testApp)
        .get('/api/v1/user/profile')
        .set('Authorization', authHeader)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe(user.email);
    });

    it('should return 401 without token', async () => {
      const response = await request(testApp)
        .get('/api/v1/user/profile')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PATCH /api/v1/users/profile', () => {
    it('should update user profile', async () => {
      const { authHeader } = await createAuthenticatedUser(testApp);

      const updateData = { name: 'Updated Name' };

      const response = await request(testApp)
        .patch('/api/v1/user/profile')
        .set('Authorization', authHeader)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(updateData.name);
    });
  });
});