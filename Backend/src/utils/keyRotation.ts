import { generateKeyPairSync } from 'crypto';
import fs from 'fs';
import path from 'path';
import logger from '../config/logger';

export class KeyRotationService {
  private keysDir = path.join(process.cwd(), 'keys');

  constructor() {
    this.ensureKeysDir();
  }

  private ensureKeysDir() {
    if (!fs.existsSync(this.keysDir)) {
      fs.mkdirSync(this.keysDir, { recursive: true });
    }
  }

  generateKeyPair(): { publicKey: string; privateKey: string } {
    const { publicKey, privateKey } = generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
      }
    });

    return { publicKey, privateKey };
  }

  rotateKeys(): void {
    try {
      const { publicKey, privateKey } = this.generateKeyPair();
      const timestamp = Date.now();

      // Save new keys
      fs.writeFileSync(
        path.join(this.keysDir, `private-${timestamp}.pem`),
        privateKey
      );
      fs.writeFileSync(
        path.join(this.keysDir, `public-${timestamp}.pem`),
        publicKey
      );

      // Update current key symlinks
      const currentPrivate = path.join(this.keysDir, 'current-private.pem');
      const currentPublic = path.join(this.keysDir, 'current-public.pem');

      if (fs.existsSync(currentPrivate)) fs.unlinkSync(currentPrivate);
      if (fs.existsSync(currentPublic)) fs.unlinkSync(currentPublic);

      fs.symlinkSync(`private-${timestamp}.pem`, currentPrivate);
      fs.symlinkSync(`public-${timestamp}.pem`, currentPublic);

      logger.info({ message: 'JWT keys rotated successfully', timestamp });
    } catch (error) {
      logger.error({ message: 'Key rotation failed', error });
      throw error;
    }
  }

  getCurrentKeys(): { publicKey: string; privateKey: string } | null {
    try {
      const privateKeyPath = path.join(this.keysDir, 'current-private.pem');
      const publicKeyPath = path.join(this.keysDir, 'current-public.pem');

      if (!fs.existsSync(privateKeyPath) || !fs.existsSync(publicKeyPath)) {
        return null;
      }

      return {
        privateKey: fs.readFileSync(privateKeyPath, 'utf8'),
        publicKey: fs.readFileSync(publicKeyPath, 'utf8')
      };
    } catch (error) {
      logger.error({ message: 'Failed to read current keys', error });
      return null;
    }
  }
}