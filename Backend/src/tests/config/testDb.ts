import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

class TestDatabase {
  private mongoServer: MongoMemoryServer | null = null;

  async connect(): Promise<void> {
    this.mongoServer = await MongoMemoryServer.create();
    const uri = this.mongoServer.getUri();
    await mongoose.connect(uri);
  }

  async disconnect(): Promise<void> {
    if (this.mongoServer) {
      await mongoose.disconnect();
      await this.mongoServer.stop();
      this.mongoServer = null;
    }
  }

  async clearDatabase(): Promise<void> {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  }
}

export const testDb = new TestDatabase();