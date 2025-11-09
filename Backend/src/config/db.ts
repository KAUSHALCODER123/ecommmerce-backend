import mongoose from "mongoose";
 // Good choice for async delay
import logger from "./logger";



const ConnectDB = async (retryCounter = 0) => {
    try {


        // 1. Attempt the connection
        const MONGO_INSTANCE = await mongoose.connect(
            `${process.env.MONGODB_URI}/${process.env.MONGO_DB_NAME}`,
            {
                serverSelectionTimeoutMS: 5000,
                maxPoolSize: 10,
                socketTimeoutMS: 45000,
            }
        );

        // 2. Log success
        logger.info(`\n🎉 MongoDB successfully connected!! Host: ${MONGO_INSTANCE.connection.host}`);
        
  
}
     catch (error) {
        // 3. Log the connection error
        logger.error(`\n❌ Initial MongoDB connection failed. `);
        logger.error(`Error details:${error}`);

        // 4. Check if max retries have been reached
      
            process.exit(1);
        
    }

}

export default ConnectDB;