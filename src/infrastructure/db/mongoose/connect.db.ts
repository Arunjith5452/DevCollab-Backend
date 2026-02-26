import { logger } from '@/infrastructure/providers/logs/logger';
import mongoose from 'mongoose';

export class DatabaseService {
    static async connect(): Promise<void> {
        try {
            if (!process.env.MONGO_URI) {
                throw new Error("MONGO_URI environment variable is not defined");
            }
            const { connection: { host, name } } = await mongoose.connect(process.env.MONGO_URI, {
                maxPoolSize: 100,
                minPoolSize: 10,
            });
            logger.info('Connected to MongoDB', host, name);
        } catch (error) {
            logger.error('Database connection error:', error);
            process.exit(1);
        }
    }
}