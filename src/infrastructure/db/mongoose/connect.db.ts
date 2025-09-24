import mongoose from 'mongoose';

export class DatabaseService {
    static async connect(): Promise<void> {
        try {
            const { connection: { host,name } } = await mongoose.connect(process.env.MONGO_URI!);
            console.log('Connected to MongoDB',host,name);
        } catch (error) {
            console.error('Database connection error:', error);
            process.exit(1);
        }
    }
}