import { createUser, getUserById } from '../../modules/user/user.service';

import { createTestUser } from '../testUtils';

describe('User Service', () => {
  describe('createUser', () => {
    it('should create a new user', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      const user = await createUser(userData);

      expect(user).toBeDefined();
      expect(user.email).toBe(userData.email);
      expect(user.name).toBe(userData.name);
      expect((user as any).password).toBeUndefined(); // Should not include password
    });

    it('should throw error for duplicate email', async () => {
      await createTestUser({ email: 'duplicate@example.com' });

      await expect(
        createUser({
          name: 'Test',
          email: 'duplicate@example.com',
          password: 'password123',
        })
      ).rejects.toThrow();
    });
  });

  describe('getUserById', () => {
    it('should return user by id', async () => {
      const testUser = await createTestUser();
      const user = await getUserById((testUser._id as any).toString());

      expect(user).toBeDefined();
      expect(user?._id.toString()).toBe((testUser._id as any).toString());
    });

    it('should return null for non-existent user', async () => {
      const user = await getUserById('507f1f77bcf86cd799439011');
      expect(user).toBeNull();
    });
  });
});