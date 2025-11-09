import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
import logger from '../config/logger';

const execAsync = promisify(exec);

export class BackupService {
  private backupDir = path.join(process.cwd(), 'backups');

  constructor() {
    this.ensureBackupDir();
  }

  private ensureBackupDir() {
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
  }

  async createBackup(): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupName = `backup-${timestamp}`;
    const backupPath = path.join(this.backupDir, `${backupName}.gz`);

    try {
      const mongoUri = process.env.MONGODB_URI!;

      const command = `mongodump --uri="${mongoUri}" --archive="${backupPath}" --gzip`;
      
      logger.info({ message: 'Starting database backup', backupName });
      
      await execAsync(command);
      
      logger.info({ message: 'Backup completed successfully', backupPath });
      
      // Clean up old backups (keep last 7 days)
      await this.cleanupOldBackups();
      
      return backupPath;
    } catch (error) {
      logger.error({ message: 'Backup failed', error });
      throw error;
    }
  }

  async restoreBackup(backupPath: string): Promise<void> {
    try {
      const mongoUri = process.env.MONGODB_URI!;
      const command = `mongorestore --uri="${mongoUri}" --archive="${backupPath}" --gzip --drop`;
      
      logger.info({ message: 'Starting database restore', backupPath });
      
      await execAsync(command);
      
      logger.info({ message: 'Restore completed successfully' });
    } catch (error) {
      logger.error({ message: 'Restore failed', error });
      throw error;
    }
  }

  private async cleanupOldBackups(): Promise<void> {
    const files = fs.readdirSync(this.backupDir);
    const backupFiles = files
      .filter(file => file.startsWith('backup-') && file.endsWith('.gz'))
      .map(file => ({
        name: file,
        path: path.join(this.backupDir, file),
        mtime: fs.statSync(path.join(this.backupDir, file)).mtime
      }))
      .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());

    // Keep only the latest 7 backups
    const toDelete = backupFiles.slice(7);
    
    for (const file of toDelete) {
      fs.unlinkSync(file.path);
      logger.info({ message: 'Deleted old backup', filename: file.name });
    }
  }
}