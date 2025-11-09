import cron from 'node-cron';
import logger from '../config/logger';
import { BackupService } from '../scripts/backup';
import { User } from '../modules/user/user.model';
import { Order } from '../modules/orders/order.model';

export class JobScheduler {
  private backupService = new BackupService();

  start() {
    // Daily backup at 2 AM
    cron.schedule('0 2 * * *', async () => {
      try {
        await this.backupService.createBackup();
      } catch (error) {
        logger.error({ message: 'Scheduled backup failed', error });
      }
    });

    // Clean up unverified users every day at 3 AM
    cron.schedule('0 3 * * *', async () => {
      try {
        await this.cleanupUnverifiedUsers();
      } catch (error) {
        logger.error({ message: 'User cleanup failed', error });
      }
    });

    // Clean up abandoned orders every hour
    cron.schedule('0 * * * *', async () => {
      try {
        await this.cleanupAbandonedOrders();
      } catch (error) {
        logger.error({ message: 'Order cleanup failed', error });
      }
    });

    logger.info({ message: 'Background jobs scheduled successfully' });
  }

  private async cleanupUnverifiedUsers(): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 7); // 7 days ago

    const result = await User.deleteMany({
      isVerified: false,
      createdAt: { $lt: cutoffDate }
    });

    logger.info({
      message: 'Cleaned up unverified users',
      deletedCount: result.deletedCount
    });
  }

  private async cleanupAbandonedOrders(): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setHours(cutoffDate.getHours() - 24); // 24 hours ago

    const result = await Order.deleteMany({
      status: 'pending',
      'paymentInfo.status': 'pending',
      createdAt: { $lt: cutoffDate }
    });

    logger.info({
      message: 'Cleaned up abandoned orders',
      deletedCount: result.deletedCount
    });
  }
}