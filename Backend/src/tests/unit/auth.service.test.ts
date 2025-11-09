import { loginUser } from '../../modules/auth/auth.service';
import { createTestUser } from '../testUtils';

describe('AuthService', () => {
  describe('login', () => {
    it('should login with valid credentials', async () => {
      const testUser = await createTestUser({
        email: 'login@example.com',
        password: 'password123',
      });

      const result = await loginUser({
        email: 'login@example.com',
        password: 'password123',
      });

      expect(result).toBeDefined();
      expect(result.user.id).toBe((testUser._id as any).toString());
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });

    it('should throw error for invalid email', async () => {
      await expect(
        loginUser({
          email: 'nonexistent@example.com',
          password: 'password123',
        })
      ).rejects.toThrow('Invalid email or password');
    });

    it('should throw error for invalid password', async () => {
      await createTestUser({
        email: 'test@example.com',
        password: 'password123',
      });

      await expect(
        loginUser({
          email: 'test@example.com',
          password: 'wrongpassword',
        })
      ).rejects.toThrow('Invalid email or password');
    });
  });
});