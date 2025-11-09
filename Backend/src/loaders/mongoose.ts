import ConnectDB from "../config/db";
import logger from "../config/logger";
import mongoose from "mongoose";
import { setTimeout } from "timers/promises"; // 👈 Import required for awaited setTimeout

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 5000;
export const closeDatabase = async () => {
    await mongoose.connection.close();
    logger.info('MongoDB connection closed.');
};
// 1. Wrap the entire connection logic in an async function
const initializeDatabase = async (retryCount = 0) => {
    try {
        await ConnectDB(); // 2. Wait for the connection to succeed
        if (mongoose.connection.listenerCount('connected') === 0) {
            mongoose.connection.on('connected', () => logger.info('connected'));
            mongoose.connection.on('open', () => logger.info('open'));
            mongoose.connection.on('disconnected', () => logger.info('disconnected'));
            mongoose.connection.on('reconnected', () => logger.info('reconnected'));
            mongoose.connection.on('disconnecting', () => logger.info('disconnecting'));
            mongoose.connection.on('close', () => logger.info('close'));
        }
        logger.info("MongoDB connected successfully");


        // 3. Setup cleanup logic on successful connection
        if (process.listenerCount('SIGINT') === 0) {
            ['SIGINT', 'SIGTERM'].forEach(signal => {
                process.on(signal, async () => {
                    try {
                        logger.info(`Received ${signal}. Closing MongoDB connection...`);
                        await closeDatabase();
                        process.exit(0);
                    } catch (err) {
                        logger.error(`Error closing MongoDB connection: ${err instanceof Error ? err.message : err}`);
                        process.exit(1);
                    }
                });
            });
        }
        return mongoose.connection;

    } catch (error) {
        // 4. Handle initial connection failure
        logger.error(`Error Connecting MongoDB:${error instanceof Error ? error.message : error}`);

        // 5. Check retry condition
        if (retryCount < MAX_RETRIES - 1) {
            const retriesLeft = MAX_RETRIES - 1 - retryCount;
            logger.error(`\n❌ Initial MongoDB connection failed. Retries left: ${retriesLeft}`);

            logger.info(`\n⏳ Retrying connection in ${RETRY_DELAY_MS / 1000} seconds...`);

            // 6. Wait for the delay using the imported setTimeout
            await setTimeout(RETRY_DELAY_MS);
            logger.warn(`[${new Date().toISOString()}] Retrying MongoDB connection...`);

            // 7. Recursively call the function for the next attempt
            await initializeDatabase(retryCount + 1);
        } else {
            // 8. Exit the process if max retries are exceeded
            logger.error("\n💀 MAX RETRIES REACHED. Exiting process.");
            process.exit(1); // Exit with a non-zero code to indicate failure
        }
    }
};

// 9. Start the process
export default initializeDatabase;