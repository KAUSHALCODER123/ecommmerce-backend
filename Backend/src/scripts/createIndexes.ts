import mongoose from 'mongoose';
import logger from '../config/logger';

export const createOptimizedIndexes = async () => {
  try {
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not established');
    }

    // User collection indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ role: 1 });
    await db.collection('users').createIndex({ isVerified: 1 });
    await db.collection('users').createIndex({ createdAt: -1 });

    // Product collection indexes
    await db.collection('products').createIndex({ category: 1 });
    await db.collection('products').createIndex({ price: 1 });
    await db.collection('products').createIndex({ stock: 1 });
    await db.collection('products').createIndex({ createdBy: 1 });
    await db.collection('products').createIndex({ name: 'text', description: 'text' });
    await db.collection('products').createIndex({ createdAt: -1 });

    // Order collection indexes
    await db.collection('orders').createIndex({ userId: 1, createdAt: -1 });
    await db.collection('orders').createIndex({ status: 1 });
    await db.collection('orders').createIndex({ 'paymentInfo.status': 1 });
    await db.collection('orders').createIndex({ orderId: 1 }, { unique: true });

    logger.info({ message: 'Database indexes created successfully' });
  } catch (error) {
    logger.error({ message: 'Failed to create indexes', error });
    throw error;
  }
};